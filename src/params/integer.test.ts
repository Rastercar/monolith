import { expect, test } from 'vitest';
import { match } from './integer';

test('integer - asserts the param is string of a integer > 0', () => {
	expect(match('nan')).toBe(false);
	expect(match('')).toBe(false);
	expect(match('0')).toBe(false);
	expect(match('1')).toBe(true);
	expect(match('2')).toBe(true);
});
