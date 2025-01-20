import { SESSION_DAYS_DURATION, SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import type { Cookies } from '@sveltejs/kit';
import { describe } from 'node:test';
import { expect, test, vi } from 'vitest';
import { createSessionExpirationDateFromNow, setSessionCookie } from './session';

describe('createSessionExpirationDateFromNow', () => {
	test('returns maxAge as the difference in seconds between now and SESSION_DAYS_DURATION', () => {
		const sesionDaysInSeconds = SESSION_DAYS_DURATION * 24 * 60 * 60;

		const { maxAge } = createSessionExpirationDateFromNow();
		expect(maxAge).toEqual(sesionDaysInSeconds);
	});

	test('returns expiresAt as a iso string of now + SESSION_DAYS_DURATION', () => {
		const now = new Date();

		const futureDate = new Date();
		futureDate.setDate(now.getDate() + SESSION_DAYS_DURATION);

		const { expiresAt } = createSessionExpirationDateFromNow();
		expect(expiresAt).toEqual(futureDate.toISOString());
	});
});

class MockCookies implements Cookies {
	private cookies: Map<string, string> = new Map();

	get(name: string): string | undefined {
		return this.cookies.get(name);
	}

	getAll(): Array<{ name: string; value: string }> {
		return Array.from(this.cookies.entries()).map(([name, value]) => ({ name, value }));
	}

	set(name: string, value: string): void {
		this.cookies.set(name, value);
	}

	delete(name: string): void {
		this.cookies.delete(name);
	}

	serialize(name: string, value: string): string {
		return `${name}=${value}; Path=/; HttpOnly; Secure`;
	}
}

describe('setSessionCookie', () => {
	test('calls set with the appropriate options', () => {
		const sessionToken = 'token';
		const sessionMaxAge = 5 * 60;

		const mockCookies = new MockCookies();
		const setSpy = vi.spyOn(mockCookies, 'set');

		setSessionCookie(mockCookies, sessionToken, sessionMaxAge);

		expect(setSpy).toBeCalledWith(SESSION_ID_COOKIE_KEY, sessionToken, {
			path: '/',
			secure: false,
			httpOnly: true,
			sameSite: 'strict',
			maxAge: sessionMaxAge
		});
	});
});
