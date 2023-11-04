import { z } from 'zod';

const tenYearsFromNow = new Date().getFullYear() + 10;

const isOptionalDateBetween = (min: number, max: number) => (v?: string | null) => {
	if (!v) return true;
	const n = parseInt(v);
	return !Number.isNaN(n) && n >= min && n <= max;
};

export const createVehicleSchema = z.object({
	plate: z
		.string()
		.min(1)
		.refine((v) => {
			if (!v) return false;

			const mercosulOrBrFormat = /^[a-z]{3}[0-9][a-z0-9][0-9]{2}$/;

			// AAA9999 or AAA9A99
			return mercosulOrBrFormat.test(v);
		}, 'invalid vehicle plate'),

	brand: z.string().min(1),
	model: z.string().min(1),
	color: z.string().optional(),

	// idk how many X years into the future a car can be branded as but ive never
	// seen more than 10 years above the current date, so lets use that lol.
	modelYear: z
		.string()
		.optional()
		.refine(
			isOptionalDateBetween(1900, tenYearsFromNow),
			`model year must be between 1900 and ${tenYearsFromNow}`
		),
	fabricationYear: z
		.string()
		.optional()
		.refine(
			isOptionalDateBetween(1900, tenYearsFromNow),
			`fabrication year must be between 1900 and ${tenYearsFromNow}`
		),
	chassisNumber: z.string().optional(),
	additionalInfo: z.string().optional()
});

export type CreateVehicleBody = z.infer<typeof createVehicleSchema>;
