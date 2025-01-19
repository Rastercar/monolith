import { expect, test } from 'vitest';
import { getPaginationParamsFromSearchParams } from './pagination';

test('getPaginationParamsFromSearchParams - gets page and pageSize from search params casted to integers, with defaults as fallback', () => {
	let params = new URLSearchParams();
	expect(getPaginationParamsFromSearchParams(params)).toStrictEqual({ page: 1, pageSize: 5 });

	params.set('page', '2');
	params.set('pageSize', '6');
	expect(getPaginationParamsFromSearchParams(params)).toStrictEqual({ page: 2, pageSize: 6 });

	params.set('page', 'a');
	params.set('pageSize', 'a');
	expect(getPaginationParamsFromSearchParams(params)).toStrictEqual({ page: 1, pageSize: 5 });
});
