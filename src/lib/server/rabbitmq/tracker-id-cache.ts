import consola from 'consola';
import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { vehicleTracker } from '../db/schema';

export interface CacheMissHistory {
	/**
	 * epoch (in milliseconds) of the first cache miss
	 */
	firstMissAt: number;

	/**
	 * amount of cache misses, this is reset after a cache hit
	 */
	cacheMissCount: number;
}

export class VehicleTrackerImeiToIdCache {
	private db = db;
	private debug = false;

	constructor(debug: boolean) {
		this.debug = debug;
	}

	/**
	 * key: imei
	 * val: ID of the tracker with said IMEI
	 */
	imeiToId: Record<string, number | undefined> = {};

	/**
	 * key: imei
	 * val: cache miss history for said IMEI
	 */
	imeiToMissHistory: Record<string, CacheMissHistory | undefined> = {};

	/**
	 * amount of times a imei can fail to find a tracker ID before
	 * the next attempts are ignored (for a while) to avoid performance costs
	 */
	maxConsecutiveMisses = 5;

	millisecondsToIgnoreAttemptsAfterMaxMissesReached = 5 * 60 * 1000;

	delete(imei: string) {
		delete this.imeiToId[imei];
		delete this.imeiToMissHistory[imei];
	}

	async getFromDb(imei: string): Promise<number | null> {
		const result = await this.db
			.select({ id: vehicleTracker.id })
			.from(vehicleTracker)
			.where(eq(vehicleTracker.imei, imei))
			.limit(1);

		return result?.[0]?.id ?? null;
	}

	/**
	 * gets a tracker ID by IMEI, attempts to get the value
	 * on the cache first and fallbacks to the DB on a miss
	 *
	 * If there was too many failed attempts for a given imei, its assumed a tracker with this imei does not exist
	 * and for a period of time NULL will be returned for all GET attempts to avoid needlessly accessing the database
	 */
	async get(imei: string): Promise<number | null> {
		if (this.debug) consola.debug('[tracker-cache] getting imei', imei);

		const cacheMissHistory = this.imeiToMissHistory[imei];

		// if there is a cache miss history for this imei,
		// check if the current attempt should be ignored
		if (cacheMissHistory) {
			const millisecondsSinceLastMiss = new Date().getTime() - cacheMissHistory.firstMissAt;

			const isWithinIgnoreAttemptTimeWindow =
				millisecondsSinceLastMiss < this.millisecondsToIgnoreAttemptsAfterMaxMissesReached;

			const hasReachedMaxAttempts = cacheMissHistory.cacheMissCount >= this.maxConsecutiveMisses;

			// If the current attempt is within the time window and the maximun amount
			// of attempts has been reached, avoid trying to get the value from the
			// cache or the database as it will most likely be none.
			if (isWithinIgnoreAttemptTimeWindow && hasReachedMaxAttempts) {
				if (this.debug) consola.debug(imei, ' returned null due to ignore period');
				return null;
			}
		}

		const cachedId = this.imeiToId[imei];
		if (cachedId) return cachedId;

		const idFromDb = await this.getFromDb(imei);
		if (idFromDb) {
			this.imeiToId[imei] = idFromDb;
			return idFromDb;
		}

		// at this point there has been a cache miss and a DB miss
		const nowEpoch = new Date().getTime();

		// if there is no cache miss history for this imei, create it
		if (!this.imeiToMissHistory[imei]) {
			this.imeiToMissHistory[imei] = { cacheMissCount: 1, firstMissAt: nowEpoch };
			return null;
		}

		// if this is another cache miss we need to determine if should
		// reset the cacheMissCount and the firstMissAt instance
		const { firstMissAt } = this.imeiToMissHistory[imei];

		const millisecondsSinceFirstMiss = nowEpoch - firstMissAt;

		const isWithinIgnoreTimeWindow =
			millisecondsSinceFirstMiss < this.millisecondsToIgnoreAttemptsAfterMaxMissesReached;

		// if the current miss is within the ignore attempt time window then just increment the counter
		if (isWithinIgnoreTimeWindow) {
			this.imeiToMissHistory[imei].cacheMissCount++;
			return null;
		}

		// if the miss is after the ignore time windown, then should reset the miss count and set firstMissAt
		// to the current time instance, this 'resets' the cache means further attempts wont be ignored
		this.imeiToMissHistory[imei] = { cacheMissCount: 1, firstMissAt: nowEpoch };
		return null;
	}
}

/**
 * A in memory singleton of a tracker ID cache, this is meant to help getting the ID of trackers without
 * acessing the database a lot, especially when consuming tracker events from rabbitmq, where only the IMEI is available.
 *
 * this cache also ignores attempts for a certain period of time to get a ID by a imei if the imei resulted in
 * consecutive cache misses, this is a realistic scenario if there is a tracker comunicating with the platform but not
 * registered on the database
 */
export const VEHICLE_TRACKER_IMEI_TO_ID_CACHE = new VehicleTrackerImeiToIdCache(true);
