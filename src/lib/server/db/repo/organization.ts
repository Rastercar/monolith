import { eq } from 'drizzle-orm';
import { getDB } from '../db';
import { organization } from '../schema';

export async function setConfirmBillingEmailToken(id: number, token: string) {
	return getDB()
		.update(organization)
		.set({ confirmBillingEmailToken: token })
		.where(eq(organization.id, id));
}

export async function findOrganizationByConfirmBillingEmailToken(token: string) {
	return getDB().query.organization.findFirst({
		where: (org, { eq }) => eq(org.confirmBillingEmailToken, token)
	});
}

export async function setBillingEmailVerifiedAndClearConfirmEmailToken(token: string) {
	return getDB()
		.update(organization)
		.set({ billingEmailVerified: true, confirmBillingEmailToken: null })
		.where(eq(organization.confirmBillingEmailToken, token));
}

export async function updateOrganization(
	id: number,
	body: { billingEmail?: string; name?: string }
) {
	const [updatedOrg] = await getDB()
		.update(organization)
		.set(body)
		.where(eq(organization.id, id))
		.returning();

	return updatedOrg;
}
