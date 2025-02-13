import { z } from 'zod';

export const getFleetsSearchParamsSchema = z.object({
	name: z.string().optional()
});

export const fleetSchema = z.object({
	id: z.number(),
	organizationId: z.number(),
	createdAt: z.date({ coerce: true }),
	name: z.string(),
	description: z.string()
});

export const createFleetSchema = z.object({
	name: z.string().min(3),
	description: z.string().min(5)
});

export const updateFleetSchema = z.object({
	name: z.string().min(3).optional(),
	description: z.string().min(5).optional()
});

export type Fleet = z.infer<typeof fleetSchema>;

export type GetFleetsFilters = z.infer<typeof getFleetsSearchParamsSchema>;

export type CreateFleetBody = z.infer<typeof createFleetSchema>;

export type UpdateFleetBody = z.infer<typeof updateFleetSchema>;
