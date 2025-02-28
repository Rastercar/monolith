import { SESSION_ID_COOKIE_KEY } from '$lib/constants/cookies';
import { MISSING_SESSION } from '$lib/constants/error-codes';
import type { permission } from '$lib/constants/permissions';
import * as kitHelpers from '@sveltejs/kit';
import { describe, expect, test, vi } from 'vitest';
import { createSessionMock, createUserMock } from '../../../test/mocking-utils';
import * as sessionRepo from '../db/repo/session';
import * as userRepo from '../db/repo/user';
import {
	acl,
	checkUSerHasPermissions,
	denyAccessOnMissingPermissions,
	setUserLocalsFromSessionCookie
} from './auth';

vi.mock('../db/repo/session');
vi.mock('../db/repo/user');

vi.mock('@sveltejs/kit', () => ({
	error: vi.fn(() => {
		throw new Error();
	}),
	redirect: vi.fn()
}));

const sessionRepoMock = vi.mocked(sessionRepo);
const userRepoMock = vi.mocked(userRepo);
const kitHelpersMock = vi.mocked(kitHelpers);

test('checkUSerHasPermissions - returns true if the all the required permissions are included in the user access level', () => {
	const mockUser = createUserMock();
	mockUser.accessLevel.permissions = ['a', 'b', 'c'] as unknown as permission[];

	const test = (input: string[], out: boolean) => {
		expect(checkUSerHasPermissions(mockUser, input as permission[])).toBe(out);
	};

	test(['a'], true);
	test(['b'], true);
	test(['c'], true);
	test(['a', 'b'], true);
	test(['a', 'c'], true);
	test(['b', 'a'], true);
	test(['a', 'b', 'c'], true);
	test(['b', 'c'], true);
	test(['c', 'a'], true);
	test(['c', 'b'], true);

	test(['a', 'b', 'c', 'd'], false);
});

test('denyAccessOnMissingPermissions - throws a sveltekit error if user does no have permissions', () => {
	const mockUser = createUserMock();
	mockUser.accessLevel.permissions = ['UPDATE_VEHICLE'];

	expect(() => denyAccessOnMissingPermissions(mockUser, 'DELETE_SIM_CARD')).toThrow();
	expect(kitHelpersMock.error).toHaveBeenLastCalledWith(401, 'missing permissions');

	expect(() => denyAccessOnMissingPermissions(mockUser, 'UPDATE_VEHICLE')).not.toThrow();
});

describe('acl', () => {
	test('throws a sveltekit error 403 on no user', () => {
		expect(() => acl({ user: null, session: createSessionMock() })).toThrow();
		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(403);
	});

	test('throws a sveltekit error 403 on no session', () => {
		expect(() => acl({ user: createUserMock(), session: null })).toThrow();
		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(403);
	});

	test('throws a sveltekit error 401 on missing permissions', () => {
		const input = { user: createUserMock(), session: createSessionMock() };
		input.user.accessLevel.permissions = [];

		expect(() => acl(input, { requiredPermissions: 'CREATE_SIM_CARD' })).toThrow();
		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(401, expect.anything());
	});
});

describe('setUserLocalsFromSessionCookie', () => {
	const requestEventMock = {
		locals: {},
		cookies: {
			get: vi.fn(),
			delete: vi.fn()
		}
	} as unknown as kitHelpers.RequestEvent;

	const sessionToken = 'session-token';

	test('attempts to get the session cookie by its key', async () => {
		await setUserLocalsFromSessionCookie(requestEventMock);

		expect(requestEventMock.cookies.get).toHaveBeenLastCalledWith(SESSION_ID_COOKIE_KEY);
	});

	test('sets the locals user and session to null if no session cookie is found', async () => {
		await setUserLocalsFromSessionCookie(requestEventMock);

		expect(requestEventMock.locals.user).toBeNull();
		expect(requestEventMock.locals.session).toBeNull();
	});

	test('if the session on the cookie is invalid the cookie is deleted and the request is redirected to the sign out page', async () => {
		vi.mocked(requestEventMock.cookies.get).mockReturnValueOnce(sessionToken);

		await setUserLocalsFromSessionCookie(requestEventMock);

		expect(sessionRepoMock.findSessionByToken).toHaveBeenLastCalledWith(sessionToken);
		expect(requestEventMock.cookies.delete).toHaveBeenLastCalledWith(SESSION_ID_COOKIE_KEY, {
			path: '/'
		});
		expect(kitHelpersMock.redirect).toHaveBeenLastCalledWith(302, '/auth/logout');
	});

	test('throws a internal server error if the session somehow points to a unexisting user', async () => {
		vi.mocked(requestEventMock.cookies.get).mockReturnValueOnce(sessionToken);
		sessionRepoMock.findSessionByToken.mockResolvedValueOnce(createSessionMock() as any);

		await expect(setUserLocalsFromSessionCookie(requestEventMock)).rejects.toBeDefined();
		expect(kitHelpersMock.error).toHaveBeenLastCalledWith(500, {
			message: 'invalid session',
			code: MISSING_SESSION
		});
	});

	test('throws a internal server error if the session somehow points to a unexisting user', async () => {
		vi.mocked(requestEventMock.cookies.get).mockReturnValueOnce(sessionToken);
		sessionRepoMock.findSessionByToken.mockResolvedValueOnce(createSessionMock() as any);
		userRepoMock.findUserByIdWithOrgAndAccessLevel.mockResolvedValueOnce(createUserMock() as any);

		await setUserLocalsFromSessionCookie(requestEventMock);

		expect(requestEventMock.locals.user).toBeDefined();
		expect(requestEventMock.locals.session).toBeDefined();
	});
});
