import {
	organizationSchema,
	type Organization,
	type UpdateOrganizationBody
} from './organization.schema';
import { api } from './utils';

/**
 * updates the user organization, returning the updated values
 */
export const apiUpdateOrganization = (body: UpdateOrganizationBody): Promise<Organization> =>
	api.patch(body, '/organization').json<Organization>().then(organizationSchema.parse);

/**
 * requests a email address confirmation email to be sent to the user organization billing email address
 *
 * ### required permissions
 *
 * - `UPDATE_ORGANIZATION`
 */
export const apiRequestOrganizationBillingEmailAddressConfirmationEmail = (): Promise<string> =>
	api.post({}, '/organization/request-email-address-confirmation').json<string>();

/**
 * confirms the email address of a the organization the user belongs to
 *
 * this token is obtained on the a link sent to the user email address, meaning it can
 * only be retrieved by someone with access to said email address
 *
 * ### required permissions
 *
 * - `UPDATE_ORGANIZATION`
 */
export const apiConfirmOrgEmailAddressByToken = (token: string): Promise<string> =>
	api.post({ token }, '/organization/confirm-email-address-by-token').json<string>();
