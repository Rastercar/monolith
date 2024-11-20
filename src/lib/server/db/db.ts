import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const logDbQueries = env.DATABASE_QUERY_LOGGING === 'true';
const logDbNotices = env.DATABASE_NOTICE_LOGGING === 'true';

const client = postgres(env.DATABASE_URL, {
	onnotice: logDbNotices ? undefined : () => {}
});

export const db = drizzle<typeof schema>({
	client,
	schema,
	casing: 'snake_case',
	logger: logDbQueries
});

export const runDbMigrations = () =>
	migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
