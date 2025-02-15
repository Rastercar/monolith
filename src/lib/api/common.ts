import { showErrorToast } from '$lib/store/toast';
import { withMinTime } from '$lib/utils/promises';
import {
	createMutation,
	type CreateMutationOptions,
	type CreateMutationResult,
	type CreateQueryOptions,
	type DefaultError,
	type MutationFunction
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

type ApiMutationOptions<
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

interface CreateApiMutationArgs<TData, TVariables>
	extends ApiMutationOptions<TData, unknown, TVariables, unknown> {
	/**
	 * the mutation function
	 */
	fn: MutationFunction<TData, TVariables>;

	/**
	 * Minimun amount of time the mutation should take,
	 * usefull to avoid janky UIs where a loader would
	 * be shown but fade out too quickly
	 */
	minTime?: number;
}

export type ApiMutation<TData, TVariables> = Omit<CreateApiMutationArgs<TData, TVariables>, 'fn'>;

/**
 * Wrapper around createMutation for easier type
 * inference and some utilities like `minTime`
 */
export function createApiMutation<TData, TVariables>(
	args: CreateApiMutationArgs<TData, TVariables>
): CreateMutationResult<TData, unknown, TVariables, unknown> {
	return createMutation(() => ({
		mutationFn: (a) => (args.minTime ? withMinTime(args.fn(a), args.minTime) : args.fn(a)),
		onError: args.onError ?? showErrorToast,
		...args
	}));
}
