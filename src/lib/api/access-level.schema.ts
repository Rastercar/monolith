import { permissions } from '$lib/constants/permissions';
import { z } from 'zod';

export const getAccessLevelSearchParamsSchema = z.object({
	name: z.string().optional()
});

export const accessLevelSchema = z.object({
	id: z.number(),
	createdAt: z.date({ coerce: true }),
	name: z.string(),
	description: z.string(),
	isFixed: z.boolean(),
	permissions: z.array(z.string())
});

export const createAccessLevelSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	permissions: z.array(z.enum(permissions))
});

export const updateAccessLevelSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	permissions: z.array(z.enum(permissions)).optional()
});

export type AccessLevel = z.infer<typeof accessLevelSchema>;

export type UpdateAccessLevelBody = z.infer<typeof updateAccessLevelSchema>;

export type CreateAccessLevelBody = z.infer<typeof createAccessLevelSchema>;

export type GetAccessLevelFilters = z.infer<typeof getAccessLevelSearchParamsSchema>;
