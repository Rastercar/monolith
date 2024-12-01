import { createUserSchema } from '$lib/api/user.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => ({
	createUserForm: await superValidate(zod(createUserSchema))
});
