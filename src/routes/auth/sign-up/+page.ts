import type { PageLoad } from './$types';

export const load: PageLoad = ({ url, data }) => ({
	...data,
	onSuccessRedirectTo: url.searchParams.get('redirect')
});
