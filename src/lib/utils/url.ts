import { PUBLIC_CLOUDFRONT_BASE_URL } from '$env/static/public';

export const cloudFrontUrl = (s: string) => `${PUBLIC_CLOUDFRONT_BASE_URL}/${s}`;
