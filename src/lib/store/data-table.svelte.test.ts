import { describe, expect, test } from 'vitest';
import { createPaginationWithFilters } from './data-table.svelte';

describe('createPaginationWithFilters', () => {
	test('creates the pagination/filters with the provided filters and pagination', () => {
		const cleanup = $effect.root(() => {
			const initialFilters = { a: 'val' };
			const initialPagination = { page: 2, pageSize: 6 };

			const { filters, pagination } = createPaginationWithFilters(
				initialFilters,
				initialPagination
			);

			expect(filters).toEqual(initialFilters);
			expect(pagination).toEqual(initialPagination);
		});

		cleanup();
	});

	test('uses the pagination defaults if not provided', () => {
		const cleanup = $effect.root(() => {
			const { pagination } = createPaginationWithFilters({});

			expect(pagination).toEqual({ page: 1, pageSize: 5 });
		});

		cleanup();
	});

	test('resets the page to 1 on filter change', () => {
		const cleanup = $effect.root(() => {
			const { pagination, filters } = createPaginationWithFilters(
				{ a: 'old' },
				{ page: 10, pageSize: 5 }
			);

			filters.a = 'new';

			expect(pagination).toEqual({ page: 1, pageSize: 5 });
		});

		cleanup();
	});
});
