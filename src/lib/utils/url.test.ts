import { env } from '$env/dynamic/public';
import { expect, test } from 'vitest';
import { cloudFrontUrl, getBooleanFromUrlQuery } from './url';

test('cloudFrontUrl - appends the path to the end of the url', () => {
	const input = 'some-path';
	expect(cloudFrontUrl(input)).toBe(`${env.PUBLIC_CLOUDFRONT_BASE_URL}/${input}`);
});

test('getBooleanFromUrlQuery - returns true if the url contains a searchParams with a string representation of true', () => {
	const key = 'key';

	const createUrlForTestCase = (val?: string) => {
		const url = new URL('http://test.com');
		if (val) url.searchParams.set(key, val);

		return url;
	};

	const _test = (val: string | undefined, expected: boolean) => {
		const url = createUrlForTestCase(val);
		expect(getBooleanFromUrlQuery(url, key)).toBe(expected);
	};

	_test('1', true);
	_test('true', true);
	_test('TruE', true);
	_test('TRUE', true);
	_test('0', false);
	_test('false', false);
	_test('False', false);
	_test('FALSE', false);
});
