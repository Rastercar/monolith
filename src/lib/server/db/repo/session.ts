import { eq } from 'drizzle-orm';
import { db } from '../db';
import { session } from '../schema';

export async function findSessionByPublicId(id: number) {
	return db.query.session.findFirst({
		where: (session, { eq }) => eq(session.publicId, id)
	});
}

export async function findSessionsByUserId(userId: number) {
	return db.query.session.findMany({
		where: (session, { eq }) => eq(session.userId, userId)
	});
}

export async function createSession(sessionData: {
	ip: string;
	userId: number;
	userAgent: string;
	expiresAt: string;
}) {
	const [createdSession] = await db.insert(session).values(sessionData).returning();
	return createdSession;
}

export function deleteSessionByToken(token: string) {
	return db.delete(session).where(eq(session.sessionToken, token));
}

export function deleteSessionByPublicId(id: number) {
	return db.delete(session).where(eq(session.publicId, id));
}
