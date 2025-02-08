import {
	simCardSchema,
	updateSimCardSchema,
	type UpdateSimCardBody,
	type UpdateSimCardRes
} from '$lib/api/sim-card.schema';
import { isErrorFromUniqueConstraint } from '$lib/server/db/error';
import { deleteOrgSimCardById, updateOrgSimCard } from '$lib/server/db/repo/sim-card';
import { acl } from '$lib/server/middlewares/auth';
import { validateJsonRequestBody } from '$lib/server/middlewares/validation';
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

export const DELETE: RequestHandler<RouteParams> = async ({ params, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'DELETE_SIM_CARD' });

	const simCardId = parseInt(params.sim_card_id);

	await deleteOrgSimCardById(simCardId, user.organization.id);

	return json('sim card deleted');
};

export const PUT: RequestHandler<RouteParams> = async ({ params, request, locals }) => {
	const { user } = acl(locals, { requiredPermissions: 'UPDATE_SIM_CARD' });

	const simCardId = parseInt(params.sim_card_id);

	const body = await validateJsonRequestBody(request, updateSimCardSchema);

	let simOrError = await _updateSimCard(simCardId, user.organization.id, body);

	if ('error' in simOrError) {
		error(400, { message: 'invalid request body', code: simOrError.error });
	}

	return json(simOrError);
};
