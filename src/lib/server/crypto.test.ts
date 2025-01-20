import { expect, test } from 'vitest';
import { compareSync, hashSync } from './crypto';

test('hashSync', () => {
	expect(hashSync('something')).toBeTypeOf('string');
});

test('compareSync', () => {
	const val = 'test';
	const hash = hashSync(val);
	expect(compareSync(val, hash)).toBe(true);
});
