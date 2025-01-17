import { env as publicEnv } from '$env/dynamic/public';
import z from 'zod';

const schema = z.object({
	PUBLIC_GOOGLE_MAPS_MAP_ID: z.string(),
	PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
	PUBLIC_CLOUDFRONT_BASE_URL: z.string().includes('cloudfront').url()
});

/**
 * typesafe public env vars
 */
export const env = schema.parse(publicEnv);
