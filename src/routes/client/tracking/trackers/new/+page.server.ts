import { createSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, trackerSchema } from '$lib/api/tracker.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { createOrgTracker } from '$lib/server/db/repo/tracker.js';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createSimCardForm: await superValidate(zod(createSimCardSchema)),
	createTrackerForm: await superValidate(zod(createTrackerSchema))
});

export const actions = {
	createTracker: async ({ request, locals }) => {
		if (!locals.user) return error(400);

		const form = await validateFormWithFailOnError(request, createTrackerSchema);

		const tracker = await createOrgTracker(locals.user.organization.id, form.data).catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'vehicle_tracker_imei_unique')) {
				return setError(form, 'imei', 'IMEI in use by another tracker');
			}

			throw e;
		});

		const createdTracker = trackerSchema.parse(tracker);

		return { form, createdTracker };
	}
};
