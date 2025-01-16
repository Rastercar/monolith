import type { PaginationWithFilters } from '$lib/api/common';
import type { CreateUserBody, GetUsersFilters, UpdateUserBody } from '$lib/api/user.schema';
import { allPermissions } from '$lib/constants/permissions';
import { hashSync } from '$lib/server/crypto';
import { and, eq, ilike, SQL } from 'drizzle-orm';
import { db } from '../db';
import { paginate } from '../pagination';
import { accessLevel, organization, session, user } from '../schema';

export async function findOrgUsersWithPagination(
	orgId: number,
	params: PaginationWithFilters<GetUsersFilters>
) {
	const { pagination, filters } = params;

	const sqlFilters: SQL[] = [eq(user.organizationId, orgId)];

	if (filters?.email) sqlFilters.push(ilike(user.email, `%${filters.email}%`));

	return paginate(pagination, user, sqlFilters);
}

export async function createOrgUser(orgId: number, body: CreateUserBody) {
	const [createdUser] = await db
		.insert(user)
		.values({ ...body, password: hashSync(body.password), organizationId: orgId })
		.returning();

	return createdUser;
}

export function findUserBy(
	col: 'resetPasswordToken' | 'email' | 'username' | 'confirmEmailToken',
	value: string
) {
	return db.query.user.findFirst({
		where: (user, { eq }) => eq(user[col], value)
	});
}

export function findUserById(id: number) {
	return db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, id)
	});
}

export function findOrgUserById(id: number, orgId: number) {
	return db.query.user.findFirst({
		where: (user, { eq, and }) => and(eq(user.id, id), eq(user.organizationId, orgId)),
		with: { accessLevel: true, organization: true }
	});
}

export function findUserByUsername(username: string) {
	return findUserBy('username', username);
}

export function findUserByEmail(email: string) {
	return findUserBy('email', email);
}

export function findUserByConfirmEmailToken(token: string) {
	return findUserBy('confirmEmailToken', token);
}

export function findUserByResetPasswordToken(token: string) {
	return findUserBy('resetPasswordToken', token);
}

export async function findUserBySessionToken(token: string) {
	const res = await db
		.select()
		.from(user)
		.innerJoin(session, eq(session.userId, user.id))
		.where(eq(session.sessionToken, token))
		.limit(1);

	return res.length ? res[0].user : null;
}

export function setOrgUserAccessLevel(ids: {
	userId: number;
	orgId: number;
	accessLevelId: number;
}) {
	return db
		.update(user)
		.set({ accessLevelId: ids.accessLevelId })
		.where(and(eq(user.id, ids.userId), eq(user.organizationId, ids.orgId)));
}

export function setUserResetPasswordToken(userId: number, token: string) {
	return db.update(user).set({ resetPasswordToken: token }).where(eq(user.id, userId));
}

export function setPasswordAndClearResetPasswordToken(password: string, token: string) {
	return db
		.update(user)
		.set({ password: password, resetPasswordToken: null })
		.where(eq(user.resetPasswordToken, token));
}

export function setConfirmEmailToken(userId: number, token: string) {
	return db.update(user).set({ confirmEmailToken: token }).where(eq(user.id, userId));
}

export function setEmailVerifiedAndClearConfirmEmailToken(token: string) {
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
export function signUpUser(args: { username: string; email: string; password: string }) {
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
				permissions: [...allPermissions],
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

export function updateUserPassword(id: number, hashedPassword: string) {
	return db.update(user).set({ password: hashedPassword }).where(eq(user.id, id)).returning();
}

export function deleteOrgUserById(id: number, orgId: number) {
	return db.delete(user).where(and(eq(user.id, id), eq(user.organizationId, orgId)));
}
