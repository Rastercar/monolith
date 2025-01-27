import { ilike, SQL, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import type { DB } from './db';

/**
 * DB transaction
 */
export type Tx = Parameters<Parameters<DB['transaction']>[0]>[0];

export function getISOFormatDateQuery(dateTimeColumn: PgColumn): SQL<string> {
	return sql<string>`to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
}

/**
 * add a `{column} ilike '%{filter}%` clause to an array of query clauses
 */
export function pushIlikeFilterIdDefined(sqlFilters: SQL[], col: PgColumn, filter?: string) {
	if (filter) sqlFilters.push(ilike(col, `%${filter}%`));
}
