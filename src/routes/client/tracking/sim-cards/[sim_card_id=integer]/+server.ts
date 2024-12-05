import {
	simCardSchema,
	updateSimCardSchema,
	type UpdateSimCardBody,
	type UpdateSimCardRes
} from '$lib/api/sim-card.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { deleteOrgSimCardById, updateOrgSimCard } from '$lib/server/db/repo/sim-card';
import { withAuth } from '$lib/server/middlewares/auth';
import { validateRequestBody } from '$lib/server/middlewares/validation';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export async function _updateSimCard(
	id: number,
	orgId: number,
	body: UpdateSimCardBody
): Promise<UpdateSimCardRes> {
	return updateOrgSimCard(id, orgId, body)
		.then((sim) => simCardSchema.parse(sim))
		.catch((e) => {
			if (isErrorFromUniqueConstraint(e, 'sim_card_ssn_unique')) {
				return { error: 'SSN_IN_USE' };
			}

			if (isErrorFromUniqueConstraint(e, 'sim_card_phone_number_unique')) {
				return { error: 'PHONE_IN_USE' };
			}

			throw e;
		});
}

export const DELETE: RequestHandler<RouteParams> = withAuth(async ({ params, locals }) => {
	const simCardId = parseInt(params.sim_card_id);

	await deleteOrgSimCardById(simCardId, locals.user.organization.id);

	return json('sim card deleted');
});

export const PUT: RequestHandler<RouteParams> = withAuth(async ({ params, request, locals }) => {
	const simCardId = parseInt(params.sim_card_id);

	const body = await validateRequestBody(request, updateSimCardSchema);

	let simOrError = await _updateSimCard(simCardId, locals.user.organization.id, body);

	if ('error' in simOrError) {
		error(400, { message: 'invalid request body', code: simOrError.error });
	}

	return json(simOrError);
}, 'UPDATE_SIM_CARD');
