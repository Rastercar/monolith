import { expect, test } from 'vitest';
import { asyncNoOperation, noOperation } from './functions';

test('noOperation - does nothing', () => {
	expect(noOperation()).toBe(undefined);
});

test('asyncNoOperation - does nothing but returns a promise that never rejects', async () => {
	const res = await asyncNoOperation();
	expect(res).toBe(undefined);
});
