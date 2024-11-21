import { recoverPasswordSchema } from '$lib/api/auth.schema';
import { findUserByEmail } from '$lib/server/db/repo/user';
import { fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(recoverPasswordSchema))
});

export const actions: Actions = {
	recoverPassword: async ({ request }) => {
		const form = await superValidate(request, zod(recoverPasswordSchema));
		if (!form.valid) return fail(400, { form });

		const user = await findUserByEmail(form.data.email);
		if (!user) return setError(form, 'email', 'user not found with this email');

		// TODO: !
		//
		// because there is no way we will handle raw TCP/UDP
		// connections and do bitwise decoding in javascript,
		// the decoder Rust service stays on
		//
		// now we have 2 options:
		//
		// 1- nuke RabbitMQ out of orbit and make life simple (no rmq, no tracing, more joy)
		// - rewrite the decoder to insert on the database (cross service DB sharing ew...)
		// - think about how we will handle events on the decoder without rmq
		// - nuke mailer out of orbit and rewrite it in the monolith
		//
		// 2- keep RabbitMQ
		// - keep the mailer, just make it a fire and forget to the mailer queue
		// - keep the decoder events and write a consumer on the monolith
		// - deal with tracing and all that crap
		//
		// also check with route() the confirm-email-address link and parameters
		// const res = await apiRequestRecoverPasswordEmail(form.data.email);

		return message(form, { text: 'Recovery email sent', type: 'success' });
	}
};
