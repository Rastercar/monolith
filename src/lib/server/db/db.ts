import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const db = drizzle<typeof schema>({
	client,
	schema,
	casing: 'snake_case',
	logger: env.DATABASE_LOGGING === 'true'
});

await migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
