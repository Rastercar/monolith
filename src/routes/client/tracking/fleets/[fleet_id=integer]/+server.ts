import {
	fleetSchema,
	updateFleetSchema,
	type Fleet,
	type UpdateFleetBody
} from '$lib/api/fleet.schema';
import { deleteFleetById, updateOrgFleet } from '$lib/server/db/repo/fleet';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export async function _updateFleet(
	id: number,
	orgId: number,
	body: UpdateFleetBody
): Promise<Fleet> {
	return updateOrgFleet(id, orgId, body).then((fleet) => fleetSchema.parse(fleet));
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'DELETE_FLEET' });

	const fleetId = parseInt(params.fleet_id);

	await deleteFleetById(fleetId, user.organization.id);

	return json('fleet card deleted');
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'UPDATE_FLEET' });

	const fleetId = parseInt(params.fleet_id);

	const body = await validateJsonRequestBody(request, updateFleetSchema);

	let fleet = await _updateFleet(fleetId, user.organization.id, body);

	return json(fleet);
};
