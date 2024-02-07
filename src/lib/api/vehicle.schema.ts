import { emptyStringToNull } from '$lib/utils/string';
import { z } from 'zod';

const TEN_YEARS_FROM_NOW = new Date().getFullYear() + 10;

const FIVE_MB = 1024 * 1024 * 5;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Check if a string follws the AAA9999 or AAA9A99
 */
const isMercosulOrBrPlate = (v: string): boolean => {
	const mercosulOrBrFormat = /^[a-z]{3}[0-9][a-z0-9][0-9]{2}$/;

	return mercosulOrBrFormat.test(v);
};

const isOptionalDateBetween = (min: number, max: number) => (v?: string | null) => {
	if (!v) return true;

	const n = parseInt(v);
	return !Number.isNaN(n) && n >= min && n <= max;
};

export const createVehicleSchema = z.object({
	plate: z.string().refine(isMercosulOrBrPlate, 'invalid vehicle plate'),

	photoName: z.string(),
	photo: z
		.any()
		.optional()
		.refine((f?: File) => {
			return !f || f.size <= FIVE_MB;
		}, `Max file size is 5MB.`)
		.refine(
			(f?: File) => !f || ACCEPTED_IMAGE_TYPES.includes(f.type),
			'jpg, jpeg, png and webp files are accepted.'
		),

	brand: z.string().min(1),
	model: z.string().min(1),
	color: z.string().optional(),

	// idk how many X years into the future a car can be branded as but ive never
	// seen more than 10 years above the current date, so lets use that lol.
	modelYear: z
		.string()
		.optional()
		.refine(
			isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW),
			`model year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	fabricationYear: z
		.string()
		.optional()
		.refine(
			isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW),
			`fabrication year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	chassisNumber: z.string().optional(),
	additionalInfo: z.string().optional()
});

export const updateVehicleSchema = z.object({
	plate: z.string().refine(isMercosulOrBrPlate, 'invalid vehicle plate'),

	brand: z
		.string()
		.transform(emptyStringToNull)
		.transform((v) => v || null)
		.nullish(),

	model: z.string().transform(emptyStringToNull).nullish(),
	color: z.string().transform(emptyStringToNull).nullish(),

	modelYear: z
		.string()
		.transform(emptyStringToNull)
		.nullish()
		.refine(
			(v) => isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW)(v),
			`model year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	fabricationYear: z
		.string()
		.transform(emptyStringToNull)
		.nullish()
		.refine(
			(v) => isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW)(v),
			`model year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	chassisNumber: z.string().transform(emptyStringToNull).nullish(),
	additionalInfo: z.string().transform(emptyStringToNull).nullish()
});

export const vehicleSchema = z.object({
	id: z.number(),
	organizationId: z.number(),
	createdAt: z.string().datetime(),
	plate: z.string(),
	photo: z.string().nullable(),
	brand: z.string().nullable(),
	model: z.string().nullable(),
	color: z.string().nullable(),
	modelYear: z.number().nullable(),
	fabricationYear: z.number().nullable(),
	chassisNumber: z.string().nullable(),
	additionalInfo: z.string().nullable()
});

export type CreateVehicleBody = z.infer<typeof createVehicleSchema>;

export type UpdateVehicleBody = z.infer<typeof updateVehicleSchema>;

export type Vehicle = z.infer<typeof vehicleSchema>;
