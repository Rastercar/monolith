import { expect, test } from 'vitest';
import { pickRandomFromArray, range, wrapToArray } from './arrays';

test('pickRandomFromArray - picks a random element from an array', () => {
	const sample = [1, 2, 3, 4, 5];

	for (let i = 0; i < 10; i++) {
		const picked = pickRandomFromArray(sample);
		expect(picked).toBeGreaterThanOrEqual(1);
		expect(picked).toBeLessThanOrEqual(5);
	}
});

test('wrapToArray - wraps a single element into a array', () => {
	expect(wrapToArray(1)).toEqual([1]);
	expect(wrapToArray([1])).toEqual([1]);
	expect(wrapToArray([[]])).toEqual([[]]);
	expect(wrapToArray(null)).toEqual([null]);
	expect(wrapToArray(undefined)).toEqual([undefined]);
});

test('range - creates an array ranging from 0 to N', () => {
	expect(range(1)).toEqual([0]);
	expect(range(5)).toEqual([0, 1, 2, 3, 4]);
});
