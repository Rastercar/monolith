import { env as publicEnv } from '$env/dynamic/public';
import z from 'zod';
import { castStringToBool } from '../utils/zod-validators';

const schema = z.object({
	PUBLIC_IS_DEV: castStringToBool,
	PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
	PUBLIC_CLOUDFRONT_BASE_URL: z.string().includes('cloudfront').url()
});

/**
 * typesafe public env vars
 */
export const env = schema.parse(publicEnv);
