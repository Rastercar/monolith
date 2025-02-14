import type { CreateUserBody } from '$lib/api/user.schema';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	blockOrgUserById,
	checkEmailIsInUse,
	createOrgUser,
	deleteOrgUserById,
	findOrgUserById,
	findOrgUsersWithPagination,
	findUserBy,
	findUserByConfirmEmailToken,
	findUserByEmail,
	findUserById,
	findUserByIdWithOrgAndAccessLevel,
	findUserByResetPasswordToken,
	findUserBySessionToken,
	findUserByUsername,
	setConfirmEmailToken,
	setEmailVerifiedAndClearConfirmEmailToken,
	setOrgUserAccessLevel,
	setPasswordAndClearResetPasswordToken,
	setUserResetPasswordToken,
	signUpUser,
	unblockOrgUserById,
	updateUser,
	updateUserPassword,
	updateUserProfilePicture
} from './user';

describe('user repo', async () => {
	let testDb: TestDbHelper;

	const orgId = 1;
	const userId = 2;

	const newUserData: CreateUserBody = {
		email: 'test@example.com',
		username: 'testuser',
		password: 'password123',
		accessLevelId: 1,
		passwordConfirmation: 'password123',
		setPasswordChangeOnFirstSignIn: true
	};

	const updatedUserData = {
		email: 'updated@example.com',
		username: 'updateduser'
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('user_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('createOrgUser', async () => {
		const user = await createOrgUser(orgId, newUserData);
		expect(user).toMatchObject({ email: newUserData.email, username: newUserData.username });
	});

	test('findOrgUserById', async () => {
		const user = await findOrgUserById({ id: 5, orgId });
		expect(user).toMatchObject({ id: 5, organizationId: orgId });
	});

	test('findOrgUsersWithPagination', async () => {
		const firstPageInput = {
			pagination: { page: 1, pageSize: 5 }
		};

		const res = await findOrgUsersWithPagination(orgId, firstPageInput);

		expect(res.itemCount).toBeGreaterThan(0);
		expect(res.pageCount).toEqual(Math.ceil(res.itemCount / firstPageInput.pagination.pageSize));
		expect(res.records.every((i) => i.organizationId === orgId)).toBe(true);
	});

	test('findUserBy', async () => {
		const userByEmail = await findUserBy('email', newUserData.email);
		expect(userByEmail).toMatchObject({ email: newUserData.email });

		const userByUsername = await findUserBy('username', newUserData.username);
		expect(userByUsername).toMatchObject({ username: newUserData.username });
	});

	test('findUserById', async () => {
		const user = await findUserById(userId);
		expect(user).toMatchObject({ id: userId });
	});

	test('findUserByIdWithOrgAndAccessLevel', async () => {
		const user = await findUserByIdWithOrgAndAccessLevel(userId);
		expect(user).toMatchObject({ id: userId });
		expect(user).toHaveProperty('organization');
		expect(user).toHaveProperty('accessLevel');
	});

	test('findUserByUsername', async () => {
		const user = await findUserByUsername(newUserData.username);
		expect(user).toMatchObject({ username: newUserData.username });
	});

	test('findUserByEmail', async () => {
		const user = await findUserByEmail(newUserData.email);
		expect(user).toMatchObject({ email: newUserData.email });
	});

	test('findUserByConfirmEmailToken', async () => {
		const token = 'ba1b43d5-b5ca-4a45-9cc8-d91dde241f2e';
		await setConfirmEmailToken(userId, token);

		const user = await findUserByConfirmEmailToken(token);
		expect(user).toMatchObject({ id: userId, confirmEmailToken: token });
	});

	test('findUserByResetPasswordToken', async () => {
		const token = '1bb85ff4-460a-471b-a365-dc3870e1cb0a';
		await setUserResetPasswordToken(userId, token);

		const user = await findUserByResetPasswordToken(token);
		expect(user).toMatchObject({ id: userId, resetPasswordToken: token });
	});

	test('findUserBySessionToken', async () => {
		const token = '5c573163-7629-4901-938e-7239453bc7af';
		const user = await findUserBySessionToken(token);
		expect(user).toBeDefined();
	});

	test('setOrgUserAccessLevel', async () => {
		const userId = 4;

		const accessLevelId = 2;
		await setOrgUserAccessLevel({ userId, orgId, accessLevelId });

		const user = await findOrgUserById({ id: userId, orgId });
		expect(user).toMatchObject({ accessLevelId });
	});

	test('setUserResetPasswordToken', async () => {
		const token = 'f3531542-0660-4907-9f28-c9fec5cc4fde';
		await setUserResetPasswordToken(userId, token);

		const user = await findUserById(userId);
		expect(user).toMatchObject({ resetPasswordToken: token });
	});

	test('setPasswordAndClearResetPasswordToken', async () => {
		const token = '474f8a49-637f-4d9e-8bde-1fc99d3dd379';
		const newPassword = 'new-password';

		await setUserResetPasswordToken(userId, token);
		await setPasswordAndClearResetPasswordToken(newPassword, token);

		const user = await findUserById(userId);
		expect(user).toMatchObject({ resetPasswordToken: null });
	});

	test('setConfirmEmailToken', async () => {
		const token = '6e807d3d-aae1-4be6-a01a-54cc178602ae';
		await setConfirmEmailToken(userId, token);

		const user = await findUserById(userId);
		expect(user).toMatchObject({ confirmEmailToken: token });
	});

	test('setEmailVerifiedAndClearConfirmEmailToken', async () => {
		const token = 'ab0922fe-6ac0-462f-ab14-d8504551c5d6';
		await setConfirmEmailToken(userId, token);
		await setEmailVerifiedAndClearConfirmEmailToken(token);

		const user = await findUserById(userId);
		expect(user).toMatchObject({ emailVerified: true, confirmEmailToken: null });
	});

	test('checkEmailIsInUse', async () => {
		const emailInUse = await checkEmailIsInUse(newUserData.email);
		expect(emailInUse).toBe(true);

		const emailNotInUse = await checkEmailIsInUse('not-in-use@example.com');
		expect(emailNotInUse).toBe(false);
	});

	test('signUpUser', async () => {
		const signUpData = {
			username: 'newuser',
			email: 'newuser@example.com',
			password: 'password123'
		};

		const result = await signUpUser(signUpData);

		expect(result.user).toMatchObject({ username: signUpData.username, email: signUpData.email });
		expect(result.organization).toMatchObject({ name: signUpData.username });
		expect(result.accessLevel).toMatchObject({ name: 'admin' });
	});

	test('updateUser', async () => {
		const user = await updateUser(userId, updatedUserData);

		expect(user).toMatchObject(updatedUserData);
	});

	test('updateUserProfilePicture', async () => {
		const s3Key = 'profile-picture-key';
		const user = await updateUserProfilePicture(userId, s3Key);

		expect(user).toMatchObject({ profilePicture: s3Key });
	});

	test('updateUserPassword', async () => {
		const newPassword = 'new-password';
		const user = await updateUserPassword(userId, newPassword);
		expect(user).toMatchObject({ password: newPassword });
	});

	test('blockOrgUserById', async () => {
		await blockOrgUserById({ id: 4, orgId });

		const user = await findOrgUserById({ id: 4, orgId });
		expect(user?.blocked).toBe(true);
	});

	test('unblockOrgUserById', async () => {
		await blockOrgUserById({ id: 3, orgId });
		await unblockOrgUserById({ id: 3, orgId });

		const user = await findOrgUserById({ id: 3, orgId });

		expect(user?.blocked).toBe(false);
	});

	test('deleteOrgUserById', async () => {
		await deleteOrgUserById({ id: 10, orgId });

		const user = await findOrgUserById({ id: 10, orgId });
		expect(user).toBeUndefined();
	});
});
