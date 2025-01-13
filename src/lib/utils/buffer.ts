import type { z, ZodSchema } from 'zod';

export function readBufferAsUtf8JsonOfSchema<T extends ZodSchema>(
	buffer: Buffer,
	schema: T
): z.infer<T> {
	const json = JSON.parse(buffer.toString('utf8'));
	return schema.parse(json);
}
