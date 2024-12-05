/**
 * all posible rastercar permissions
 *
 * this gives or denies access to certain api endpoints / pages / components
 */
export type permission =
	| 'CREATE_USER'
	| 'DELETE_USER'
	| 'LOGOFF_USER'
	| 'LIST_USER_SESSIONS'
	| 'MANAGE_USER_ACCESS_LEVELS'
	//
	| 'CREATE_TRACKER'
	| 'UPDATE_TRACKER'
	| 'DELETE_TRACKER'
	//
	| 'CREATE_VEHICLE'
	| 'UPDATE_VEHICLE'
	| 'DELETE_VEHICLE'
	//
	| 'DELETE_SIM_CARD'
	| 'UPDATE_SIM_CARD'
	| 'CREATE_SIM_CARD'
	//
	| 'UPDATE_ORGANIZATION';

export type permissionCategory =
	| 'user'
	| 'access levels'
	| 'tracker'
	| 'vehicle'
	| 'SIM card'
	| 'organization'
	| 'authentication';

export interface PermissionDetails {
	title: string;
	summary: string;
	category: permissionCategory;
	description: string;
}

export type PermissionDetailsAndKey = PermissionDetails & { key: permission };

type PermissionByCategory = Record<permissionCategory, PermissionDetailsAndKey[]>;

export const permissionCategoryIcons: Record<permissionCategory, string> = {
	user: 'mdi:user',
	authentication: 'mdi:lock',
	'access levels': 'mdi:shield',
	tracker: 'mdi:cellphone',
	vehicle: 'mdi:car',
	'SIM card': 'mdi:sim',
	organization: 'mdi:building'
};

export const permissionDetails: Record<permission, PermissionDetails> = {
	MANAGE_USER_ACCESS_LEVELS: {
		title: 'Manage User Access Levels',
		summary: 'Manage User Access Levels',
		category: 'authentication',
		description: 'Control over users access levels and their permissions.'
	},
	LOGOFF_USER: {
		title: 'Log Off Other Users',
		summary: 'Logoff users',
		category: 'authentication',
		description: 'Destroy sessions of other users, logging off their devices'
	},
	LIST_USER_SESSIONS: {
		title: 'List User Sessions',
		summary: 'List Sessions',
		category: 'authentication',
		description: 'List the logged in devices of another user.'
	},
	//
	CREATE_USER: {
		title: 'Create User',
		summary: 'Create',
		category: 'user',
		description: 'Allows registering new users.'
	},
	DELETE_USER: {
		title: 'Delete User',
		summary: 'Delete',
		category: 'user',
		description: 'Allows deleting a user'
	},

	//
	CREATE_TRACKER: {
		title: 'Create Tracker',
		summary: 'Create',
		category: 'tracker',
		description: 'Allows registering tracking devices.'
	},
	UPDATE_TRACKER: {
		title: 'Update Tracker',
		summary: 'Update',
		category: 'tracker',
		description: 'Allows updating tracking devices.'
	},
	DELETE_TRACKER: {
		title: 'Delete Tracker',
		summary: 'Delete',
		category: 'tracker',
		description: 'Allows permanently deleting tracking devices.'
	},
	//
	CREATE_VEHICLE: {
		title: 'Create Vehicle',
		summary: 'Create',
		category: 'vehicle',
		description: 'Allows registering new vehicles.'
	},
	UPDATE_VEHICLE: {
		title: 'Update Vehicle',
		summary: 'Update',
		category: 'vehicle',
		description: 'Allows updating vehicle info such as plate number, model, etc.'
	},
	DELETE_VEHICLE: {
		title: 'Delete Vehicle',
		summary: 'Delete',
		category: 'vehicle',
		description: 'Allows permanently deleting vehicles.'
	},
	//
	CREATE_SIM_CARD: {
		title: 'Create SIM Card',
		summary: 'Create',
		category: 'SIM card',
		description: 'Allows registering SIM cards.'
	},
	UPDATE_SIM_CARD: {
		title: 'Update SIM Card',
		summary: 'Update',
		category: 'SIM card',
		description: 'Allows updating SIM cards.'
	},
	DELETE_SIM_CARD: {
		title: 'Delete SIM Card',
		summary: 'Delete',
		category: 'SIM card',
		description: 'Allows permanently deleting SIM cards.'
	},
	//
	UPDATE_ORGANIZATION: {
		title: 'Update Organization',
		summary: 'Update',
		category: 'organization',
		description:
			'Allows updating the organization the user belongs to, such as the billing email, and name.'
	}
};

export const getPermissionDetails = (permission: string): PermissionDetails | null => {
	return permissionDetails[permission as permission] ?? null;
};

/**
 * Group a list of permissions by their category
 */
export const groupPermissionsByCategory = (permissions: permission[]): PermissionByCategory => {
	const group = {} as PermissionByCategory;

	permissions.forEach((permission) => {
		const details = permissionDetails[permission]
			? { ...permissionDetails[permission], key: permission }
			: null;

		if (!details) return;

		if (!group[details.category]) group[details.category] = [details];
		else group[details.category]?.push(details);
	});

	return group;
};

export const allPermissionsGroupedByCategory = groupPermissionsByCategory(
	Object.keys(permissionDetails) as permission[]
);

export const allPermissions = Object.keys(permissionDetails);
