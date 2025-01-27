import consola from 'consola';
import * as drizzlePg from 'drizzle-orm/postgres-js';
import * as drizzleMigrator from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { ConsolaLogger, initDb, type DB } from './db';

vi.mock('consola');
vi.mock('postgres');
vi.mock('drizzle-orm/postgres-js');
vi.mock('drizzle-orm/postgres-js/migrator');

const consolaMock = vi.mocked(consola);
const postgresMock = vi.mocked(postgres);
const drizzlePgMock = vi.mocked(drizzlePg);
const drizzleMigratorMock = vi.mocked(drizzleMigrator);

test('ConsolaLogger, appends a [DB] prefix and formats the sql if formatQuery = true', () => {
	let logger = new ConsolaLogger();

	const query = 'SELECT * FROM user';
	const params: unknown[] = [];

	logger.logQuery(query, params);
	expect(consolaMock.log).toHaveBeenLastCalledWith('[DB]', query, params);

	logger = new ConsolaLogger(true);

	logger.logQuery(query, params);
	expect(consolaMock.log).toHaveBeenLastCalledWith('[DB]\n', expect.anything(), '\n', params);
});

describe('initDb', () => {
	beforeAll(() => {
		postgresMock.mockReturnValue({} as unknown as postgres.Sql);
		drizzlePgMock.drizzle.mockReturnValue({} as unknown as DB);
	});

	test('initializes the db client only if its not set', () => {
		initDb();
		initDb();

		expect(postgresMock).toHaveBeenCalledTimes(1);
	});

	test('initializes the drizzle client only if its not set', () => {
		initDb();
		initDb();

		expect(drizzlePgMock.drizzle).toHaveBeenCalledTimes(1);
	});

	test('runMigrations if runMigrations = true', () => {
		initDb({ runMigrations: true });
		initDb({ runMigrations: true });

		expect(drizzleMigratorMock.migrate).toHaveBeenCalledTimes(1);
	});
});
