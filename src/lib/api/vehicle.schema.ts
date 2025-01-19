import { megabytesToBytes } from '$lib/utils/number';
import { emptyStringToNull } from '$lib/utils/string';
import { z } from 'zod';
import { trackerSchema } from './tracker.schema';

const TEN_YEARS_FROM_NOW = new Date().getFullYear() + 10;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Check if a string follws the AAA9999 or AAA9A99
 */
const isMercosulOrBrPlate = (v: string): boolean => {
	const mercosulOrBrFormat = /^[a-z]{3}[0-9][a-z0-9][0-9]{2}$/;

	return mercosulOrBrFormat.test(v);
};

const isOptionalDateBetween = (min: number, max: number) => (v?: string | number | null) => {
	if (!v) return true;

	const n = typeof v === 'number' ? v : parseInt(v);
	return !Number.isNaN(n) && n >= min && n <= max;
};

export const getVehiclesSearchParamsSchema = z.object({
	plate: z.string().optional()
});

export const createVehicleSchema = z.object({
	plate: z.string().refine(isMercosulOrBrPlate, 'invalid vehicle plate'),

	photo: z
		.instanceof(File, { message: 'Please upload a file.' })
		.nullable()
		.refine((f?: File | null) => !f || f.size <= megabytesToBytes(5), `Max file size is 5MB.`)
		.refine(
			(f?: File | null) => !f || ACCEPTED_IMAGE_TYPES.includes(f.type),
			'jpg, jpeg, png and webp files are accepted.'
		),

	brand: z.string().min(1),
	model: z.string().min(1),
	color: z.string().nullable(),

	// idk how many X years into the future a car can be branded as but ive never
	// seen more than 10 years above the current date, so lets use that lol.
	modelYear: z.coerce
		.number()
		.nullable()
		.refine(
			isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW),
			`model year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	fabricationYear: z.coerce
		.number()
		.nullable()
		.refine(
			isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW),
			`fabrication year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	chassisNumber: z.string().nullable(),
	additionalInfo: z.string().nullable()
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
		.number()
		.nullish()
		.refine(
			(v) => isOptionalDateBetween(1900, TEN_YEARS_FROM_NOW)(v),
			`model year must be between 1900 and ${TEN_YEARS_FROM_NOW}`
		),

	fabricationYear: z
		.number()
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
	createdAt: z.date({ coerce: true }),
	plate: z.string(),
	photo: z.string().nullable(),
	brand: z.string().nullable(),
	model: z.string().nullable(),
	color: z.string().nullable(),
	modelYear: z.number().nullable(),
	fabricationYear: z.number().nullable(),
	chassisNumber: z.string().nullable(),
	additionalInfo: z.string().nullable(),
	vehicleTracker: trackerSchema.nullish()
});

export type GetVehiclesFilters = z.infer<typeof getVehiclesSearchParamsSchema>;

export type CreateVehicleBody = z.infer<typeof createVehicleSchema>;

export type UpdateVehicleBody = z.infer<typeof updateVehicleSchema>;

export type Vehicle = z.infer<typeof vehicleSchema>;
