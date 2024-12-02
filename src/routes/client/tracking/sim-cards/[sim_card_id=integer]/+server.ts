import { deleteOrgSimCardById } from '$lib/server/db/repo/sim-card';
import { withAuth } from '$lib/server/middlewares/auth';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = withAuth(async ({ params, locals }) => {
	const simCardId = parseInt(params.sim_card_id);

	await deleteOrgSimCardById(simCardId, locals.user.organization.id);

	return json('sim card deleted');
});
