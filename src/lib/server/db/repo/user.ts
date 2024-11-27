import type { UpdateUserBody } from '$lib/api/user.schema';
import { allPermissions } from '$lib/constants/permissions';
import { hashSync } from '$lib/server/crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { accessLevel, organization, user } from '../schema';

export function findUserBy(
	col: 'resetPasswordToken' | 'email' | 'username' | 'confirmEmailToken',
	value: string
) {
	return db.query.user.findFirst({
		where: (user, { eq }) => eq(user[col], value)
	});
}

export async function findUserByUsername(username: string) {
	return findUserBy('username', username);
}

export async function findUserByEmail(email: string) {
	return findUserBy('email', email);
}

export async function findUserByConfirmEmailToken(token: string) {
	return findUserBy('confirmEmailToken', token);
}

export async function findUserByResetPasswordToken(token: string) {
	return findUserBy('resetPasswordToken', token);
}

export async function setUserResetPasswordToken(userId: number, token: string) {
	return db.update(user).set({ resetPasswordToken: token }).where(eq(user.id, userId));
}

export async function setPasswordAndClearResetPasswordToken(password: string, token: string) {
	return db
		.update(user)
		.set({ password: password, resetPasswordToken: null })
		.where(eq(user.resetPasswordToken, token));
}

export async function setConfirmEmailToken(userId: number, token: string) {
	return db.update(user).set({ confirmEmailToken: token }).where(eq(user.id, userId));
}

export async function setEmailVerifiedAndClearConfirmEmailToken(token: string) {
	return db
		.update(user)
		.set({ emailVerified: true, confirmEmailToken: null })
		.where(eq(user.confirmEmailToken, token));
}

export async function checkEmailIsInUse(email: string) {
	const foundUsersWithEmail = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, email))
		.limit(1);

	if (foundUsersWithEmail.length > 0) return true;

	const foundOrgsWithEmail = await db
		.select({ id: organization.id })
		.from(organization)
		.where(eq(organization.billingEmail, email))
		.limit(1);

	return foundOrgsWithEmail.length > 0;
}

/**
 * Signs up a new rastercar user, creating the user
 * their organization and the org root access level
 */
export async function signUpUser(args: { username: string; email: string; password: string }) {
	const { username, email, password } = args;

	return db.transaction(async (tx) => {
		const [createdOrg] = await tx
			.insert(organization)
			.values({
				name: username,
				blocked: false,
				billingEmail: email,
				billingEmailVerified: false
			})
			.returning();

		const [rootAccessLevel] = await tx
			.insert(accessLevel)
			.values({
				name: 'admin',
				isFixed: true,
				description: 'root access level',
				permissions: allPermissions,
				organizationId: createdOrg.id
			})
			.returning();

		const [createdUser] = await tx
			.insert(user)
			.values({
				email,
				username,
				password: hashSync(password),
				emailVerified: false,
				accessLevelId: rootAccessLevel.id,
				organizationId: createdOrg.id
			})
			.returning();

		await tx
			.update(organization)
			.set({ ownerId: createdUser.id })
			.where(eq(organization.id, createdOrg.id));

		return { user: createdUser, organization: createdOrg, accessLevel: rootAccessLevel };
	});
}

export async function updateUser(id: number, body: UpdateUserBody) {
	const [updatedUser] = await db.update(user).set(body).where(eq(user.id, id)).returning();
	return updatedUser;
}

export async function updateUserProfilePicture(id: number, s3Key: string | null) {
	const [updatedUser] = await db
		.update(user)
		.set({ profilePicture: s3Key })
		.where(eq(user.id, id))
		.returning();
	return updatedUser;
}
