import { building } from '$app/environment';
import { env as publicEnv } from '$env/dynamic/public';
import z from 'zod';

const schema = z.object({
	PUBLIC_GOOGLE_MAPS_MAP_ID: z.string(),
	PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
	PUBLIC_CLOUDFRONT_BASE_URL: z.string().includes('cloudfront').url()
});

/**
 * typesafe public env vars
 *
 * (the variables are not checked nor loaded if the code is being executed during build)
 */
export const env = building ? ({} as z.infer<typeof schema>) : schema.parse(publicEnv);
