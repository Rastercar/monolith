import { z } from 'zod';
import { organizationSchema, type Organization } from './auth';
import { rastercarApi } from './common';

export const updateOrganizationSchema = z.object({
	name: z.string().min(5).max(32).optional(),
	billingEmail: z.string().email().optional()
});

export type UpdateOrganizationBody = z.infer<typeof updateOrganizationSchema>;

/**
 * updates the user organization, returning the updated values
 */
export const apiUpdateOrganization = async (body: UpdateOrganizationBody): Promise<Organization> =>
	rastercarApi.patch(body, '/organization').json<Organization>().then(organizationSchema.parse);
