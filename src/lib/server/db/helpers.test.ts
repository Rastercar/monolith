import { SQL } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { expect, test } from 'vitest';
import { getISOFormatDateQuery, pushIlikeFilterIdDefined } from './helpers';
import { user } from './schema';

test('getISOFormatDateQuery - creates postgres sql to transform date to a iso string', () => {
	const res = getISOFormatDateQuery(user.createdAt);

	const { sql } = new PgDialect().sqlToQuery(res);

	expect(sql).toEqual(`to_char("user"."created_at", 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`);
});

test('pushIlikeFilterIdDefined - adds a ilike condition to the sqlFilters on non empty filter', () => {
	const f: SQL[] = [];

	pushIlikeFilterIdDefined(f, user.id);
	expect(f.length).toBe(0);

	pushIlikeFilterIdDefined(f, user.id, 'something');
	expect(f.length).toBe(1);
});
