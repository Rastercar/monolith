import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../test/integration-utils';
import { countRecords } from './pagination';
import { fleet } from './schema';

describe('pagination', async () => {
	let testDb: TestDbHelper;

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('pagination_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('countRecords - issues a simple SELECT COUNT(*) FROM <table> WHERE <conditions> query', async () => {
		await testDb.db.delete(fleet);

		let count = await countRecords(fleet, eq(fleet.name, 'a'));
		expect(count).toBe(0);

		await testDb.db.insert(fleet).values([
			{ name: 'a', description: '...', organizationId: 1 },
			{ name: 'a', description: '...', organizationId: 1 },
			{ name: 'b', description: '...', organizationId: 1 }
		]);

		count = await countRecords(fleet, eq(fleet.name, 'a'));
		expect(count).toBe(2);
	});
});
