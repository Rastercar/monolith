import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { createUserSchema } from '$lib/api/user.schema';

export const load: PageServerLoad = async () => ({
  createUserForm: await superValidate(zod(createUserSchema))
});
