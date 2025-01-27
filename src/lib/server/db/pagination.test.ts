import type { PaginationParameters } from '$lib/api/common';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as dbUtils from './db';
import { paginate } from './pagination';
import { user } from './schema';

class dbM {
	select = vi.fn(() => this);
	from = vi.fn(() => this);
	where = vi.fn(() => this);
	orderBy = vi.fn(() => this);
	limit = vi.fn(() => this);
	offset = vi.fn(() => [] as unknown[]);
}

vi.mock('./db', () => {
	return {
		getDB: vi.fn(() => new dbM())
	};
});

const dbUtilsMock = vi.mocked(dbUtils);

describe('paginate', () => {
	const table = user;

	const pagination: PaginationParameters = { page: 1, pageSize: 2 };

	let dbMock = new dbM();

	beforeEach(() => {
		dbMock = new dbM();
		dbUtilsMock.getDB.mockReturnValueOnce(dbMock as unknown as dbUtils.DB);
	});

	test('adds COUNT(*) OVER() to the selection', async () => {
		await paginate(user, { pagination });

		expect(dbMock.select).toHaveBeenLastCalledWith({
			...getTableColumns(table),
			itemCount: sql<number>`COUNT(*) OVER()`
		});
	});

	test('selects from the given table', async () => {
		await paginate(user, { pagination });
		expect(dbMock.from).toHaveBeenLastCalledWith(table);
	});

	test('applies the where clauses', async () => {
		const where = eq(user.id, 1);
		await paginate(user, { pagination, where });
		expect(dbMock.where).toHaveBeenLastCalledWith(where);
	});

	test('applies the orderBy clause', async () => {
		const orderBy = user.id;
		await paginate(user, { pagination, orderBy });
		expect(dbMock.orderBy).toHaveBeenLastCalledWith(orderBy);
	});

	test('limits by the page size', async () => {
		await paginate(user, { pagination });
		expect(dbMock.limit).toHaveBeenLastCalledWith(pagination.pageSize);
	});

	test('offsets by (page - 1) * pageSize', async () => {
		for (let pageSize = 10; pageSize < 100; pageSize++) {
			await paginate(user, { pagination });
			expect(dbMock.offset).toHaveBeenLastCalledWith((pagination.page - 1) * pagination.pageSize);
		}
	});

	test('returns pageCount: 0, itemCount: 0 and empty records on no data found', async () => {
		const { page, pageSize } = pagination;

		const res = await paginate(user, { pagination });
		expect(res).toStrictEqual({ page, records: [], pageSize, pageCount: 0, itemCount: 0 });
	});

	test('returns the total pageCount and  itemCount from the query', async () => {
		const page = 1;
		const pageSize = 10;

		const records = [{ itemCount: '50' }];

		dbMock.offset.mockResolvedValueOnce(records);

		const res = await paginate(user, { pagination: { page, pageSize } });
		expect(res).toStrictEqual({ page, records: [{}], pageSize, pageCount: 5, itemCount: 50 });
	});
});
