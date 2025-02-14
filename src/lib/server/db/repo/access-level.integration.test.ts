import type { CreateAccessLevelBody, UpdateAccessLevelBody } from '$lib/api/access-level.schema';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	countUsersUsingAccessLevel,
	createOrgAccessLevel,
	deleteOrgAccessLevelById,
	findOrgAccessLevelById,
	findOrgAccessLevelsWithPagination,
	updateOrgAccessLevel
} from './access-level';

describe('access level repo', async () => {
	let testDb: TestDbHelper;

	const orgId = 1;
	const accessLevelId = 3;

	const firstPageInput = {
		pagination: { page: 1, pageSize: 5 }
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('access_level_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('findOrgAccessLevelsWithPagination', async () => {
		const res = await findOrgAccessLevelsWithPagination(orgId, firstPageInput);

		expect(res.itemCount).toBeGreaterThan(0);

		expect(res.pageCount).toEqual(Math.ceil(res.itemCount / firstPageInput.pagination.pageSize));

		expect(res.records.every((i) => (i.organizationId = orgId))).toBe(true);
	});

	test('findOrgAccessLevelById', async () => {
		const result = await findOrgAccessLevelById({ id: accessLevelId, orgId });

		expect(result?.id).toBe(accessLevelId);
	});

	test('countUsersUsingAccessLevel', async () => {
		const result = await countUsersUsingAccessLevel(accessLevelId);
		expect(result).toBeTypeOf('number');
	});

	test('deleteOrgAccessLevelById', async () => {
		const accessLevelBeforeDeletion = await findOrgAccessLevelById({ id: 4, orgId });
		expect(accessLevelBeforeDeletion).toBeDefined();

		const result = await deleteOrgAccessLevelById({ id: 4, orgId });
		expect(result).toBeDefined();

		const accessLevelAfterDeletion = await findOrgAccessLevelById({ id: 4, orgId });
		expect(accessLevelAfterDeletion).toBeUndefined();
	});

	test('createOrgAccessLevel', async () => {
		const input: CreateAccessLevelBody = {
			name: '[test]-new-access-level',
			description: 'created during tests',
			permissions: ['CREATE_SIM_CARD']
		};

		const createdAccessLevel = await createOrgAccessLevel(orgId, input);
		expect(createdAccessLevel).toMatchObject(input);

		const accessLevel = await findOrgAccessLevelById({ id: createdAccessLevel.id, orgId });
		expect(accessLevel).toBeDefined();
	});

	test('updateOrgAccessLevel', async () => {
		const input: UpdateAccessLevelBody = {
			name: '[test]-updated-access-level',
			description: 'updated during tests',
			permissions: ['CREATE_SIM_CARD']
		};

		const accessLevelBefore = await findOrgAccessLevelById({ id: accessLevelId, orgId });
		expect(accessLevelBefore).not.toMatchObject(input);

		const updated = await updateOrgAccessLevel({ id: accessLevelId, orgId }, input);
		expect(updated).toMatchObject(input);
	});
});
