import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import wretch from 'wretch';

export const rastercarApi = wretch(PUBLIC_RASTERCAR_API_BASE_URL);

/**
 * simple error interface returned by the rastercar api in most error cases
 */
export interface ApiErrorObject {
	error: string;
}

export const isApiErrorObject = (v: unknown): v is ApiErrorObject => {
	return typeof v === 'object' && v !== null && typeof (v as ApiErrorObject).error === 'string';
};
