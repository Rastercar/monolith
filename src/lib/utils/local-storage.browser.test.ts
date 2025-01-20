import { beforeEach, describe } from 'node:test';
import { expect, test } from 'vitest';
import { loadFromLocalStorage, setLocalStorage } from './local-storage';

beforeEach(() => {
	localStorage.clear();
});

describe('loadFromLocalStorage', () => {
	test('returns the default value if the key has no value', () => {
		expect(loadFromLocalStorage('key', 1)).toEqual(1);
	});

	test('returns the set value if key has value', () => {
		setLocalStorage('key', 'val');
		expect(loadFromLocalStorage('key', 1)).toEqual('val');
	});
});

test('setLocalStorage - sets localStorage key with JSON.stringify(value)', () => {
	localStorage.clear();
	setLocalStorage('key', 123);
	expect(loadFromLocalStorage('key', 1)).toEqual(123);
});
