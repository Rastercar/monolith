import { startCronjobs } from '$lib/server/cronjobs';
import { runDbMigrations } from '$lib/server/db/db';

export async function bootstrapApplication() {
	await runDbMigrations();
	startCronjobs();
}
