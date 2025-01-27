import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	createVehicleTrackerLocation,
	findMultipleVehicleTrackerLastLocations
} from './vehicle-tracker-location';

describe('tracker location repo', async () => {
	let testDb: TestDbHelper;

	const trackerId = 1;

	const newLocationData = {
		time: new Date().toISOString(),
		vehicleTrackerId: trackerId,
		point: [10.123456, 20.654321] as [number, number]
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('vehicle_tracker_location_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('createVehicleTrackerLocation', async () => {
		const location = await createVehicleTrackerLocation(newLocationData);
		const { time: _, ...expected } = location;

		expect(location).toMatchObject(expected);
	});

	test('findMultipleVehicleTrackerLastLocations', async () => {
		const data = { ...newLocationData, time: new Date('2020-01-01').toISOString() };

		await createVehicleTrackerLocation(data);

		const lastLocations = await findMultipleVehicleTrackerLastLocations([trackerId]);
		expect(lastLocations.length).toBeGreaterThan(0);

		const lastLocation = lastLocations.find((loc) => loc.vehicleTrackerId === trackerId);

		expect(lastLocation).toBeDefined();
		expect(lastLocation).toHaveProperty('time');
		expect(lastLocation).toHaveProperty('point');
	});
});
