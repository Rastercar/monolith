import { deleteTrackerSchema } from '$lib/api/tracker.schema';
import { deleteOrgTrackerById } from '$lib/server/db/repo/tracker';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestBody } from '$lib/server/middlewares/validation';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const DELETE: RequestHandler<RouteParams> = async ({ params, request, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'DELETE_TRACKER' });

	const trackerId = parseInt(params.tracker_id);

	const { deleteAssociatedSimCards = false } = await validateRequestBody(
		request,
		deleteTrackerSchema
	);

	await deleteOrgTrackerById(trackerId, user.organization.id, deleteAssociatedSimCards);

	return json('tracker card deleted');
};
