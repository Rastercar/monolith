import { beforeEach, describe, expect, test } from 'vitest';
import { AuthStore } from './auth.svelte';

const createUserMock = (): User => ({
	id: 0,
	createdAt: new Date(),
	username: '',
	email: '',
	emailVerified: false,
	profilePicture: null,
	description: null,
	accessLevel: {
		id: 0,
		createdAt: new Date(),
		description: '',
		name: '',
		isFixed: false,
		permissions: []
	},
	organization: {
		id: 0,
		createdAt: new Date(),
		name: '',
		billingEmail: '',
		blocked: false,
		billingEmailVerified: false
	}
});

describe('AuthStore', () => {
	let store = new AuthStore();

	beforeEach(() => {
		store = new AuthStore();
	});

	test('setUser - sets the user', () => {
		const store = new AuthStore();
		const user = createUserMock();

		store.setUser(user);
		expect(store.user).toEqual(user);
	});
});
