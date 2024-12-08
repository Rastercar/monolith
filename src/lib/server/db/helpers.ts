import { SQL, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import type { db } from './db';

/**
 * DB transaction
 */
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export function getISOFormatDateQuery(dateTimeColumn: PgColumn): SQL<string> {
	return sql<string>`to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
}
