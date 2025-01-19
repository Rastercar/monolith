import { stringToIntWithFallback } from './string';

export function getPaginationParamsFromSearchParams(params: URLSearchParams) {
	return {
		page: stringToIntWithFallback(params.get('page'), 1),
		pageSize: stringToIntWithFallback(params.get('pageSize'), 5)
	};
}
