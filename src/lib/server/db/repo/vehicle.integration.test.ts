import type { CreateVehicleBody, UpdateVehicleBody } from '$lib/api/vehicle.schema';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	createOrgVehicle,
	deleteOrgVehicleById,
	findOrgVehicleById,
	findOrgVehiclesWithPagination,
	updateOrgVehicle,
	updateOrgVehiclePhoto
} from './vehicle';

describe('vehicle repo', async () => {
	let testDb: TestDbHelper;

	const orgId = 1;
	const vehicleId = 1;

	const newVehicleData: CreateVehicleBody = {
		plate: 'ABC1234',
		model: 'Tesla Model S',
		modelYear: 2023,
		color: 'Red',
		photo: null,
		brand: 'toyota',
		fabricationYear: null,
		chassisNumber: null,
		additionalInfo: null,
		fleetId: null
	};

	const updatedVehicleData: UpdateVehicleBody = {
		plate: 'XYZ5678',
		model: 'Tesla Model X',
		modelYear: 2022,
		color: 'Blue',
		fleetId: null
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('vehicle_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('createOrgVehicle', async () => {
		const vehicleData = { ...newVehicleData, photo: null };

		const vehicle = await createOrgVehicle(orgId, vehicleData);
		expect(vehicle).toMatchObject(vehicleData);
	});

	test('findOrgVehicleById', async () => {
		const vehicle = await findOrgVehicleById({ id: vehicleId, orgId });
		expect(vehicle).toMatchObject({ id: vehicleId, organizationId: orgId });
	});

	test('findOrgVehiclesWithPagination', async () => {
		const firstPageInput = {
			pagination: { page: 1, pageSize: 5 }
		};

		const res = await findOrgVehiclesWithPagination(orgId, firstPageInput);

		expect(res.itemCount).toBeGreaterThan(0);
		expect(res.pageCount).toEqual(Math.ceil(res.itemCount / firstPageInput.pagination.pageSize));
		expect(res.records.every((i) => i.organizationId === orgId)).toBe(true);
	});

	test('updateOrgVehicle', async () => {
		const vehicle = await updateOrgVehicle({ id: vehicleId, orgId }, updatedVehicleData);
		expect(vehicle).toMatchObject(updatedVehicleData);
	});

	test('updateOrgVehiclePhoto', async () => {
		const photo = 'new-photo-url';
		const vehicle = await updateOrgVehiclePhoto(vehicleId, photo);
		expect(vehicle).toMatchObject({ photo });
	});

	test('deleteOrgVehicleById', async () => {
		await deleteOrgVehicleById({ id: vehicleId, orgId });

		const vehicle = await findOrgVehicleById({ id: vehicleId, orgId });
		expect(vehicle).toBeUndefined();
	});
});
