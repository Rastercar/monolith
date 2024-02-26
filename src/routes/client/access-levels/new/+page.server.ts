import { createAccessLevelSchema } from '$lib/api/access-level.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	createAccessLevelForm: await superValidate(zod(createAccessLevelSchema))
});
