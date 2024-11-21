import { env } from '$lib/private-env';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(env.DATABASE_URL, {
	onnotice: env.DATABASE_NOTICE_LOGGING ? undefined : () => {}
});

export const db = drizzle<typeof schema>({
	client,
	schema,
	casing: 'snake_case',
	logger: env.DATABASE_QUERY_LOGGING
});

console.log('[DB] running migrations');
migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
