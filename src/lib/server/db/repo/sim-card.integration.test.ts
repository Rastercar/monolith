import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	createOrgSimCard,
	deleteOrgSimCardById,
	findOrgSimCardById,
	findOrgSimCardsByVehicleTrackerId,
	findOrgSimCardsWithPagination,
	updateOrgSimCard
} from './sim-card';

describe('access level repo', async () => {
	let testDb: TestDbHelper;

	const id = 1;
	const orgId = 1;

	const newCardData = {
		phoneNumber: '+559912367',
		ssn: 'abc',
		apnAddress: 'apn-address',
		apnUser: 'apn-user',
		apnPassword: 'apn-pass',
		pin: null,
		pin2: null,
		puk: null,
		puk2: null,
		vehicleTrackerId: null
	};

	const updatedSimCardData = {
		phoneNumber: '+55991236722',
		ssn: 'abc2',
		apnAddress: 'apn-address2',
		apnUser: 'apn-user2',
		apnPassword: 'apn-pass2',
		pin: 'pin',
		pin2: 'pin2',
		puk: 'puk',
		puk2: 'puk2',
		vehicleTrackerId: 1
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('sim_card_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('deleteOrgSimCardById / findOrgSimCardById', async () => {
		let card = await findOrgSimCardById(orgId, id);
		expect(card).toMatchObject({ id, organizationId: orgId });

		const result = await deleteOrgSimCardById(orgId, id);
		expect(result).toBeDefined();

		card = await findOrgSimCardById(orgId, id);
		expect(card).toBeUndefined();
	});

	test('createOrgSimCard', async () => {
		let card = await createOrgSimCard(orgId, newCardData);
		expect(card).toMatchObject(newCardData);
	});

	test('updateOrgSimCard', async () => {
		const newCard = { ...newCardData, phoneNumber: '+443213123', ssn: 'abcd' };

		let card = await createOrgSimCard(orgId, newCard);
		expect(card).toMatchObject(newCard);

		card = await updateOrgSimCard(card.id, orgId, updatedSimCardData);
		expect(card).toMatchObject(updatedSimCardData);
	});

	test('findOrgSimCardsByVehicleTrackerId', async () => {
		const newCard = {
			...newCardData,
			phoneNumber: '+4432131238',
			ssn: 'abcde',
			vehicleTrackerId: 9
		};

		let card = await createOrgSimCard(orgId, newCard);
		expect(card).toMatchObject(newCard);

		const cards = await findOrgSimCardsByVehicleTrackerId(card.vehicleTrackerId as number, orgId);
		expect(cards.find((c) => c.id === card.id)).toMatchObject(card);
	});

	test('findOrgSimCardsWithPagination', async () => {
		const firstPageInput = {
			pagination: { page: 1, pageSize: 5 }
		};

		const res = await findOrgSimCardsWithPagination(orgId, firstPageInput);

		expect(res.itemCount).toBeGreaterThan(0);

		expect(res.pageCount).toEqual(Math.ceil(res.itemCount / firstPageInput.pagination.pageSize));

		expect(res.records.every((i) => (i.organizationId = orgId))).toBe(true);
	});
});
