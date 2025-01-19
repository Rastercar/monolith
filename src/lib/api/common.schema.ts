import { megabytesToBytes } from '$lib/utils/number';
import { z } from 'zod';

export const imageSchema = z.object({
	image: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < megabytesToBytes(5), 'Max 5MB upload size.')
});

export type ImageBody = z.infer<typeof imageSchema>;
