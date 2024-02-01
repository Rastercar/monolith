import { z } from 'zod';

const phoneRegExp = /^\+?\d{10,14}$/;

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
	// TODO:!
	phoneNumber: z.string().min(1).regex(phoneRegExp, 'invalid phone number'),

	apnUser: z.string().min(1),
	apnAddress: z.string().min(1),
	apnPassword: z.string().min(1),

	pin: z.string().nullable(),
	pin2: z.string().nullable(),

	puk: z.string().nullable(),
	puk2: z.string().nullable(),

	trackerId: z.number().nullable()
});

export type SimCard = z.infer<typeof simCardSchema>;

export type CreateSimCardBody = z.infer<typeof createSimCardSchema>;
