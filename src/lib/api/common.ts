import { z } from 'zod';

export type PaginationParameters = {
	/**
	 * 1 indexed page number
	 */
	page?: number;

	/**
	 * Total records available for the given query
	 */
	pageSize?: number;
};

/**
 * Common type for paginated endpoints that allow optional filters
 */
export type PaginationWithFilters<T> = {
	/**
	 * filters to apply to the query
	 */
	filters?: T;

	/**
	 * Pagination to apply to the query
	 */
	pagination?: PaginationParameters;
};

export type Paginated<T> = {
	/**
	 * 1 indexed page number
	 */
	page: number;

	/**
	 * Total pages available for the given query
	 */
	pageCount: number;

	/**
	 * Total items available for the given query
	 */
	itemCount: number;

	/**
	 * Amount of records per page
	 */
	pageSize: number;

	/**
	 * Records from the query
	 */
	records: T[];
};

export function createPaginatedResponseSchema<ItemType extends z.ZodTypeAny>(itemSchema: ItemType) {
	return z.object({
		page: z.number(),
		pageSize: z.number(),
		pageCount: z.number(),
		itemCount: z.number(),
		records: z.array(itemSchema)
	});
}
