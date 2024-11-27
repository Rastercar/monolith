import { env as privateEnv } from '$env/dynamic/private';
import z from 'zod';
import { castStringToBool } from '../utils/zod-validators';

const schema = z.object({
	JAEGER_URL: z.string(),
	RABBITMQ_URL: z.string().includes('amqp'),
	DATABASE_URL: z.string().includes('postgres'),
	AWS_REGION: z.string(),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_S3_UPLOADS_BUCKET: z.string(),
	DATABASE_QUERY_LOGGING: castStringToBool,
	DATABASE_NOTICE_LOGGING: castStringToBool
});

/**
 * typesafe private env vars
 */
export const env = schema.parse(privateEnv);
