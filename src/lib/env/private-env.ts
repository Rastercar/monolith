import { env as privateEnv } from '$env/dynamic/private';
import z from 'zod';
import { castStringToBool } from '../utils/zod-validators';

const schema = z.object({
	JAEGER_URL: z.string(),
	RABBITMQ_URL: z.string().includes('amqp'),

	AWS_REGION: z.string(),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_S3_UPLOADS_BUCKET: z.string(),

	DATABASE_URL: z.string().includes('postgres'),
	DATABASE_QUERY_LOGGING: castStringToBool,
	DATABASE_QUERY_LOGGING_FORMATTED: castStringToBool,
	DATABASE_NOTICE_LOGGING: castStringToBool,
	DATABASE_SEED_ON_STARTUP: castStringToBool,

	// NONE = 0
	// ERROR = 30
	// WARN = 50
	// INFO = 60
	// DEBUG = 70
	// VERBOSE = 80
	// ALL = 9999
	OTEL_DIAG_LOG_LEVEL: z.preprocess(
		(p) => parseInt(p as string),
		z.union([
			z.literal(0),
			z.literal(30),
			z.literal(50),
			z.literal(60),
			z.literal(70),
			z.literal(80),
			z.literal(9999)
		])
	),

	/**
	 * if spans should be exported to stdout
	 */
	EXPORT_OTEL_SPANS_TO_STDOUT: castStringToBool
});

/**
 * typesafe private env vars
 */
export const env = schema.parse(privateEnv);
