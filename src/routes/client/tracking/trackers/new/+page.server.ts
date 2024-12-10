import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, trackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { createOrgTracker } from '$lib/server/db/repo/tracker.js';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createSimCardForm: await superValidate(zod(createSimCardSchema)),
	updateSimCardForm: await superValidate(zod(updateSimCardSchema)),
	createTrackerForm: await superValidate(zod(createTrackerSchema)),
	updateTrackerForm: await superValidate(zod(updateTrackerSchema))
});

export const actions = {
	createTracker: async ({ request, locals }) => {
		const { user } = acl(locals, { requiredPermissions: 'CREATE_TRACKER' });

		const form = await validateFormWithFailOnError(request, createTrackerSchema);

		const trackerOrError = await createOrgTracker(user.organization.id, form.data).catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'vehicle_tracker_imei_unique')) {
				return 'vehicle_tracker_imei_unique' as const;
			}

			throw e;
		});

		if (trackerOrError === 'vehicle_tracker_imei_unique') {
			return setError(form, 'imei', 'IMEI in use by another tracker');
		}

		const createdTracker = trackerSchema.parse(trackerOrError);
		return { form, createdTracker };
	}
};
