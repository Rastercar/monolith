import { z } from 'zod';

export const createTrackerSchema = z.object({
	imei: z.string().min(1),
	model: z.string().min(1)
});
