/**
 * a rastercar API permission
 *
 * this gives or denies access to certain api endpoints
 */
export type apiPermission =
	| 'CREATE_TRACKER'
	| 'UPDATE_TRACKER'
	| 'DELETE_TRACKER'
	| 'CREATE_VEHICLE'
	| 'UPDATE_VEHICLE'
	| 'DELETE_VEHICLE'
	| 'DELETE_SIM_CARD'
	| 'UPDATE_SIM_CARD'
	| 'CREATE_SIM_CARD'
	| 'UPDATE_ORGANIZATION';

export interface PermissionDetails {
	title: string;
	description: string;
}

export const permissionDetails: Record<apiPermission, PermissionDetails> = {
	CREATE_TRACKER: {
		title: 'Create Tracker',
		description: 'Allows registering tracking devices.'
	},
	UPDATE_TRACKER: {
		title: 'Update Tracker',
		description: 'Allows updating tracking devices.'
	},
	DELETE_TRACKER: {
		title: 'Delete Tracker',
		description: 'Allows permanently deleting tracking devices.'
	},
	CREATE_VEHICLE: {
		title: 'Create Vehicle',
		description: 'Allows registering new vehicles.'
	},
	UPDATE_VEHICLE: {
		title: 'Update Vehicle',
		description: 'Allows updating vehicle info such as plate number, model, etc.'
	},
	DELETE_VEHICLE: {
		title: 'Delete Vehicle',
		description: 'Allows permanently deleting vehicles.'
	},
	CREATE_SIM_CARD: {
		title: 'Create SIM Card',
		description: 'Allows registering SIM cards.'
	},
	UPDATE_SIM_CARD: {
		title: 'Update SIM Card',
		description: 'Allows updating SIM cards.'
	},
	DELETE_SIM_CARD: {
		title: 'Delete SIM Card',
		description: 'Allows permanently deleting SIM cards.'
	},
	UPDATE_ORGANIZATION: {
		title: 'Update Organization',
		description:
			'Allows updating the organization the user belongs to, such as the billing email, and name.'
	}
};
