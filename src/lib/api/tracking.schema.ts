import { z } from 'zod';

export const positionSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  trackerId: z.number()
});

export type TrackerPosition = z.infer<typeof positionSchema>;
