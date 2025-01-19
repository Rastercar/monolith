import type { PaginationParameters } from '$lib/api/common';
import { and, count, type SQL } from 'drizzle-orm';
import type { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getDB } from './db';

export async function paginate<T, U extends TableConfig>(
	pagination: PaginationParameters,
	table: PgTableWithColumns<U>,
	filters?: SQL<T>[]
) {
	const { page, pageSize } = pagination;

	const db = getDB();

	const records = await db
		.select()
		.from(table)
		.where(and(...(filters ?? [])))
		.orderBy()
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const [{ count: rowCount }] = await db
		.select({ count: count() })
		.from(table)
		.where(and(...(filters ?? [])));

	return {
		page,
		records,
		pageSize,
		pageCount: Math.ceil(rowCount / pageSize),
		itemCount: rowCount
	};
}
