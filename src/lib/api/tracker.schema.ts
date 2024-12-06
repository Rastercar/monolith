import { TRACKER_MODEL_H02, trackerModels } from '$lib/constants/tracker-models';
import { castStringToOptionalBool } from '$lib/utils/zod-validators';
import { z } from 'zod';
import { simCardSchema } from './sim-card.schema';

export const deleteTrackerSchema = z.object({
	deleteAssociatedSimCards: z.boolean().optional()
});

export const getTrackerLocationsSearchParamsSchema = z.object({
	/**
	 * query positions that appear only after a timestamp
	 */
	after: z.string().datetime().optional(),

	/**
	 * query positions that appear only before a timestamp
	 */
	before: z.string().datetime().optional(),

	/**
	 * the amount of positions to be fetched
	 */
	limit: z.coerce.number().min(1).max(20).default(10)
});

export const getTrackersSearchParamsSchema = z.object({
	imei: z.string().optional(),
	withAssociatedVehicle: castStringToOptionalBool
});

export const createTrackerSchema = z.object({
	imei: z.string().min(1),
	model: z.enum(trackerModels),
	vehicleId: z.number().optional()
});

export const updateTrackerSchema = z.object({
	imei: z.string().min(1),
	model: z.enum(trackerModels)
});

export const trackerSchema = z.object({
	id: z.number(),
	imei: z.string(),

	// use a literal since only one model is supported for now
	model: z.literal(TRACKER_MODEL_H02),
	vehicleId: z.number().nullable(),
	organizationId: z.number(),
	createdAt: z.date({ coerce: true }),

	simCards: z.array(simCardSchema).optional()
});

export const trackerLocationSchema = z.object({
	time: z.string().datetime(),
	point: z.object({
		lat: z.number().min(-90).max(90),
		lng: z.number().min(-180).max(180)
	})
});

export type Tracker = z.infer<typeof trackerSchema>;

export type GetTrackersFilters = z.infer<typeof getTrackersSearchParamsSchema>;

export type CreateTrackerBody = z.infer<typeof createTrackerSchema>;

export type UpdateTrackerBody = z.infer<typeof updateTrackerSchema>;

export type DeleteTrackerBody = z.infer<typeof deleteTrackerSchema>;

export type GetTrackerLocationsFilters = z.infer<typeof getTrackerLocationsSearchParamsSchema>;

export type TrackerLocation = z.infer<typeof trackerLocationSchema>;
