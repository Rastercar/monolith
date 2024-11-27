import { eq } from 'drizzle-orm';
import { db } from '../db';
import { organization } from '../schema';

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
