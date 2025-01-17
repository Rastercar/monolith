/**
 * Creates a data table pagination and filter state
 *
 * the pagination state is reset whenever the filters change,
 * the reason for this is because since filtering changes the data
 * on the data-table, if the current page is kept (eg: 5) and the
 * new data has only 2 pages, this will result in a weird behavior
 */
export function createPaginationWithFilters<T extends Record<string, unknown>>(
	initialFilters: T,
	initialPagination = { page: 1, pageSize: 5 }
) {
	const pagination = $state(initialPagination);
	const filters = $state(initialFilters);

	$effect(() => {
		// needed to react to filters changes
		Object.values(filters);

		// reset the page
		pagination.page = 1;
	});

	return { pagination, filters };
}
