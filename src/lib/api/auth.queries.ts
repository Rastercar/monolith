import { withMinTime } from '$lib/utils/promises';
import {
	apiConfirmEmailAddress,
	apiDeleteUserSession,
	apiRequestEmailAddressConfirmation,
	apiSignOutSpecificSession
} from './auth';
import type { ConfirmEmailAddressBody, RequestEmailConfirmationBody } from './auth.schema';
import { createApiMutation, type ApiMutation } from './common';

export function apiRequestEmailAddressConfirmationMutation() {
	return createApiMutation({
		fn: (body: RequestEmailConfirmationBody) =>
			withMinTime(apiRequestEmailAddressConfirmation(body), 1_500)
	});
}

export function apiConfirmEmailAddressMutation(
	opts?: ApiMutation<string, ConfirmEmailAddressBody>
) {
	return createApiMutation({
		fn: (args: ConfirmEmailAddressBody) => withMinTime(apiConfirmEmailAddress(args), 1_500),
		...opts
	});
}

interface ApiDeleteUserSessionMutationArgs {
	sessionOwnerId?: number;
	sessionPublicId: number;
}

export function apiDeleteUserSessionMutation(
	opts?: ApiMutation<string, ApiDeleteUserSessionMutationArgs>
) {
	return createApiMutation({
		fn: ({ sessionOwnerId, sessionPublicId }) => {
			return sessionOwnerId
				? apiDeleteUserSession(sessionOwnerId, sessionPublicId)
				: apiSignOutSpecificSession(sessionPublicId);
		},
		...opts
	});
}
