import type { CreateTrackerBody, UpdateTrackerBody } from '$lib/api/tracker.schema';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	createOrgTracker,
	deleteOrgTrackerById,
	filterVehicleTrackerIdsByAssertingBelongsToOrg,
	findOrgTrackerById,
	findOrgTrackersWithPagination,
	findTrackerLastLocation,
	findTrackerLocationList,
	updateOrgTracker
} from './vehicle-tracker';

describe('tracker repo', async () => {
	let testDb: TestDbHelper;

	const orgId = 1;
	const trackerId = 1;

	const newTrackerData: CreateTrackerBody = {
		imei: '123456789012345',
		model: 'H02'
	};

	const updatedTrackerData: UpdateTrackerBody = {
		imei: '987654321098765',
		vehicleId: 1
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('vehicle_tracker_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('filterVehicleTrackerIdsByAssertingBelongsToOrg', async () => {
		const tracker = await createOrgTracker(orgId, newTrackerData);

		const validTrackerIds = await filterVehicleTrackerIdsByAssertingBelongsToOrg(
			[tracker.id],
			orgId
		);
		expect(validTrackerIds).toContain(tracker.id);

		const invalidTrackerIds = await filterVehicleTrackerIdsByAssertingBelongsToOrg([999], orgId);
		expect(invalidTrackerIds).toEqual([]);
	});

	test('deleteOrgTrackerById / findOrgTrackerById', async () => {
		let tracker = await findOrgTrackerById(trackerId, orgId);
		expect(tracker).toMatchObject({ id: trackerId, organizationId: orgId });

		await deleteOrgTrackerById(trackerId, orgId, false);

		tracker = await findOrgTrackerById(trackerId, orgId);
		expect(tracker).toBeUndefined();
	});

	test('createOrgTracker', async () => {
		const data = { ...newTrackerData, imei: '99999999321' };

		const tracker = await createOrgTracker(orgId, data);
		expect(tracker).toMatchObject(data);
	});

	test('updateOrgTracker', async () => {
		const newTracker = { ...newTrackerData, imei: '111111111111111' };

		let tracker = await createOrgTracker(orgId, newTracker);
		expect(tracker).toMatchObject(newTracker);

		tracker = await updateOrgTracker(tracker.id, orgId, updatedTrackerData);
		expect(tracker).toMatchObject(updatedTrackerData);
	});

	test('findOrgTrackersWithPagination', async () => {
		const firstPageInput = {
			pagination: { page: 1, pageSize: 5 }
		};

		const res = await findOrgTrackersWithPagination(orgId, firstPageInput);

		expect(res.itemCount).toBeGreaterThan(0);
		expect(res.pageCount).toEqual(Math.ceil(res.itemCount / firstPageInput.pagination.pageSize));
		expect(res.records.every((i) => i.organizationId === orgId)).toBe(true);
	});

	test('findTrackerLocationList', async () => {
		const filters = {
			before: new Date().toISOString(),
			after: new Date('2020-01-01').toISOString(),
			limit: 10
		};

		const locations = await findTrackerLocationList(trackerId, filters);
		expect(locations.length).toBeLessThanOrEqual(filters.limit);
	});

	test('findTrackerLastLocation', async () => {
		const lastLocation = await findTrackerLastLocation(trackerId);
		expect(lastLocation).toBeDefined();
	});
});
