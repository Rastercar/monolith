import { runningCrons } from '$lib/server/cronjobs';
import { db } from '$lib/server/db/db';
import { rmqConnection } from '$lib/server/rabbitmq/rabbitmq';

/**
 * TODO: after migrating and fixing all errors, we need to
 * check how this performs, does this run twice in production mode ?
 * are we in risk of starting cron jobs or db connections mutiple times ?
 */
export async function bootstrapApplication() {
	const _ = db;
	const __ = rmqConnection;
	const ___ = runningCrons;
}
