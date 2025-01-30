/**
 * app healthcheck route, this is not useless as it is pinged
 * regurlarly by aws to check on the status of the service
 */
export function GET() {
	return new Response('ok');
}
