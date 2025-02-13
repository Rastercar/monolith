import { updateFleetSchema } from '$lib/api/fleet.schema.js';
import { findOrgFleetById } from '$lib/server/db/repo/fleet.js';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { _updateFleet } from './+server.js';

export const load = async ({ params, locals }) => {
	const { user } = acl(locals);

	const fleetId = parseInt(params.fleet_id);
	const fleet = await findOrgFleetById(fleetId, user.organization.id);

	if (!fleet) return error(404);

	const updateFleetForm = await superValidate(zod(updateFleetSchema), { defaults: fleet });

	return { fleet, updateFleetForm };
};

export const actions = {
	updateFleet: async ({ request, locals, params }) => {
		const { user } = acl(locals, { requiredPermissions: 'UPDATE_FLEET' });

		const fleetId = parseInt(params.fleet_id);

		const form = await validateFormWithFailOnError(request, updateFleetSchema);

		const updatedFleet = await _updateFleet(fleetId, user.organization.id, form.data);

		return { form, updatedFleet };
	}
};
