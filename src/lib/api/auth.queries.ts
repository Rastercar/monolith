import { showErrorToast } from '$lib/store/toast';
import { promiseWithMinimumTimeOf } from '$lib/utils/promises';
import { createMutation } from '@tanstack/svelte-query';
import {
	apiConfirmEmailAddress,
	apiDeleteUserSession,
	apiRequestEmailAddressConfirmation,
	apiSignOutSpecificSession
} from './auth';
import type { ConfirmEmailAddressBody, RequestEmailConfirmationBody } from './auth.schema';
import type { ApiMutationOptions } from './common';

export function apiRequestEmailAddressConfirmationMutation() {
	return createMutation(() => ({
		mutationFn: (body: RequestEmailConfirmationBody) =>
			promiseWithMinimumTimeOf(apiRequestEmailAddressConfirmation(body), 1_500),
		onError: showErrorToast
	}));
}

export function apiConfirmEmailAddressMutation(
	opts?: ApiMutationOptions<string, unknown, ConfirmEmailAddressBody>
) {
	return createMutation(() => ({
		mutationFn: (args: ConfirmEmailAddressBody) => {
			const promise = apiConfirmEmailAddress(args);
			return promiseWithMinimumTimeOf(promise, 1_500);
		},
		onError: showErrorToast,
		...opts
	}));
}

interface ApiDeleteUserSessionMutationArgs {
	sessionOwnerId?: number;
	sessionPublicId: number;
}

export function apiDeleteUserSessionMutation(
	opts?: ApiMutationOptions<string, unknown, ApiDeleteUserSessionMutationArgs>
) {
	return createMutation(() => ({
		mutationFn: ({ sessionOwnerId, sessionPublicId }: ApiDeleteUserSessionMutationArgs) => {
			const promise = sessionOwnerId
				? apiDeleteUserSession(sessionOwnerId, sessionPublicId)
				: apiSignOutSpecificSession(sessionPublicId);

			return promiseWithMinimumTimeOf(promise, 1_000);
		},
		...opts
	}));
}
