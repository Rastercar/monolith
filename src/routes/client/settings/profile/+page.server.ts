import { updateUserSchema } from '$lib/api/user.schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ form: await superValidate(updateUserSchema) });
