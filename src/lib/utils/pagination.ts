import { stringToIntWithFallback } from './string';

export function getPaginationParamsFromSearchParams(params: URLSearchParams) {
	let page = stringToIntWithFallback(params.get('page'), 1);
	let pageSize = stringToIntWithFallback(params.get('pageSize'), 5);

	if (page <= 0) page = 1;
	if (pageSize <= 0) pageSize = 5;

	return { page, pageSize };
}
