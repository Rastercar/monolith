import { building } from '$app/environment';
import { env } from '$lib/env/private-env';
import consola from 'consola';
import type { Logger } from 'drizzle-orm';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { format } from 'sql-formatter';
import * as schema from './schema';

export type DB = PostgresJsDatabase<typeof schema> & {
	$client: postgres.Sql<{}>;
};

/**
 * global drizzle orm instance
 */
let db: DB | null = null;

/**
 * global postgres client instance, used by drizzle orm
 */
let client: postgres.Sql<{}> | null = null;

class ConsolaLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		env.DATABASE_QUERY_LOGGING_FORMATTED
			? consola.log('[DB]\n', format(query, { language: 'postgresql' }), '\n', params)
			: consola.log('[DB]', query, params);
	}
}

/**
 * Connects to the database and sets the global `db` variable
 */
export const initDb = (runMigrations = !building) => {
	if (!client) {
		client = postgres(env.DATABASE_URL, {
			onnotice: env.DATABASE_NOTICE_LOGGING ? undefined : () => {}
		});
	}

	if (!db) {
		db = drizzle<typeof schema>({
			client,
			schema,
			casing: 'snake_case',
			logger: env.DATABASE_QUERY_LOGGING ? new ConsolaLogger() : false
		});

		if (runMigrations) {
			consola.info('[DB] running migrations');
			migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
		}
	}

	return db;
};

/**
 * gets the drizzle orm DB, ensuring the connection was initialized
 */
export const getDB = (runMigrations = !building) => db ?? initDb(runMigrations);
