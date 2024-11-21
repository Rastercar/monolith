import { allPermissions } from '$lib/constants/permissions';
import { hashSync } from '$lib/server/crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { accessLevel, organization, user } from '../schema';

export async function findUserByCredentials(credentials: { email: string; password: string }) {
	return db.query.user.findFirst({
		with: { accessLevel: true, organization: true },
		where: (user, { eq }) => eq(user.email, credentials.email)
	});
}

export async function findUserByUsername(username: string) {
	return db.query.user.findFirst({
		where: (user, { eq }) => eq(user.username, username)
	});
}

export async function findUserByEmail(email: string) {
	return db.query.user.findFirst({
		where: (user, { eq }) => eq(user.email, email)
	});
}

export async function confirmUserEmailAddressByToken(confirmEmailToken: string) {
	return db
		.update(user)
		.set({ emailVerified: true })
		.where(eq(user.confirmEmailToken, confirmEmailToken));
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
