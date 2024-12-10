import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { trackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error.js';
import { findOrgTrackerById, updateOrgTracker } from '$lib/server/db/repo/tracker.js';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	if (!locals.user) return error(403);

	const trackerId = parseInt(params.tracker_id);
	const dbTracker = await findOrgTrackerById(trackerId, locals.user.organization.id);

	if (!dbTracker) return error(404);

	const tracker = trackerSchema.parse(dbTracker);

	const updateTrackerForm = await superValidate(zod(updateTrackerSchema));
	const createSimCardForm = await superValidate(zod(createSimCardSchema));
	const updateSimCardForm = await superValidate(zod(updateSimCardSchema));

	return { tracker, updateSimCardForm, updateTrackerForm, createSimCardForm };
};

export const actions = {
	updateTracker: async ({ request, locals, params }) => {
		const { user } = acl(locals, { requiredPermissions: 'UPDATE_TRACKER' });

		const trackerId = parseInt(params.tracker_id);

		const form = await validateFormWithFailOnError(request, updateTrackerSchema);

		const trackerOrError = await updateOrgTracker(trackerId, user.organization.id, form.data).catch(
			(e) => {
				if (isErrorFromUniqueConstraint(e, 'vehicle_tracker_imei_unique')) {
					return 'vehicle_tracker_imei_unique';
				}
			}
		);

		if (trackerOrError === 'vehicle_tracker_imei_unique') {
			return setError(form, 'imei', 'IMEI in use by another tracker');
		}

		const updatedTracker = trackerSchema.parse(trackerOrError);
		return { form, updatedTracker };
	}
};
