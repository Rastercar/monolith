import type { permission } from '$lib/constants/permissions';
import { beforeEach, describe, expect, test } from 'vitest';
import { createUserMock } from '../../test/mocking-utils';
import { AuthStore } from './auth.svelte';

describe('AuthStore', () => {
	let store = new AuthStore();
	let user = createUserMock();

	beforeEach(() => {
		store = new AuthStore();
		const user = createUserMock();

		store.setUser(user);
	});

	test('setUser - sets the user', () => {
		store.setUser(user);
		expect(store.user).toEqual(user);
	});

	test('clearUser - sets the user to null', () => {
		store.clearUser();
		expect(store.user).toEqual(null);
	});

	test('removeUserPermissions - remove a permission from the user access level permissions', () => {
		const permission: permission = 'CREATE_SIM_CARD';

		user.accessLevel.permissions = [permission, 'other_permission'];

		store.setUser(user);
		expect(store.user?.accessLevel.permissions).toEqual([permission, 'other_permission']);

		store.removeUserPermissions([permission]);
		expect(store.user?.accessLevel.permissions).toEqual(['other_permission']);
	});

	test('updateUser - replaces users properties', () => {
		store.updateUser({ username: 'new' });
		expect(store.user?.username).toEqual('new');
	});

	test('updateUserOrg - replaces users organization properties', () => {
		store.updateUserOrg({ name: 'new' });
		expect(store.user?.organization.name).toEqual('new');
	});

	test('setUserEmailAsVerified', () => {
		store.updateUser({ emailVerified: false });
		store.setUserEmailAsVerified();
		expect(store.user?.emailVerified).toEqual(true);
	});

	test('hasPermission - returns true if the user access levels contains all required permissions', () => {
		(store.user as User).accessLevel.permissions = ['DELETE_USER', 'CREATE_SIM_CARD'];

		expect(store.hasPermission('CREATE_SIM_CARD')).toEqual(true);
		expect(store.hasPermission('CREATE_TRACKER')).toEqual(false);
		expect(store.hasPermission('' as permission)).toEqual(false);
		expect(store.hasPermission(['CREATE_TRACKER', 'DELETE_VEHICLE'])).toEqual(false);
		expect(store.hasPermission(['CREATE_SIM_CARD', 'DELETE_USER'])).toEqual(true);
	});
});
