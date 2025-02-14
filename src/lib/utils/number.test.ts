import { expect, test } from 'vitest';
import { isPositiveInteger, megabytesToBytes } from './number';

test('megabytesToBytes', () => {
	expect(megabytesToBytes(1)).toEqual(1 * 1024 * 1024);
});

test('isPositiveInteger', () => {
	expect(isPositiveInteger(1)).toBe(true);
	expect(isPositiveInteger(0)).toBe(false);
	expect(isPositiveInteger('1')).toBe(false);
	expect(isPositiveInteger(new Date())).toBe(false);
});
