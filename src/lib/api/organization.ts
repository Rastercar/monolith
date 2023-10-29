import {
	organizationSchema,
	type Organization,
	type UpdateOrganizationBody
} from './organization.schema';
import { rastercarApi } from './utils';

/**
 * updates the user organization, returning the updated values
 */
export const apiUpdateOrganization = async (body: UpdateOrganizationBody): Promise<Organization> =>
	rastercarApi.patch(body, '/organization').json<Organization>().then(organizationSchema.parse);
