import { env } from '$lib/public-env';

/**
 * Creates the correct cloudfront URL for objects stored
 * on the rastercar cloudfront distribution
 */
export const cloudFrontUrl = (s: string) => `${env.PUBLIC_CLOUDFRONT_BASE_URL}/${s}`;

export const getBooleanFromUrlQuery = (url: URL, queryKey: string): boolean =>
	['true', 't', 'TRUE', 'T'].includes(url.searchParams.get(queryKey) ?? '');
