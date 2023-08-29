import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return { onSuccessRedirectTo: url.searchParams.get('to') };
};
