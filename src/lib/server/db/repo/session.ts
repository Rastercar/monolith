import { eq } from 'drizzle-orm';
import { db } from '../db';
import { session } from '../schema';

export async function createSession(sessionData: {
	ip: string;
	userId: number;
	userAgent: string;
	expiresAt: string;
}) {
	const [createdSession] = await db.insert(session).values(sessionData).returning();
	return createdSession;
}

export async function destroySessionByToken(token: string) {
	return db.delete(session).where(eq(session.sessionToken, token));
}
