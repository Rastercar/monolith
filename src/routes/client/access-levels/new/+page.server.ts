import { createAccessLevelSchema } from '$lib/api/access-level.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createAccessLevelForm: await superValidate(zod(createAccessLevelSchema))
});
