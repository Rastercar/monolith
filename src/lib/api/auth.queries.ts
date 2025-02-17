import { withMinTime } from '$lib/utils/promises';
import {
	apiConfirmEmailAddress,
	apiDeleteUserSession,
	apiRequestEmailAddressConfirmation,
	apiSignOutSpecificSession
} from './auth';
import type { ConfirmEmailAddressBody, RequestEmailConfirmationBody } from './auth.schema';
import { createMutation, type ApiMutation } from './common';

export function apiRequestEmailAddressConfirmationMutation() {
	return createMutation({
		fn: (body: RequestEmailConfirmationBody) =>
			withMinTime(apiRequestEmailAddressConfirmation(body), 1_500)
	});
}

export function apiConfirmEmailAddressMutation(
	opts?: ApiMutation<string, ConfirmEmailAddressBody>
) {
	return createMutation({
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
	return createMutation({
		fn: ({ sessionOwnerId, sessionPublicId }) => {
			return sessionOwnerId
				? apiDeleteUserSession(sessionOwnerId, sessionPublicId)
				: apiSignOutSpecificSession(sessionPublicId);
		},
		...opts
	});
}
