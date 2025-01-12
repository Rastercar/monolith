import { building } from '$app/environment';
import { env } from '$lib/env/private-env';
import consola from 'consola';
import type { Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { format } from 'sql-formatter';
import * as schema from './schema';

const client = postgres(env.DATABASE_URL, {
	onnotice: env.DATABASE_NOTICE_LOGGING ? undefined : () => {}
});

class ConsolaLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		env.DATABASE_QUERY_LOGGING_FORMATTED
			? consola.log('[DB]\n', format(query, { language: 'postgresql' }), '\n', params)
			: consola.log('[DB]', query, params);
	}
}

export const db = drizzle<typeof schema>({
	client,
	schema,
	casing: 'snake_case',
	logger: env.DATABASE_QUERY_LOGGING ? new ConsolaLogger() : false
});

if (!building) {
	consola.info('[DB] running migrations');
	migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
}

/** noop to load the db connection */
export const initDb = () => null;
