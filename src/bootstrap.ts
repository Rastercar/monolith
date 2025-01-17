import { initCronJobs } from '$lib/server/cronjobs';
import { initDb } from '$lib/server/db/db';
import { initRabbitMq } from '$lib/server/rabbitmq/rabbitmq';
import { initS3 } from '$lib/server/services/s3';

export async function bootstrapApplication() {
	// each of these calls are no ops, the startup code
	// is evaluated and executed when importing their modules
	initDb();
	initS3();
	initRabbitMq();
	initCronJobs();
}
