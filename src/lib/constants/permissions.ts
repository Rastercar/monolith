/**
 * a rastercar API permission
 *
 * this gives or denies access to certain api endpoints
 */
export type apiPermission = 'UPDATE_ORGANIZATION' | 'UPDATE_VEHICLE';

export interface PermissionDetails {
	title: string;
	description: string;
}

export const permissionDetails: Record<apiPermission, PermissionDetails> = {
	UPDATE_VEHICLE: {
		title: 'Update Vehicle',
		description: 'Allows updating vehicle info such as plate number, model, etc.'
	},
	UPDATE_ORGANIZATION: {
		title: 'Update Organization',
		description:
			'Allows updating the organization the user belongs to, such as the billing email, and name.'
	}
};
