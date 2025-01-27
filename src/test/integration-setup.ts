import { initDb, type DB } from '$lib/server/db/db';
import { beforeAll } from 'vitest';
import { TEST_DB_URL } from './integration-global-setup';

/**
 * The database instance to be used to create
 */
export let mainTestDb!: DB;

beforeAll(async () => {
	// very important, migrations and seeding is done exactly once on integration-global-setup.ts
	// however, since the global setup runs on a different proccess before all tests, it just sets
	// up the database, but the singletons are not set on the text context, so we call initDB on
	// the beforeAll hook to ensure its set with the correct URL and we dont run migrations twice
	if (!mainTestDb) {
		const { db, setupPromise } = initDb({
			dbUrl: TEST_DB_URL,
			runSeeder: false,
			runMigrations: false
		});
		mainTestDb = db;

		await setupPromise;
	}
});
