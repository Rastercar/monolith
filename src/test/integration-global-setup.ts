import { initDb, setClient, setDB } from '$lib/server/db/db';
import { isUniqueConstraintError } from '$lib/server/db/error';
import consola from 'consola';
import { sql } from 'drizzle-orm';
import type { PostgresError } from 'postgres';

/**
 * The name of the database to be used as a template for
 * creating databases for integration testing
 */
export const TEST_TEMPLATE_DB_NAME = 'raster_test_template';

/**
 * URL of the "main test database", this DB should not be tested agains as its only used
 * to create the test template database and to be used to issue statements for creating
 * test databases based on the template DB
 */
export const TEST_DB_URL = 'postgres://raster_user:raster_pass@localhost:5435/raster_test';

/**
 * URL of the template database
 */
export const TEST_TEMPLATE_DB_URL = `postgres://raster_user:raster_pass@localhost:5435/${TEST_TEMPLATE_DB_NAME}`;

/**
 * global setup for integration testing, this runs on a separate
 * process and context of the test files
 */
export async function setup() {
	consola.info('setting up database for integration tests, creating empty default test DB');
	const { setupPromise, db: testDb } = initDb({
		dbUrl: TEST_DB_URL,
		runSeeder: false,
		runMigrations: false
	});
	await setupPromise;

	consola.info('creating template test database');
	await testDb
		.execute(sql`CREATE DATABASE ${sql.identifier(TEST_TEMPLATE_DB_NAME)};`)
		.catch((e) => {
			if (!(e as PostgresError).message.includes('already exists')) throw e;
		});

	// we need to clear the db and client singletons to run seeding and migrations on the template db
	setDB(null);
	setClient(null);

	consola.info('migrating and seeding test template db');
	const { setupPromise: templateDbSetup, client } = initDb({
		dbUrl: TEST_TEMPLATE_DB_URL,
		runSeeder: true,
		runMigrations: true
	});

	await templateDbSetup.catch((e) => {
		const isMostLikelyDuplicatedSeedingError = isUniqueConstraintError(e);
		if (isMostLikelyDuplicatedSeedingError) return;

		consola.error('failed to run seeder / migrations on global integration test setup');
		throw e;
	});

	consola.info('closing template db connection and seeding test template db');
	await client.end();
}
