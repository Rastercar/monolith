import type {
	CreateMutationOptions,
	CreateQueryOptions,
	DefaultError
} from '@tanstack/svelte-query';
import { z } from 'zod';

export type PaginationParameters = {
	/**
	 * 1 indexed page number
	 */
	page: number;

	/**
	 * Records to fetch per page
	 */
	pageSize: number;
};

/**
 * Common type for paginated endpoints that allow optional filters
 */
export type PaginationWithFilters<T> = {
	/**
	 * Filters to apply to the query
	 */
	filters?: T;

	/**
	 * Pagination to apply to the query
	 */
	pagination: PaginationParameters;
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

export type ApiQueryOptions<T> = Partial<Omit<CreateQueryOptions<T>, 'queryKey' | 'queryFn'>>;

export type ApiMutationOptions<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown
> = Partial<Omit<CreateMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>>;

export function createPaginatedResponseSchema<ItemType extends z.ZodTypeAny>(itemSchema: ItemType) {
	return z.object({
		page: z.number(),
		pageSize: z.number(),
		pageCount: z.number(),
		itemCount: z.number(),
		records: z.array(itemSchema)
	});
}

export const paginationFromSearchParamsSchema = z.object({
	page: z.coerce.number().default(1),
	pageSize: z.coerce.number().default(5)
});
