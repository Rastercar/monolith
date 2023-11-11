import { z } from 'zod';

export const createTrackerSchema = z.object({
	imei: z.string().min(1),
	model: z.string().min(1),
	vehicleId: z.number().optional()
});

export const trackerSchema = z.object({
	id: z.number(),
	imei: z.string(),
	model: z.string(),
	vehicleId: z.number().nullable(),
	organizationId: z.number(),
	createdAt: z.string().datetime()
});

export type Tracker = z.infer<typeof trackerSchema>;

export type CreateTrackerBody = z.infer<typeof createTrackerSchema>;
