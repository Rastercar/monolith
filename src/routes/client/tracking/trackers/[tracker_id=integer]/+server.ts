import { deleteTrackerSchema } from '$lib/api/tracker.schema';
import { deleteOrgTrackerById } from '$lib/server/db/repo/tracker';
import { withAuth } from '$lib/server/middlewares/auth';
import { validateRequestBody } from '$lib/server/middlewares/validation';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = withAuth(async ({ params, request, locals }) => {
	const trackerId = parseInt(params.tracker_id);

	const { deleteAssociatedSimCards = false } = await validateRequestBody(
		request,
		deleteTrackerSchema
	);

	await deleteOrgTrackerById(trackerId, locals.user.organization.id, deleteAssociatedSimCards);

	return json('tracker card deleted');
}, 'DELETE_TRACKER');
