import type { AccessLevel } from '$lib/api/access-level.schema';
import type { Organization } from '$lib/api/organization.schema';
import type { Tracker } from '$lib/api/tracker.schema';

export const createUserMock = (): User => ({
	id: 0,
	createdAt: new Date(),
	email: 'testuser@gmail.com',
	username: 'some_username',
	description: null,
	emailVerified: false,
	profilePicture: null,
	mustSetNewPassword: false,
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

export const createTrackerMock = (values?: Partial<Tracker>): Tracker => ({
	id: 0,
	createdAt: new Date(),
	imei: '',
	model: 'H02',
	vehicleId: null,
	organizationId: 0,
	...values
});

export const createSessionMock = (values?: Partial<UserSession>): UserSession => ({
	createdAt: new Date(),
	ip: '',
	publicId: 1,
	expiresAt: new Date(),
	userAgent: '',
	sameAsFromRequest: false,
	...values
});
