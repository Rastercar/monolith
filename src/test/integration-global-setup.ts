import { initDb, setClient, setDB } from '$lib/server/db/db';
import { isUniqueConstraintError } from '$lib/server/db/error';
import consola from 'consola';
import { sql } from 'drizzle-orm';
import type { PostgresError } from 'postgres';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';

export const TEST_DB_PORT = 5435;
export const TEST_DB_HOST = 'localhost';
export const TEST_DB_USER = 'raster_user';
export const TEST_DB_PASS = 'raster_pass';
export const TEST_DB_DATABASE = 'raster_test';

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
export const TEST_DB_URL = `postgres://${TEST_DB_USER}:${TEST_DB_PASS}@${TEST_DB_HOST}:${TEST_DB_PORT}/${TEST_DB_DATABASE}`;

/**
 * URL of the template database
 */
export const TEST_TEMPLATE_DB_URL = `postgres://${TEST_DB_USER}:${TEST_DB_PASS}@${TEST_DB_HOST}:${TEST_DB_PORT}/${TEST_TEMPLATE_DB_NAME}`;

let testDbContainer: StartedTestContainer | null = null;

async function initDbTestContainer() {
	testDbContainer = await new GenericContainer('timescale/timescaledb-ha:pg14-latest')
		.withExposedPorts({ container: 5432, host: 5435 })
		.withName('rastercar-postgres-for-testing')
		.withTmpFs({ '/var/lib/postgresql/data': 'uid=1000,gid=1000' })
		.withEnvironment({
			POSTGRES_DB: TEST_DB_DATABASE,
			POSTGRES_USER: TEST_DB_USER,
			POSTGRES_PASSWORD: TEST_DB_PASS,
			PGDATA: '/var/lib/postgresql/data'
		})
		.start();

	return testDbContainer;
}

/**
 * global setup for integration testing, this runs on a separate
 * process and context of the test files
 */
export async function setup() {
	consola.info('setting up database for integration tests, starting DB container');
	await initDbTestContainer();

	consola.info('creating empty default test DB');
	const { setupPromise, db } = initDb({
		dbUrl: TEST_DB_URL,
		runSeeder: false,
		runMigrations: false
	});
	await setupPromise;

	consola.info('creating template test database');
	await db.execute(sql`CREATE DATABASE ${sql.identifier(TEST_TEMPLATE_DB_NAME)};`).catch((e) => {
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

export async function teardown() {
	consola.info('running integration tests teardown');
	if (testDbContainer) testDbContainer.stop();
}
