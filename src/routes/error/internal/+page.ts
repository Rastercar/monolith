import { NO_PAGE_METADATA } from '$lib/constants/error-codes';
import type { PageLoad } from './$types';

const errorCodeToMessage: Record<string, string> = {
	[NO_PAGE_METADATA]: 'the page you tried to access is not finished'
};

export const load: PageLoad = ({ url }) => {
	const errorCode = url.searchParams.get('error_code');

	const defaultErrorMessage = 'Something unexpected happened on our end';

	if (!errorCode) return { errorMessage: defaultErrorMessage };

	return { errorMessage: errorCodeToMessage[errorCode] ?? defaultErrorMessage };
};
