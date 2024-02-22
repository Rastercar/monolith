/**
 * all posible rastercar API permissions
 *
 * this gives or denies access to certain api endpoints
 */
export type apiPermission =
	| 'CREATE_USER'
	| 'LOGOFF_USER'
	| 'LIST_USER_SESSIONS'
	//
	| 'CREATE_ACCESS_LEVEL'
	| 'UPDATE_ACCESS_LEVEL'
	| 'DELETE_ACCESS_LEVEL'
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

export type apiPermissionCategory =
	| 'user'
	| 'authorization'
	| 'tracker'
	| 'vehicle'
	| 'sim_card'
	| 'organization'
	| 'authentication';

export const permissionCategoryIcons: Record<apiPermissionCategory, string> = {
	user: 'mdi:user',
	authentication: 'mdi:lock',
	authorization: 'mdi:shield',
	tracker: 'mdi:cellphone',
	vehicle: 'mdi:car',
	sim_card: 'mdi:sim',
	organization: 'mdi:building'
};

export interface PermissionDetails {
	title: string;
	category: apiPermissionCategory;
	description: string;
}

// TODO: have this be auto generated from rust code ?
// https://github.com/Aleph-Alpha/ts-rs?tab=readme-ov-file
export const permissionDetails: Record<apiPermission, PermissionDetails> = {
	CREATE_ACCESS_LEVEL: {
		title: 'Create Access Levels',
		category: 'authorization',
		description: 'Create user access levels and determine their permissions'
	},
	UPDATE_ACCESS_LEVEL: {
		title: 'Update Access Levels',
		category: 'authorization',
		description: 'Update user access levels and their permissions'
	},
	DELETE_ACCESS_LEVEL: {
		title: 'Delete Access Levels',
		category: 'authorization',
		description: 'Delete access levels that have no users'
	},
	//
	LOGOFF_USER: {
		title: 'Log Off Other Users',
		category: 'authentication',
		description: 'Destroy sessions of other users, logging off their devices'
	},
	CREATE_USER: {
		title: 'Create User',
		category: 'user',
		description: 'Allows registering new users.'
	},
	LIST_USER_SESSIONS: {
		title: 'List User Sessions',
		category: 'authentication',
		description: 'List the logged in devices of another user.'
	},
	//
	CREATE_TRACKER: {
		title: 'Create Tracker',
		category: 'tracker',
		description: 'Allows registering tracking devices.'
	},
	UPDATE_TRACKER: {
		title: 'Update Tracker',
		category: 'tracker',
		description: 'Allows updating tracking devices.'
	},
	DELETE_TRACKER: {
		title: 'Delete Tracker',
		category: 'tracker',
		description: 'Allows permanently deleting tracking devices.'
	},
	//
	CREATE_VEHICLE: {
		title: 'Create Vehicle',
		category: 'vehicle',
		description: 'Allows registering new vehicles.'
	},
	UPDATE_VEHICLE: {
		title: 'Update Vehicle',
		category: 'vehicle',
		description: 'Allows updating vehicle info such as plate number, model, etc.'
	},
	DELETE_VEHICLE: {
		title: 'Delete Vehicle',
		category: 'vehicle',
		description: 'Allows permanently deleting vehicles.'
	},
	//
	CREATE_SIM_CARD: {
		title: 'Create SIM Card',
		category: 'sim_card',
		description: 'Allows registering SIM cards.'
	},
	UPDATE_SIM_CARD: {
		title: 'Update SIM Card',
		category: 'sim_card',
		description: 'Allows updating SIM cards.'
	},
	DELETE_SIM_CARD: {
		title: 'Delete SIM Card',
		category: 'sim_card',
		description: 'Allows permanently deleting SIM cards.'
	},
	//
	UPDATE_ORGANIZATION: {
		title: 'Update Organization',
		category: 'organization',
		description:
			'Allows updating the organization the user belongs to, such as the billing email, and name.'
	}
};

export const getPermissionDetails = (permission: string): PermissionDetails | null => {
	return permissionDetails[permission as apiPermission] ?? null;
};

type PermissionByCategory = Record<apiPermissionCategory, PermissionDetails[]>;

/**
 * Group a list of permissions by their category
 */
export const groupPermissionsByCategory = (permissions: apiPermission[]): PermissionByCategory => {
	const group = {} as PermissionByCategory;

	permissions.forEach((permission) => {
		const details = permissionDetails[permission] ?? null;

		if (!details) return;

		if (!group[details.category]) group[details.category] = [details];
		else group[details.category]?.push(details);
	});

	return group;
};
