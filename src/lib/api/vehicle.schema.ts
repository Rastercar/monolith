import { z } from 'zod';

export const createVehicleSchema = z.object({
	// TODO: plate regex validator, uniqueness validator, etc
	plate: z
		.string()
		.min(1)
		.refine((v) => {
			if (!v) return false;

			// AAA9A99 or AAA9999
			const mercosulFormat = /^[a-z]{3}[0-9][a-z][0-9]{2}$/;
			const brOldFormat = /^[a-z]{3}[0-9]{4}$/;

			return brOldFormat.test(v) || mercosulFormat.test(v);
		}, 'invalid vehicle plate'),

	modelYear: z.number().optional(),
	fabricationYear: z.number().optional(),
	chassisNumber: z.string().optional(),
	brand: z.string(),
	model: z.string(),
	color: z.string().optional(),
	additionalInfo: z.string().optional()
});
