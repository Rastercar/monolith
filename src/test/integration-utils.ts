import { setClient, setDB, type DB, type DbClient } from '$lib/server/db/db';
import consola from 'consola';
import { sql, type Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresError } from 'postgres';
import postgres from 'postgres';
import { Socket as ClientSocket } from 'socket.io-client';
import * as schema from '../lib/server/db/schema';
import { TEST_TEMPLATE_DB_NAME } from './integration-global-setup';
import { mainTestDb } from './integration-setup';

/**
 * waits until a event is recieved by a socket io client
 */
export function waitFor(emitter: ClientSocket, event: string) {
	return new Promise<any>((resolve) => {
		emitter.once(event, resolve);
	});
}

export interface TestDbHelper {
	/**
	 * drizzle client instance of the created test database
	 */
	db: DB;

	/**
	 * postgres client instance of the created test database
	 */
	client: DbClient;

	dropDatabase: () => Promise<void>;
	closeConnection: () => Promise<void>;
	dropDatabaseAndCloseConnection: () => Promise<void>;
}

/**
 * creates a database based on the test database template, meaning its already seeded and migrated
 *
 * since this uses a template database and tests are run on temfs, this is pretty fast and can be used
 * almost carelessly
 */
export async function createAndSetTestDatabaseAsDbSingleton(
	dbName: string,
	logQueries = false
): Promise<TestDbHelper> {
	const statment = sql`CREATE DATABASE ${sql.identifier(dbName)} TEMPLATE ${sql.identifier(TEST_TEMPLATE_DB_NAME)};`;

	if (!mainTestDb) {
		throw new Error(
			'error setting up test database, main test DB is not initialized, did you run this outside a vitest hook ?'
		);
	}

	try {
		await mainTestDb.execute(statment);
	} catch (e) {
		// ignore error if template database already exists
		if (!(e as PostgresError).message.includes('already exists')) throw e;
	}

	const consoleLogger: Logger = {
		logQuery(query, params) {
			consola.log(query, params);
		}
	};

	const client = postgres(`postgres://raster_user:raster_pass@localhost:5435/${dbName}`);

	const db = drizzle<typeof schema>({
		client,
		schema,
		casing: 'snake_case',
		logger: logQueries ? consoleLogger : false
	});

	setDB(db);
	setClient(client);

	const closeConnection = client.end;

	const dropDatabase = async () => {
		await mainTestDb.execute(sql`DROP DATABASE ${sql.identifier(dbName)};`);
	};

	const dropDatabaseAndCloseConnection = () => closeConnection().then(() => dropDatabase());

	return {
		db,
		client,
		dropDatabase,
		closeConnection,
		dropDatabaseAndCloseConnection
	};
}
