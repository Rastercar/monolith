import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { trackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error.js';
import { updateOrgTracker } from '$lib/server/db/repo/tracker.js';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => ({
	vehicleTrackerId: parseInt(params.tracker_id),
	updateTrackerForm: await superValidate(zod(updateTrackerSchema)),
	createSimCardForm: await superValidate(zod(createSimCardSchema)),
	updateSimCardForm: await superValidate(zod(updateSimCardSchema))
});

export const actions = {
	updateTracker: async ({ request, locals, params }) => {
		if (!locals.user) return error(400);

		const trackerId = parseInt(params.tracker_id);

		const form = await validateFormWithFailOnError(request, updateTrackerSchema);

		try {
			const tracker = await updateOrgTracker(trackerId, locals.user.organization.id, form.data);
			const updatedTracker = trackerSchema.parse(tracker);
			return { form, updatedTracker };
		} catch (e) {
			if (isErrorFromUniqueConstraint(e, 'vehicle_tracker_imei_unique')) {
				return setError(form, 'imei', 'IMEI in use by another tracker');
			}

			throw e;
		}
	}
};
