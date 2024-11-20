import { z } from 'zod';

export const updateOrganizationSchema = z.object({
	name: z.string().min(5).max(32).optional(),
	billingEmail: z.string().email().optional()
});

export const organizationSchema = z.object({
	id: z.number(),
	createdAt: z.date({ coerce: true }),
	name: z.string(),
	billingEmail: z.string(),
	blocked: z.boolean(),
	billingEmailVerified: z.boolean()
});

export type Organization = z.infer<typeof organizationSchema>;

export type UpdateOrganizationBody = z.infer<typeof updateOrganizationSchema>;
