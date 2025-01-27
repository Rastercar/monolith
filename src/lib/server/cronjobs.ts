import { consola } from 'consola';
import { deleteExpiredSessions } from './db/repo/session';

interface Cron {
	timeout: ReturnType<typeof setInterval>;
	description: string;
	intervalMilliseconds: number;
}

interface CreateCronArgs {
	key: string;
	description: string;
	intervalMilliseconds: number;
	cb: () => void;
}

const runningCrons: Record<string, Cron | undefined> = {};

export function fmt(seconds: number): string {
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

export function createCron(
	{ key, description, intervalMilliseconds, cb }: CreateCronArgs,
	logOnReplace = true
) {
	consola.info(`[CRON] registering cronjob: ${key} with interval of ${fmt(intervalMilliseconds)}`);

	// If a cron with this key already exists, then clear the previous interval
	if (runningCrons[key]) {
		if (logOnReplace) consola.warn(`[CRON] conjob ${key} has changed`);
		clearInterval(runningCrons[key].timeout);
	}

	runningCrons[key] = {
		description,
		intervalMilliseconds,
		timeout: setInterval(() => {
			consola.info(`[CRON] running cron job: ${key} - ${description}`);
			cb();
		}, intervalMilliseconds)
	};
}

/**
 * Warning: since this is a very naive implementation using nodeJS intervals,
 * whenever running sveltekit on dev mode with HMR modifying cronjobs wont
 * delete the previous cronjobs, so restart the DEV server.
 */
export function initCronJobs() {
	createCron({
		key: 'DeleteSessions',
		description: 'Deletes Expired Sessions',
		intervalMilliseconds: 5 * 60 * 1_000,
		cb: deleteExpiredSessions
	});
}
