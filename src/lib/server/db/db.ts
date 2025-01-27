import { building } from '$app/environment';
import { env } from '$lib/env/private-env';
import consola from 'consola';
import type { Logger } from 'drizzle-orm';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { format } from 'sql-formatter';
import * as schema from './schema';
import { seedDatabase } from './seed/seeder';

export type DbClient = postgres.Sql<{}>;

export type DB = PostgresJsDatabase<typeof schema> & {
	$client: DbClient;
};

/**
 * global drizzle orm instance
 */
let db: DB | null = null;

/**
 * global postgres client instance, used by drizzle orm
 */
let client: DbClient | null = null;

export class ConsolaLogger implements Logger {
	private formatQuery = false;

	constructor(formatQuery = false) {
		this.formatQuery = formatQuery;
	}

	logQuery(query: string, params: unknown[]): void {
		this.formatQuery
			? consola.log('[DB]\n', format(query, { language: 'postgresql' }), '\n', params)
			: consola.log('[DB]', query, params);
	}
}

interface InitDbOpts {
	dbUrl?: string;
	logOnNotice?: boolean;
	logQueries?: boolean;
	formatQueryLogs?: boolean;
	runMigrations?: boolean;
	runSeeder?: boolean;
}

interface InitDbRes {
	db: DB;

	client: DbClient;

	/**
	 * A promise that resolves once the database has been successfully set up,
	 * meaning it finished migrating and/or seeding if runSeeder or runMigrations
	 * were true (if both were false returns a promise that already resolves)
	 */
	setupPromise: Promise<void>;
}

/**
 * Connects to the database and sets the global `db` variable
 */
export const initDb = (opts?: InitDbOpts): InitDbRes => {
	const defaultOptions = {
		dbUrl: env.DATABASE_URL,

		logQueries: env.DATABASE_QUERY_LOGGING,
		logOnNotice: env.DATABASE_NOTICE_LOGGING,
		formatQueryLogs: env.DATABASE_QUERY_LOGGING_FORMATTED,

		runSeeder: env.DATABASE_SEED_ON_STARTUP,
		runMigrations: !building
	};

	const options = { ...defaultOptions, ...opts };

	if (!client) {
		client = postgres(options.dbUrl, { onnotice: options.logOnNotice ? undefined : () => {} });
	}

	let seedPromise: Promise<void> | undefined;
	let migratePromise: Promise<void> | undefined;

	if (!db) {
		db = drizzle<typeof schema>({
			client,
			schema,
			casing: 'snake_case',
			logger: options.logQueries ? new ConsolaLogger(options.formatQueryLogs) : false
		});

		if (options.runMigrations) {
			consola.info('[DB] running migrations');
			migratePromise = migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
		}

		if (options.runSeeder) {
			// seeding should be run only after migrations have been run
			consola.info('[DB] running seeder');
			seedPromise = migratePromise
				? migratePromise.then(() => seedDatabase(db as DB))
				: seedDatabase(db);
		}
	}

	let setupPromise = seedPromise ?? migratePromise ?? Promise.resolve();

	return { db, client, setupPromise };
};

export const setDB = (database: DB | null) => (db = database);

export const setClient = (pgClient: DbClient | null) => (client = pgClient);

/**
 * gets the drizzle orm DB, ensuring the connection was initialized
 */
export const getDB = () => db ?? initDb().db;
