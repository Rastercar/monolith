import type { AccessLevel } from '$lib/api/access-level.schema';
import type { Organization } from '$lib/api/organization.schema';

export const createUserMock = (): User => ({
	id: 0,
	createdAt: new Date(),
	email: '',
	username: '',
	description: null,
	emailVerified: false,
	profilePicture: null,
	accessLevel: createAccessLevelMock(),
	organization: createOrganizationMock()
});

export const createAccessLevelMock = (): AccessLevel => ({
	id: 0,
	createdAt: new Date(),
	description: '',
	name: '',
	isFixed: false,
	permissions: []
});

export const createOrganizationMock = (): Organization => ({
	id: 0,
	createdAt: new Date(),
	name: '',
	billingEmail: '',
	blocked: false,
	billingEmailVerified: false
});
