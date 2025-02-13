import { createFleetSchema, fleetSchema } from '$lib/api/fleet.schema';
import { createOrgFleet } from '$lib/server/db/repo/fleet.js';
import { acl } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createFleetForm: await superValidate(zod(createFleetSchema))
});

export const actions = {
	createFleet: async ({ request, locals }) => {
		const { user } = acl(locals, { requiredPermissions: 'CREATE_FLEET' });

		const form = await validateFormWithFailOnError(request, createFleetSchema);

		const newFleet = await createOrgFleet(user.organization.id, form.data);

		return { form, createdFleet: fleetSchema.parse(newFleet) };
	}
};
