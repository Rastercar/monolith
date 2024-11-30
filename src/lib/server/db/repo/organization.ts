import { eq } from 'drizzle-orm';
import { db } from '../db';
import { organization } from '../schema';

export async function setConfirmBillingEmailToken(id: number, token: string) {
	return db
		.update(organization)
		.set({ confirmBillingEmailToken: token })
		.where(eq(organization.id, id));
}

export async function findOrganizationByConfirmBillingEmailToken(token: string) {
	return db.query.organization.findFirst({
		where: (org, { eq }) => eq(org.confirmBillingEmailToken, token)
	});
}

export async function setBillingEmailVerifiedAndClearConfirmEmailToken(token: string) {
	return db
		.update(organization)
		.set({ billingEmailVerified: true, confirmBillingEmailToken: null })
		.where(eq(organization.confirmBillingEmailToken, token));
}

export async function updateOrganization(body: { billingEmail?: string; name?: string }) {
	const [updatedOrg] = await db.update(organization).set(body).returning();

	return updatedOrg;
}
