import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	findOrganizationByConfirmBillingEmailToken,
	setBillingEmailVerifiedAndClearConfirmEmailToken,
	setConfirmBillingEmailToken,
	updateOrganization
} from './organization';

describe('access level repo', async () => {
	let testDb: TestDbHelper;

	const orgId = 1;
	const token = 'bad60176-f334-4690-ba24-84cf60cf6c2e';

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('organization_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('setConfirmBillingEmailToken', async () => {
		const result = await setConfirmBillingEmailToken(orgId, token);
		expect(result).toBeDefined();
	});

	test('findOrganizationByConfirmBillingEmailToken', async () => {
		await setConfirmBillingEmailToken(orgId, token);

		const org = await findOrganizationByConfirmBillingEmailToken(token);
		expect(org?.confirmBillingEmailToken).toBe(token);
	});

	test('setBillingEmailVerifiedAndClearConfirmEmailToken', async () => {
		await setConfirmBillingEmailToken(orgId, token);
		await setBillingEmailVerifiedAndClearConfirmEmailToken(token);

		const org = await testDb.db.query.organization.findFirst({
			where: (org, { eq }) => eq(org.id, orgId)
		});

		expect(org?.billingEmailVerified).toBe(true);
		expect(org?.confirmBillingEmailToken).toBe(null);
	});

	test('updateOrganization', async () => {
		await updateOrganization(orgId, {
			name: 'new name',
			billingEmail: 'new_email@gmail.com'
		});

		const org = await testDb.db.query.organization.findFirst({
			where: (org, { eq }) => eq(org.id, orgId)
		});

		const org2 = await testDb.db.query.organization.findFirst({
			where: (org, { eq }) => eq(org.id, orgId + 1)
		});

		expect(org?.billingEmail).not.toEqual(org2?.billingEmail);
	});
});
