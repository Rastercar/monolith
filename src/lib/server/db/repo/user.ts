import { db } from '../db';

export async function getUserByCredentials(credentials: { email: string; password: string }) {
	const user = await db.query.user.findFirst({
		with: { accessLevel: true, organization: true },
		where: (user, { eq }) => eq(user.email, credentials.email)
	});

	return user;
}
