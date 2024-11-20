import { lt, sql } from 'drizzle-orm';
import { db } from './db/db';
import { session } from './db/schema';

interface Cron {
	timeout: ReturnType<typeof setInterval>;
	interval: number;
	description: string;
}

const runningCrons: Record<string, Cron | undefined> = {};

interface CreateCronArgs {
	key: string;
	description: string;
	intervalMilliseconds: number;
	cb: () => void;
}

function createCron({ key, description, intervalMilliseconds, cb }: CreateCronArgs) {
	// If a cron with this key already exists, then clear the previous interval
	if (runningCrons[key]) {
		console.warn(`[CRON] conjob with key ${key} has changed`);
		clearInterval(runningCrons[key].timeout);
	}

	runningCrons[key] = {
		description,
		interval: intervalMilliseconds,
		timeout: setInterval(() => {
			const timeStamp = new Date().toLocaleString();
			console.log(`[CRON] ${timeStamp} running cron job: ${key} - ${description}`);
			cb();
		}, intervalMilliseconds)
	};
}

/**
 * Warning: since this is a very naive implementation using nodeJS intervals,
 * whenever running sveltekit on dev mode with HMR modifying cronjobs wont
 * delete the previous cronjobs, so restart the DEV server.
 */
export function startCronjobs() {
	console.log('[CRON] removing sessions every 5 minutes');
	createCron({
		key: 'deleteExpiredSessions',
		description: 'Deletes Expired Sessions',
		intervalMilliseconds: 5 * 60 * 1000,
		cb: () => {
			db.delete(session).where(lt(session.expiresAt, sql`NOW()`));
		}
	});
}
