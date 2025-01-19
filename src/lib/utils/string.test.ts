import { expect, test } from 'vitest';
import { emptyStringToNull, stringToIntWithFallback } from './string';

test('emptyStringToNull', () => {
	expect(emptyStringToNull('')).toBe(null);
	expect(emptyStringToNull('a')).toBe('a');
});

test('stringToIntWithFallback', () => {
	expect(stringToIntWithFallback('', 1)).toBe(1);
	expect(stringToIntWithFallback('a', 1)).toBe(1);
	expect(stringToIntWithFallback('2', 1)).toBe(2);
});
