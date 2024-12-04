import { consola } from 'consola';
import { lt, sql } from 'drizzle-orm';
import { db } from './db/db';
import { session } from './db/schema';

interface Cron {
	timeout: ReturnType<typeof setInterval>;
	description: string;
	intervalSeconds: number;
}

interface CreateCronArgs {
	key: string;
	description: string;
	intervalSeconds: number;
	cb: () => void;
}

function fmt(seconds: number): string {
	if (seconds < 60) {
		return `${seconds} second${seconds !== 1 ? 's' : ''}`;
	}

	if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}

	if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		return `${hours} hour${hours !== 1 ? 's' : ''}`;
	}

	const days = Math.floor(seconds / 86400);
	return `${days} day${days !== 1 ? 's' : ''}`;
}

function createCron({ key, description, intervalSeconds, cb }: CreateCronArgs) {
	consola.info(`[CRON] registering cronjob: ${key} with interval of ${fmt(intervalSeconds)}`);

	// If a cron with this key already exists, then clear the previous interval
	if (runningCrons[key]) {
		console.warn(`[CRON] conjob with key ${key} has changed`);
		clearInterval(runningCrons[key].timeout);
	}

	runningCrons[key] = {
		description,
		intervalSeconds,
		timeout: setInterval(() => {
			consola.info(`[CRON] running cron job: ${key} - ${description}`);
			cb();
		}, intervalSeconds * 1_000)
	};
}

/**
 * Warning: since this is a very naive implementation using nodeJS intervals,
 * whenever running sveltekit on dev mode with HMR modifying cronjobs wont
 * delete the previous cronjobs, so restart the DEV server.
 */
function startCronjobs() {
	createCron({
		key: 'DeleteSessions',
		description: 'Deletes Expired Sessions',
		intervalSeconds: 5 * 60,
		cb: () => {
			db.delete(session).where(lt(session.expiresAt, sql`NOW()`));
		}
	});
}

const runningCrons: Record<string, Cron | undefined> = {};

startCronjobs();

/** noop to start cronjobs */
export const initCronJobs = () => null;
