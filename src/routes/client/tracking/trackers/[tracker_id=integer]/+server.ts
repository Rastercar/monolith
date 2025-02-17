import {
	deleteTrackerSchema,
	trackerSchema,
	updateTrackerSchema,
	type UpdateTrackerBody,
	type UpdateTrackerRes
} from '$lib/api/tracker.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import type { IdAndOrgId } from '$lib/server/db/repo/utils';
import { findOrgVehicleById } from '$lib/server/db/repo/vehicle';
import { deleteOrgTrackerById, updateOrgTracker } from '$lib/server/db/repo/vehicle-tracker';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export async function _updateVehicleTracker(
	ids: IdAndOrgId,
	body: UpdateTrackerBody
): Promise<UpdateTrackerRes> {
	return updateOrgTracker(ids, body)
		.then((tracker) => trackerSchema.parse(tracker))
		.catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'vehicle_tracker_imei_unique')) {
				return { error: 'IMEI_IN_USE' };
			}

			throw e;
		});
}

export const DELETE: RequestHandler = async ({ params, request, locals }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'DELETE_TRACKER' });

	const trackerId = parseInt(params.tracker_id);

	const { deleteAssociatedSimCards = false } = await validateJsonRequestBody(
		request,
		deleteTrackerSchema
	);

	await deleteOrgTrackerById({ id: trackerId, orgId }, deleteAssociatedSimCards);

	return json('tracker card deleted');
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const { orgId } = acl(locals, { requiredPermissions: 'UPDATE_TRACKER' });

	const simCardId = parseInt(params.tracker_id);

	const body = await validateJsonRequestBody(request, updateTrackerSchema);

	if (body.vehicleId) {
		const vehicle = await findOrgVehicleById({ id: body.vehicleId, orgId });
		if (!vehicle) error(400, 'vehicle not found');
	}

	let trackerOrError = await _updateVehicleTracker({ id: simCardId, orgId }, body);

	if ('error' in trackerOrError) {
		error(400, { message: 'invalid request body', code: trackerOrError.error });
	}

	return json(trackerOrError);
};
