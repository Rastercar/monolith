import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

/**
 * app healthcheck route, this is not useless as it is pinged
 * regurlarly by aws to check on the status of the service
 */
export function GET({ url }) {
	if ((url.searchParams.get('debug') ?? '').toLocaleLowerCase() === 'true') {
		const errMsg = '[error] should not be undefined';

		return json({
			origin: env.ORIGIN ?? errMsg,
			commitHash: import.meta.env.VITE_COMMIT_HASH ?? errMsg
		});
	}

	return new Response('ok');
}
