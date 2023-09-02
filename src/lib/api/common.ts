import { goto } from '$app/navigation';
import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import { INVALID_SESSION, NO_SID_COOKIE } from '$lib/constants/error_codes';
import wretch from 'wretch';
import { WretchError } from 'wretch/resolver';

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

export const redirectToSignInPageOnSessionError = (err: unknown) => {
	if (!(err instanceof WretchError) || !isApiErrorObject(err.json)) {
		throw err;
	}

	const errorMessage = err.json.error;

	if (errorMessage === NO_SID_COOKIE || errorMessage === INVALID_SESSION) {
		// TODO: redirect to a session expired page with the current page on the query
		// so when the user signs in again he goes back to where he was
		goto('/auth/sign-out');
	}

	throw err;
};
