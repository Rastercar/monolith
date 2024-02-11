import { TRACKER_MODEL_H02 } from '$lib/constants/tracker-models';
import { z } from 'zod';

export const createTrackerSchema = z.object({
	imei: z.string().min(1),
	model: z.string().min(1),
	vehicleId: z.number().optional()
});

// TODO:
export const updateTrackerSchema = z.object({
	imei: z.string(),
	model: z.string()
});

export const trackerSchema = z.object({
	id: z.number(),
	imei: z.string(),

	// use a literal since only one model is supported for now
	model: z.literal(TRACKER_MODEL_H02),
	vehicleId: z.number().nullable(),
	organizationId: z.number(),
	createdAt: z.string().datetime()
});

export type Tracker = z.infer<typeof trackerSchema>;

export type CreateTrackerBody = z.infer<typeof createTrackerSchema>;

export type UpdateTrackerBody = z.infer<typeof updateTrackerSchema>;
