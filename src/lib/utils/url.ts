import { PUBLIC_CLOUDFRONT_BASE_URL } from '$env/static/public';

/**
 * Creates the correct cloudfront URL for objects stored
 * on the rastercar cloudfront distribution
 */
export const cloudFrontUrl = (s: string) => `${PUBLIC_CLOUDFRONT_BASE_URL}/${s}`;
