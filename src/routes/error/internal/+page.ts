import type { PageLoad } from './$types';

const errorCodeToMessage: Record<string, string> = {
	no_meta: 'the page you tried to access is not finished'
};

export const load: PageLoad = ({ url }) => {
	const errorCode = url.searchParams.get('error_code');

	const defaultErrorMessage = 'Something unexpected happened on our end';

	if (!errorCode) return { errorMessage: defaultErrorMessage };

	return { errorMessage: errorCodeToMessage[errorCode] ?? defaultErrorMessage };
};
