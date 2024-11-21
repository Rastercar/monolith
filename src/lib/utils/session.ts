import { SESSION_DAYS_DURATION, SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { env } from '$lib/public-env';
import type { Cookies } from '@sveltejs/kit';
import { createDateXDaysFromNow, getDatesDiffInSeconds } from './date';

export function createSessionExpirationDateFromNow() {
	const now = new Date();

	const expiresDate = createDateXDaysFromNow(SESSION_DAYS_DURATION);
	const diffSeconds = getDatesDiffInSeconds(now, expiresDate);

	return { maxAge: diffSeconds, expiresAt: expiresDate.toISOString() };
}

export function setSessionCookie(cookies: Cookies, sessionToken: string, maxAge: number) {
	cookies.set(SESSION_ID_COOKIE_KEY, sessionToken, {
		path: '/',
		secure: !env.PUBLIC_IS_DEV,
		httpOnly: true,
		sameSite: 'strict',
		maxAge
	});
}
