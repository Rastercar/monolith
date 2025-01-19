import { initCronJobs } from '$lib/server/cronjobs';
import { initDb } from '$lib/server/db/db';
import { initRabbitMq } from '$lib/server/rabbitmq/rabbitmq';
import { initS3 } from '$lib/server/services/s3';

export async function bootstrapApplication() {
	initDb();
	initS3();
	initRabbitMq();
	initCronJobs();
}
