import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
	createAndSetTestDatabaseAsDbSingleton,
	type TestDbHelper
} from '../../../../test/integration-utils';
import {
	createSession,
	deleteExpiredSessions,
	deleteSessionByPublicId,
	deleteSessionByToken,
	findSessionByPublicId,
	findSessionByToken,
	findSessionsByUserId
} from './session';

describe('access level repo', async () => {
	let testDb: TestDbHelper;

	const token = 'bad60176-f334-4690-ba24-84cf60cf6c2e';

	const newSessionData = {
		ip: '192.168.0.1',
		userId: 1,
		userAgent: 'Test',
		expiresAt: new Date().toISOString()
	};

	beforeAll(async () => {
		testDb = await createAndSetTestDatabaseAsDbSingleton('session_repo_test');
	});

	afterAll(async () => {
		await testDb.dropDatabaseAndCloseConnection();
	});

	test('findSessionByToken / createSession', async () => {
		let result = await findSessionByToken(token);
		expect(result).toBeUndefined();

		const createdSession = await createSession(newSessionData);

		result = await findSessionByToken(createdSession.sessionToken);

		const { expiresAt: _, ...expected } = newSessionData;
		expect(result).toMatchObject(expected);
	});

	test('findSessionByPublicId', async () => {
		const createdSession = await createSession(newSessionData);

		const result = await findSessionByPublicId(createdSession.publicId);

		const { expiresAt: _, ...expected } = newSessionData;
		expect(result).toMatchObject(expected);
	});

	test('findSessionsByUserId', async () => {
		const createdSession = await createSession(newSessionData);

		const result = await findSessionsByUserId(createdSession.userId);

		expect(result.some((s) => s.publicId === createdSession.userId)).toBe(true);
	});

	test('deleteSessionByToken', async () => {
		const createdSession = await createSession(newSessionData);

		let session = await findSessionByToken(createdSession.sessionToken);
		expect(session).toBeDefined();

		await deleteSessionByToken(createdSession.sessionToken);

		session = await findSessionByToken(createdSession.sessionToken);
		expect(session).toBeUndefined();
	});

	test('deleteSessionByPublicId', async () => {
		const createdSession = await createSession(newSessionData);

		let session = await findSessionByPublicId(createdSession.publicId);
		expect(session).toBeDefined();

		await deleteSessionByPublicId(createdSession.publicId);

		session = await findSessionByPublicId(createdSession.publicId);
		expect(session).toBeUndefined();
	});

	test('deleteExpiredSessions', async () => {
		const today = new Date();

		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		const expiredSessionData = {
			...newSessionData,
			expiresAt: yesterday.toISOString()
		};

		const createdSession = await createSession(expiredSessionData);

		await deleteExpiredSessions();

		const session = await findSessionByPublicId(createdSession.publicId);
		expect(session).toBeUndefined();
	});
});
