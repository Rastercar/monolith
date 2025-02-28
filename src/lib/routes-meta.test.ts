import { describe } from 'node:test';
import { expect, test } from 'vitest';
import type { RequestEvent } from '../routes/auth/$types';
import { getRouteMetaFromPath, redirectToStartingPage, routesMeta } from './routes-meta';

test('getRouteMetaFromPath', () => {
	expect(getRouteMetaFromPath('invalid-route')).toBeUndefined();

	const validRoutes = Object.keys(routesMeta);

	validRoutes.forEach((validRoute) => {
		expect(validRoute).not.toBeUndefined();
	});
});

describe('redirectToStartingPage', () => {
	interface RedirectionError {
		status: number;
		location: string;
	}

	const catchRedirectionError = (evt: unknown): RedirectionError | null => {
		try {
			redirectToStartingPage(evt as RequestEvent);
		} catch (err) {
			return err as RedirectionError;
		}

		return null;
	};

	test('redirects to login page if request does not contain a user', () => {
		const userLessRedirectError = catchRedirectionError({ locals: { user: null } });

		expect(userLessRedirectError?.status).toBe(303);
		expect(userLessRedirectError?.location).toBe('/auth/login');
	});

	test('redirects to home page if request contains a user', () => {
		const userFullRedirectError = catchRedirectionError({ locals: { user: 'not-null' } });

		expect(userFullRedirectError?.status).toBe(303);
		expect(userFullRedirectError?.location).toBe('/client');
	});
});
