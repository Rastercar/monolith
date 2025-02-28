import { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
import { createTrackerSchema, trackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { findOrgVehicleById } from '$lib/server/db/repo/vehicle';
import { createOrgTracker } from '$lib/server/db/repo/vehicle-tracker';
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
		const { orgId } = acl(locals, { requiredPermissions: 'CREATE_TRACKER' });

		const form = await validateFormWithFailOnError(request, createTrackerSchema);

		if (form.data.vehicleId) {
			const vehicleToAssociate = await findOrgVehicleById({ id: form.data.vehicleId, orgId });

			if (!vehicleToAssociate) {
				return setError(form, 'vehicleId', 'veículo não encontrado');
			}
		}

		const trackerOrError = await createOrgTracker(orgId, form.data).catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'vehicle_tracker_imei_unique')) {
				return 'vehicle_tracker_imei_unique' as const;
			}

			throw e;
		});

		if (trackerOrError === 'vehicle_tracker_imei_unique') {
			return setError(form, 'imei', 'IMEI em uso por outro rastreador');
		}

		const createdTracker = trackerSchema.parse(trackerOrError);
		return { form, createdTracker };
	}
};
