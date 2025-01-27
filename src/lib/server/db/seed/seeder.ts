import { carBrands } from '$lib/constants/data/car-brands';
import { allPermissions } from '$lib/constants/permissions';
import { TRACKER_MODEL_H02 } from '$lib/constants/tracker-models';
import { hashSync } from '$lib/server/crypto';
import { pickRandomFromArray } from '$lib/utils/arrays';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { type DB } from '../db';
import type { Tx } from '../helpers';
import { accessLevel } from '../schema/access-level';
import { organization } from '../schema/organization';
import { simCard } from '../schema/sim-card';
import { user } from '../schema/user';
import { vehicle } from '../schema/vehicle';
import { vehicleTracker } from '../schema/vehicle-tracker';
import {
	fakeBrazilianVehiclePlate,
	fakeE164PhoneNumber,
	fakePinNumber,
	fakePukCode,
	fakeSsn
} from './faker';
import { apns, colors, vehicleModels } from './seed-data';

async function createMasterUser(tx: Tx) {
	const [al] = await tx
		.insert(accessLevel)
		.values({
			name: 'master access level',
			isFixed: true,
			description: 'fixed master access level for the master user',
			permissions: allPermissions
		})
		.returning();

	await tx.insert(user).values({
		username: 'test_master_user',
		email: 'rastercar.tests.001@gmail.com',
		emailVerified: true,
		password: hashSync('Contafake3!'),
		accessLevelId: al.id
	});
}

async function createTestUser(tx: Tx) {
	const [org] = await tx
		.insert(organization)
		.values({
			name: 'test user org',
			blocked: false,
			billingEmail: 'testuser@gmail.com',
			billingEmailVerified: false
		})
		.returning();

	const [al] = await tx
		.insert(accessLevel)
		.values({
			name: 'test user access level',
			isFixed: true,
			description: 'test user access level with all permissions',
			permissions: allPermissions,
			organizationId: org.id
		})
		.returning();

	const [u] = await tx
		.insert(user)
		.values({
			username: 'test_user',
			email: 'rastercar.tests.002@gmail.com',
			emailVerified: true,
			password: hashSync('Contafake3!'),
			description: faker.word.words(5),
			organizationId: org.id,
			accessLevelId: al.id
		})
		.returning();

	await tx.update(organization).set({ ownerId: u.id }).where(eq(organization.id, org.id));

	return u;
}

async function genVehicle(organizationId: number, tx: Tx) {
	const fabricationYear = faker.number.int({ min: 2000, max: 2004 });

	const [v] = await tx
		.insert(vehicle)
		.values({
			plate: fakeBrazilianVehiclePlate(),
			modelYear: fabricationYear + 1,
			fabricationYear,
			brand: pickRandomFromArray(carBrands),
			model: pickRandomFromArray(vehicleModels),
			color: pickRandomFromArray(colors),
			organizationId
		})
		.returning();

	return v;
}

async function genTracker(organizationId: number, vehicleId: number | null, tx: Tx) {
	const [t] = await tx
		.insert(vehicleTracker)
		.values({
			model: TRACKER_MODEL_H02,
			imei: faker.phone.imei(),
			organizationId,
			vehicleId
		})
		.returning();

	return t;
}

async function genSimCard(organizationId: number, vehicleTrackerId: number | null, tx: Tx) {
	const apn = pickRandomFromArray(apns);

	const [s] = await tx
		.insert(simCard)
		.values({
			phoneNumber: fakeE164PhoneNumber(),
			ssn: fakeSsn(),
			apnUser: apn.user,
			apnAddress: apn.address,
			apnPassword: apn.password,
			pin: fakePinNumber(),
			pin2: fakePinNumber(),
			puk: fakePukCode(),
			puk2: fakePukCode(),
			organizationId,
			vehicleTrackerId
		})
		.returning();

	return s;
}

async function genAccessLevel(organizationId: number | null, tx: Tx) {
	const [a] = await tx
		.insert(accessLevel)
		.values({
			name: faker.word.words(5),
			isFixed: true,
			description: faker.word.words(10),
			permissions: [],
			organizationId
		})
		.returning();

	return a;
}

async function genUser(organizationId: number, accessLevelId: number, tx: Tx) {
	const [u] = await tx
		.insert(user)
		.values({
			username: faker.internet.username(),
			email: faker.internet.email(),
			emailVerified: faker.datatype.boolean({ probability: 0.8 }),
			description: faker.word.words(10),
			password: hashSync(faker.internet.password()),
			accessLevelId,
			organizationId
		})
		.returning();

	return u;
}

async function createEntitiesForOrg(orgId: number, tx: Tx) {
	// create some vehicles
	for (let i = 1; i <= 50; i++) {
		const vehicle = await genVehicle(orgId, tx);

		// for 75% of the vehicles, create a tracker and possibly its SIM card(s)
		if (faker.datatype.boolean({ probability: 0.75 })) {
			let tracker = await genTracker(orgId, vehicle.id, tx);

			// the tracker has a 80% chance of having a SIM CARD
			if (faker.datatype.boolean({ probability: 0.85 })) {
				await genSimCard(orgId, tracker.id, tx);
			}
		}
	}

	// create some trackers that are not associated with a vehicle
	for (let i = 1; i <= 50; i++) {
		await genTracker(orgId, null, tx);
	}

	// create some sim cards that are not associated with a vehicle
	for (let i = 1; i <= 50; i++) {
		await genSimCard(orgId, null, tx);
	}

	// create some sim cards that are not associated with a vehicle
	for (let i = 1; i <= 50; i++) {
		await genSimCard(orgId, null, tx);
	}

	// create some sim cards that are not associated with a vehicle
	for (let i = 1; i <= 50; i++) {
		await genSimCard(orgId, null, tx);
	}

	// create a secondary access level for the org
	const secondaryAccessLevel = await genAccessLevel(orgId, tx);

	// create some other access levels
	for (let i = 1; i <= 50; i++) {
		await genAccessLevel(orgId, tx);
	}

	// create some users
	for (let i = 1; i <= 50; i++) {
		await genUser(orgId, secondaryAccessLevel.id, tx);
	}
}

export async function seedDatabase(db: DB) {
	return db.transaction(async (tx) => {
		await createMasterUser(tx);
		const testUser = await createTestUser(tx);

		await createEntitiesForOrg(testUser.organizationId as number, tx);
	});
}
