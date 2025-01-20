import { afterEach, describe, expect, test } from 'vitest';
import type { SocketIoServer } from '../../global';
import { getSocketIoInstance } from './socketio';

describe('getSocketIoInstance', () => {
	afterEach(() => {
		delete globalThis.io;
	});

	test('returns null if globalThis.io is undefined', () => {
		const result = getSocketIoInstance();
		expect(result).toBeNull();
	});

	test('returns globalThis.io if it is defined', () => {
		const mockIoInstance = {};
		globalThis.io = mockIoInstance as SocketIoServer;

		const result = getSocketIoInstance();
		expect(result).toBe(mockIoInstance);
	});
});
