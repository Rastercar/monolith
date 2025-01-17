import wretch from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
import QueryStringAddon from 'wretch/addons/queryString';

export const api = wretch()
	.addon(FormDataAddon)
	.addon(QueryStringAddon)
	.options({ credentials: 'include' });

export const isAppError = (v: unknown): v is App.Error => {
	return typeof v === 'object' && v !== null && typeof (v as App.Error).message === 'string';
};

/**
 * Strips keys with undefined values from an object,
 *
 * this is usefull to avoid parsing an object with undefined values
 * to a query string, eg: avoiding `{a: undefined, b: 1}` to be parsed as `?a=&b=1`
 *
 * @important
 * This mutates the original object
 */
export const stripUndefined = (o: unknown): Record<string, unknown> => {
	if (typeof o !== 'object' || o === null) return {};

	type key = keyof typeof o;

	Object.keys(o).forEach((k) => o[k as key] === undefined && delete o[k as key]);

	return o as Record<string, unknown>;
};
