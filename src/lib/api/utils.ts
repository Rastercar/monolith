import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import { INVALID_SESSION, NO_SID_COOKIE } from '$lib/constants/error-codes';
import wretch from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
import { WretchError } from 'wretch/resolver';
import type { AnyZodObject } from 'zod';

export const rastercarApi = wretch(PUBLIC_RASTERCAR_API_BASE_URL).addon(FormDataAddon).options({
	credentials: 'include'
});

/**
 * simple error interface returned by the rastercar api in most error cases
 */
export interface ApiErrorObject {
	error: string;
}

export const isApiErrorObject = (v: unknown): v is ApiErrorObject => {
	return typeof v === 'object' && v !== null && typeof (v as ApiErrorObject).error === 'string';
};

export const redirectOnSessionError = (err: unknown) => {
	if (!browser || !(err instanceof WretchError) || !isApiErrorObject(err.json)) throw err;

	const errorCode = err.json.error;

	// if the request failed because the session id cookie is not present,
	// the user must have cleaned his cookies, and needs to sign in again
	if (errorCode === NO_SID_COOKIE) {
		goto(`/auth/sign-in?redirect=${window.location.pathname}`);
		throw err;
	}

	// if the session is invalid or expired, the user needs to sign in, but first
	// we need to clear the invalid session cookie by redirecting the user to the
	// sign out page that does delete the cookie on the server side
	if (errorCode === INVALID_SESSION) goto('/auth/sign-out');

	throw err;
};

export const returnErrorStringOrParsedSchemaObj = <T>(res: T, schema: AnyZodObject): string | T => {
	if (typeof res === 'string') return res;

	schema.parse(res);
	return res;
};

/**
 * return a error code if the error response is a standard api error
 */
export const returnErrorCodeOnApiError = (errorCode: string) => (err: WretchError) => {
	if (isApiErrorObject(err.json)) return errorCode;
};

/**
 * return the error message string if the error is a standard api error
 */
export const fallthroughApiErrorMessage = (err: WretchError) => {
	if (isApiErrorObject(err.json)) return err.json.error;
};
