import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import type { z } from 'zod';
import { ApiErrorResponse, isApiErrorObject } from './error';

export type RasterCarApiResponse<T> = Promise<{
	response: Response;
	responseData: T;
}>;

/**
 * fetches the rastercar api with the base URL from the env vars
 */
export const fetchRastercarApi = (path: string, config?: RequestInit) => {
	return fetch(`${PUBLIC_RASTERCAR_API_BASE_URL}/${path}`, config);
};

/**
 * Calls the rastercar API, expecting a JSON response of type T, unlike the native fetch function,
 * it also throws a error if the API responds with a status code outside the 200-299 range.
 *
 * For convenience if the response status is not 200-299 we attempt to parse it the rastercar API
 * error format, a simple object with a error field, and throw a `ApiErrorResponse`
 *
 * if you need maximum control over the fetch request use the `fetchRastercarApi` function
 */
async function apiJsonRes(path: string, cfg?: RequestInit): RasterCarApiResponse<unknown> {
	const res = await fetchRastercarApi(path, cfg);

	if (!res.ok) {
		const resBody = await res.json();
		if (isApiErrorObject(resBody)) throw new ApiErrorResponse(resBody.error, res);
	}

	return { response: res, responseData: await res.json() };
}

export async function apiJsonWithSchema<T extends z.ZodTypeAny>(
	schema: T,
	path: string,
	cfg?: RequestInit
) {
	const { response, responseData } = await apiJsonRes(path, cfg);
	return { response, responseData: schema.parse(responseData) };
}
