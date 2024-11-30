import { userSessionSchema } from '$lib/api/user.schema';
import { findSessionsByUserId } from '$lib/server/db/repo/session';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.session) return error(400);

	const sessionsFromDb = await findSessionsByUserId(locals.user.id);

	const sessions = sessionsFromDb
		.map((s) => ({ ...s, sameAsFromRequest: s.publicId === locals.session?.publicId }))
		.map((s) => userSessionSchema.parse(s));

	return { sessions };
};
