import { randomBytes } from 'crypto';
import { db } from '../db';
import { session } from '../schema';

function generateSessionToken() {
	// 16 bytes = 128 bits
	return randomBytes(16);
}

export async function createSession(sessionData: {
	userAgent: string;
	ip: string;
	userId: number;
	expiresAt: string;
}) {
	const [createdSession] = await db
		.insert(session)
		.values({
			...sessionData,
			sessionToken: generateSessionToken()
		})
		.returning();

	return createdSession;
}
