import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { vehicleTracker } from '../db/schema';

interface CacheMissHistory {
	/**
	 * epoch (in milliseconds) of the first cache miss
	 */
	firstMissAt: number;

	/**
	 * amount of cache misses, this is reset after a cache hit
	 */
	cacheMissCount: number;
}

// TODO: como esse cõdigo aqui é critico mas o caso de erro nao vai ocorrer localmente, vamos criar os testes usando
// deno (apos migrar pro deno)
class VehicleTrackerImeiToIdCache {
	db = db;

	/**
	 * key: imei
	 * val: ID of the tracker with said IMEI
	 */
	imeiToId: Record<string, number | undefined> = {};

	/**
	 * key: imei
	 * val: cache miss history for said IMEI
	 */
	imeiToCacheMissHistory: Record<string, CacheMissHistory | undefined> = {};

	/**
	 * amount of times a imei can fail to find a tracker ID before
	 * the next attempts are ignored (for a while) to avoid performance costs
	 */
	maxConsecutiveCacheMisses = 5;

	secondsToIgnoreAttemptsAfterMaxConsecutiveCacheMissesReached = 5 * 60;

	private set(imei: string, id: number) {
		this.imeiToId[imei] = id;
	}

	private delete(imei: string) {
		delete this.imeiToId[imei];
		delete this.imeiToCacheMissHistory[imei];
	}

	private async getFromDb(imei: string): Promise<number | null> {
		const result = await this.db
			.select({ id: vehicleTracker.id })
			.from(vehicleTracker)
			.where(eq(vehicleTracker.imei, imei))
			.limit(1);

		return result?.[0]?.id ?? null;
	}

	/**
	 * gets a tracker ID by IMEI, attempts to get the value
	 * on the cache first and if not found hits the DB
	 *
	 * If there was too many failed attempts for a given imei, its assumed a tracker with this imei does not exist
	 * and for a period of time NULL will be returned for all GET attempts to avoid needlessly accessing the database
	 */
	async get(imei: string): Promise<number | null> {
		const cacheMissistory = this.imeiToCacheMissHistory[imei];

		if (cacheMissistory) {
			// TODO: this is wrong i should compare against the ellapsed time since first miss at
			const isWithinTimeWindow =
				cacheMissistory.firstMissAt <
				this.secondsToIgnoreAttemptsAfterMaxConsecutiveCacheMissesReached;

			const hasReachedMaxAttempts =
				cacheMissistory.cacheMissCount >= this.maxConsecutiveCacheMisses;

			// If the current attempt is within the time window and the maximun amount
			// of attempts has been reached, avoid trying to get the value from the
			// cache or the database as it will most likely be none.
			if (isWithinTimeWindow && hasReachedMaxAttempts) {
				return null;
			}
		}

		const cachedId = this.imeiToId[imei];
		if (cachedId) return cachedId;

		const idFromDb = await this.getFromDb(imei);
		if (idFromDb) return idFromDb;

		const nowEpoch = new Date().getTime();

		if (!this.imeiToCacheMissHistory[imei]) {
			this.imeiToCacheMissHistory[imei] = { cacheMissCount: 1, firstMissAt: nowEpoch };
			return null;
		}

		const { cacheMissCount, firstMissAt } = this.imeiToCacheMissHistory[imei];

		// TODO:
		const ellapsedSeconds = 10;

		const isWithinTimeWindow =
			ellapsedSeconds < this.secondsToIgnoreAttemptsAfterMaxConsecutiveCacheMissesReached;

		if (isWithinTimeWindow) {
			this.imeiToCacheMissHistory[imei].cacheMissCount++;
		} else {
			this.imeiToCacheMissHistory[imei] = { cacheMissCount: 1, firstMissAt: nowEpoch };
		}

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
export const VEHICLE_TRACKER_IMEI_TO_ID_CACHE = new VehicleTrackerImeiToIdCache();
