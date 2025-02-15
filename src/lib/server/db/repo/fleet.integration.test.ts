import type { PaginationWithFilters } from '$lib/api/common';
import type { CreateFleetBody, GetFleetsFilters, UpdateFleetBody } from '$lib/api/fleet.schema';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	createOrgFleet,
	deleteFleetById,
	findOrgFleetById,
	findOrgFleetsWithPagination,
	updateOrgFleet
} from './fleet';

describe('fleet repo', async () => {
	let testDb: TestDbHelper;

	const orgId = 1;

	const newFleetData: CreateFleetBody = {
		name: 'Test Fleet',
		description: 'A test fleet for integration testing'
	};

	const updatedFleetData: UpdateFleetBody = {
		name: 'Updated Test Fleet',
		description: 'An updated test fleet for integration testing'
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('fleet_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('deleteFleetById / findOrgFleetById', async () => {
		const fleet = await createOrgFleet(orgId, newFleetData);
		expect(fleet).toMatchObject(newFleetData);

		let foundFleet = await findOrgFleetById({ orgId, id: fleet.id });
		expect(foundFleet).toMatchObject(newFleetData);

		await deleteFleetById({ orgId, id: fleet.id });

		foundFleet = await findOrgFleetById({ orgId, id: fleet.id });
		expect(foundFleet).toBeUndefined();
	});

	test('createOrgFleet', async () => {
		const fleet = await createOrgFleet(orgId, newFleetData);
		expect(fleet).toMatchObject(newFleetData);
	});

	test('updateOrgFleet', async () => {
		const fleet = await createOrgFleet(orgId, newFleetData);
		expect(fleet).toMatchObject(newFleetData);

		const updatedFleet = await updateOrgFleet({ id: fleet.id, orgId }, updatedFleetData);
		expect(updatedFleet).toMatchObject(updatedFleetData);
	});

	test('findOrgFleetsWithPagination', async () => {
		const fleetsToCreate = [
			{ name: 'Fleet 1', description: 'First fleet' },
			{ name: 'Fleet 2', description: 'Second fleet' },
			{ name: 'Fleet 3', description: 'Third fleet' }
		];

		for (const data of fleetsToCreate) {
			await createOrgFleet(orgId, data);
		}

		const firstPageInput: PaginationWithFilters<GetFleetsFilters> = {
			pagination: { page: 1, pageSize: 2 }
		};

		const res = await findOrgFleetsWithPagination(orgId, firstPageInput);

		expect(res.itemCount).toBeGreaterThanOrEqual(fleetsToCreate.length);
		expect(res.pageCount).toEqual(Math.ceil(res.itemCount / firstPageInput.pagination.pageSize));
		expect(res.records.length).toBeLessThanOrEqual(firstPageInput.pagination.pageSize);

		expect(res.records.every((f) => f.organizationId === orgId)).toBe(true);
	});
});
