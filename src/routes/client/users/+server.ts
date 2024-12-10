import { getUsersSearchParamsSchema } from '$lib/api/user.schema.js';
import { findOrgUsersWithPagination } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateRequestSearchParams } from '$lib/server/middlewares/validation';
import { getPaginationParamsFromSearchParams } from '$lib/utils/pagination';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const { user } = acl(locals);

	const pagination = getPaginationParamsFromSearchParams(url.searchParams);

	const filters = validateRequestSearchParams(url.searchParams, getUsersSearchParamsSchema);

	const users = await findOrgUsersWithPagination(user.organization.id, {
		filters,
		pagination
	});

	return json(users);
};
