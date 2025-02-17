import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { trackerSchema, updateTrackerSchema, type Tracker } from '$lib/api/tracker.schema';
import { findOrgVehicleById } from '$lib/server/db/repo/vehicle';
import { findOrgTrackerById } from '$lib/server/db/repo/vehicle-tracker';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { _updateVehicleTracker } from './+server';

export const load = async ({ params, locals }) => {
	const { orgId } = acl(locals);

	const trackerId = parseInt(params.tracker_id);
	const dbTracker = await findOrgTrackerById({ id: trackerId, orgId });

	if (!dbTracker) return error(404);

	const tracker = trackerSchema.parse(dbTracker);

	const updateTrackerForm = await superValidate(zod(updateTrackerSchema));
	const createSimCardForm = await superValidate(zod(createSimCardSchema));
	const updateSimCardForm = await superValidate(zod(updateSimCardSchema));

	return { tracker, updateSimCardForm, updateTrackerForm, createSimCardForm };
};

export const actions = {
	updateTracker: async ({ request, locals, params }) => {
		const { orgId } = acl(locals, { requiredPermissions: 'UPDATE_TRACKER' });

		const trackerId = parseInt(params.tracker_id);

		const form = await validateFormWithFailOnError(request, updateTrackerSchema);

		if (form.data.vehicleId) {
			const vehicle = await findOrgVehicleById({ id: form.data.vehicleId, orgId });
			if (!vehicle) setError(form, 'vehicleId', 'vehicle not found');
		}

		const res = await _updateVehicleTracker({ id: trackerId, orgId }, form.data);

		if ('error' in res) {
			if (res.error === 'IMEI_IN_USE') {
				return setError(form, 'imei', 'IMEI in use by another tracker');
			}
		}

		return { form, updatedTracker: res as Tracker };
	}
};
