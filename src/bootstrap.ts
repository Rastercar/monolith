import { initCronJobs } from '$lib/server/cronjobs';
import { initDb } from '$lib/server/db/db';
import { initRabbitMq } from '$lib/server/rabbitmq/rabbitmq';
import { initS3 } from '$lib/server/services/s3';

/**
 * TODO: after migrating and fixing all errors, we need to
 * check how this performs, does this run twice in production mode ?
 * are we in risk of starting cron jobs or db connections multiple times ?
 */
export async function bootstrapApplication() {
	// each of these calls are no ops, the startup code
	// is evaluated and executed when importing their modules
	initDb();
	initS3();
	initRabbitMq();
	initCronJobs();
}
