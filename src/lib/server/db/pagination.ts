import type { PaginationParameters } from '$lib/api/common';
import { wrapToArray } from '$lib/utils/arrays';
import { getTableColumns, sql, type SQL } from 'drizzle-orm';
import type { PgColumn, PgSelect, PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getDB } from './db';

type OrderByParam = PgColumn | SQL | SQL.Aliased;

interface PaginateOptions<S extends PgSelect> {
	pagination: PaginationParameters;
	orderBy?: OrderByParam | OrderByParam[];
	where?: SQL;
	selection?: S['_']['selection'] & { itemCount: SQL<number> };
}

/**
 * Given a table and some query options, returns
 * executs a limit offset paginated query and returns the results
 */
export async function paginate<T extends TableConfig, S extends PgSelect>(
	table: PgTableWithColumns<T>,
	options: PaginateOptions<S>
) {
	const { pagination, selection, where, orderBy } = options;
	const { page, pageSize } = pagination;

	const itemCnt = sql<number>`COUNT(*) OVER()`;

	const dbSelection = selection
		? { ...selection, itemCount: itemCnt }
		: { ...getTableColumns(table), itemCount: itemCnt };

	const recordsWithCount = await getDB()
		.select(dbSelection)
		.from(table)
		.where(where)
		.orderBy(...wrapToArray(orderBy ?? []))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	// return early to avoid division by 0 bellow
	if (recordsWithCount.length === 0) {
		return { page, records: [], pageSize, pageCount: 0, itemCount: 0 };
	}

	const itemCount = parseInt(recordsWithCount[0].itemCount);

	const pageCount = Math.ceil(itemCount / pageSize);

	const records = recordsWithCount.map(({ itemCount, ...rest }) => rest);

	return { page, records, pageSize, pageCount, itemCount };
}
