import { describe } from 'node:test';
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest';
import { loadFromLocalStorage, setLocalStorage } from './local-storage';

class LocalStorageMock {
	store: Record<string, string> = {};

	getItem(key: string) {
		return this.store[key];
	}

	setItem(key: string, value: string) {
		this.store[key] = value;
	}

	clear() {
		this.store = {};
	}

	removeItem(key: string) {
		delete this.store[key];
	}
}

let oldLs: Storage | null = null;

beforeAll(() => {
	oldLs = globalThis.localStorage;
});

beforeEach(() => {
	globalThis.localStorage = new LocalStorageMock() as unknown as Storage;
});

afterAll(() => {
	globalThis.localStorage = oldLs as Storage;
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
	setLocalStorage('key', 123);
	expect(loadFromLocalStorage('key', 1)).toEqual(123);
});
