import { z } from 'zod';

const e164phoneRegExp = /^\+?\d{10,14}$/;

export const simCardSchema = z.object({
	id: z.number(),
	createdAt: z.string().datetime(),

	ssn: z.string(),
	phoneNumber: z.string(),

	apnUser: z.string(),
	apnAddress: z.string(),
	apnPassword: z.string(),

	pin: z.string().nullable(),
	pin2: z.string().nullable(),

	puk: z.string().nullable(),
	puk2: z.string().nullable(),

	trackerId: z.number().nullable(),
	organizationId: z.number()
});

export const createSimCardSchema = z.object({
	ssn: z.string().min(1),

	phoneNumber: z.string().regex(e164phoneRegExp, 'invalid phone number'),

	apnUser: z.string().min(1),
	apnAddress: z.string().min(1),
	apnPassword: z.string().min(1),

	pin: z.string().nullable(),
	pin2: z.string().nullable(),

	puk: z.string().nullable(),
	puk2: z.string().nullable(),

	trackerId: z.number().nullable()
});

export const updateSimCardSchema = z.object({
	ssn: z.string().min(1),

	phoneNumber: z.string().regex(e164phoneRegExp, 'invalid phone number'),

	apnUser: z.string().min(1),
	apnAddress: z.string().min(1),
	apnPassword: z.string().min(1),

	pin: z.string().nullable(),
	pin2: z.string().nullable(),

	puk: z.string().nullable(),
	puk2: z.string().nullable(),

	trackerId: z.number().nullable()
});

export const trackerLocationSchema = z.object({
	time: z.string().datetime(),
	point: z.object({
		y: z.number().min(-90).max(90),
		x: z.number().min(-180).max(180)
	})
});

export type SimCard = z.infer<typeof simCardSchema>;

export type TrackerLocation = z.infer<typeof trackerLocationSchema>;

export type CreateSimCardBody = z.infer<typeof createSimCardSchema>;

export type UpdateSimCardBody = z.infer<typeof updateSimCardSchema>;
