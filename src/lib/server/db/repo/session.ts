import { eq } from 'drizzle-orm';
import { getDB } from '../db';
import { session } from '../schema';

export async function findSessionByPublicId(id: number) {
	return getDB().query.session.findFirst({
		where: (session, { eq }) => eq(session.publicId, id)
	});
}

export async function findSessionsByUserId(userId: number) {
	return getDB().query.session.findMany({
		where: (session, { eq }) => eq(session.userId, userId)
	});
}

export async function createSession(sessionData: {
	ip: string;
	userId: number;
	userAgent: string;
	expiresAt: string;
}) {
	const [createdSession] = await getDB().insert(session).values(sessionData).returning();
	return createdSession;
}

export function deleteSessionByToken(token: string) {
	return getDB().delete(session).where(eq(session.sessionToken, token));
}

export function deleteSessionByPublicId(id: number) {
	return getDB().delete(session).where(eq(session.publicId, id));
}
