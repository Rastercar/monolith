import { delay } from '$lib/utils/promises';
import { describe, expect, test, vi } from 'vitest';
import { VehicleTrackerImeiToIdCache, type CacheMissHistory } from './tracker-id-cache';

const fakeImei = 'abc';
const fakeVehicleTrackerId = 1;

test('get returns the ID when its found on the cache', async () => {
	const cache = new VehicleTrackerImeiToIdCache();

	cache.imeiToId[fakeImei] = fakeVehicleTrackerId;

	const spy = vi.spyOn(cache, 'getFromDb');
	const result = await cache.get(fakeImei);

	expect(spy).toHaveBeenCalledTimes(0);
	expect(result).toBe(fakeVehicleTrackerId);
});

test('get returns the ID when its found on the DB', async () => {
	const cache = new VehicleTrackerImeiToIdCache();

	const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(fakeVehicleTrackerId);
	const result = await cache.get(fakeImei);

	expect(spy).toHaveBeenCalledWith(fakeImei);
	expect(result).toBe(fakeVehicleTrackerId);
});

test('get returns null when the imei is not found on the cache nor the DB', async () => {
	const cache = new VehicleTrackerImeiToIdCache();

	const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);
	const result = await cache.get(fakeImei);

	expect(spy).toHaveBeenCalledWith(fakeImei);
	expect(result).toBe(null);
});

test('get sets the ID found on the DB on after a cache miss', async () => {
	const cache = new VehicleTrackerImeiToIdCache();

	const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(fakeVehicleTrackerId);
	let result = await cache.get(fakeImei);

	expect(spy).toHaveBeenCalledWith(fakeImei);
	expect(result).toBe(fakeVehicleTrackerId);

	// subsequent call should not call the DB again
	result = await cache.get(fakeImei);
	expect(spy).toHaveBeenCalledTimes(1);

	expect(result).toBe(fakeVehicleTrackerId);
	expect(cache.imeiToId[fakeImei]).toBe(fakeVehicleTrackerId);
});

test('get cache miss is set on the cache miss history', async () => {
	const cache = new VehicleTrackerImeiToIdCache();

	const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);
	let result = await cache.get(fakeImei);

	expect(spy).toHaveBeenCalledWith(fakeImei);
	expect(result).toBe(null);

	expect(cache.imeiToMissHistory[fakeImei]).toBeTruthy();

	const { firstMissAt: firstMissAt, cacheMissCount } = cache.imeiToMissHistory[
		fakeImei
	] as CacheMissHistory;

	expect(cacheMissCount).toBe(1);
	expect(firstMissAt).toBeTypeOf('number');
});

describe('cache miss history', async () => {
	const createCache = () => {
		const cache = new VehicleTrackerImeiToIdCache();

		cache.maxConsecutiveMisses = 5;
		cache.millisecondsToIgnoreAttemptsAfterMaxMissesReached = 10;

		return cache;
	};

	test('sets the "firstMissAt" epoch on the first miss', async () => {
		const cache = createCache();
		vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);

		await cache.get(fakeImei);

		expect(cache.imeiToMissHistory[fakeImei]?.firstMissAt).toBeTypeOf('number');
	});

	test('increases the counter until maxConsecutiveMisses is reached', async () => {
		const cache = createCache();
		vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);

		await cache.get(fakeImei);
		const firstMissAt = cache.imeiToMissHistory[fakeImei]?.firstMissAt;

		for (let attempt = 2; attempt < cache.maxConsecutiveMisses; attempt++) {
			await cache.get(fakeImei);

			expect(cache.imeiToMissHistory[fakeImei]?.cacheMissCount).toBe(attempt);
			expect(cache.imeiToMissHistory[fakeImei]?.firstMissAt).toEqual(firstMissAt);
		}
	});

	test('the next attempt after reaching the max misses is ignored and does not increment the miss counter', async () => {
		const cache = createCache();
		const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);

		await cache.get(fakeImei);
		const firstMissAt = cache.imeiToMissHistory[fakeImei]?.firstMissAt as number;

		for (let attempt = 2; attempt < cache.maxConsecutiveMisses; attempt++) {
			await cache.get(fakeImei);
		}

		// now we wait for the ignore windown to expire and attempt again, this should reset the miss history
		await delay(cache.millisecondsToIgnoreAttemptsAfterMaxMissesReached);

		await cache.get(fakeImei);

		expect(spy).toHaveBeenCalledTimes(cache.maxConsecutiveMisses);

		expect(cache.imeiToMissHistory[fakeImei]?.cacheMissCount).toBe(1);
		expect(cache.imeiToMissHistory[fakeImei]?.firstMissAt).toBeGreaterThan(firstMissAt);
	});

	test('after the ignore time window is expired, hits the DB again on another miss', async () => {
		const cache = createCache();

		cache.maxConsecutiveMisses = 1;
		cache.millisecondsToIgnoreAttemptsAfterMaxMissesReached = 10;

		const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);
		await cache.get(fakeImei);

		// wait for the ignore windown to expire and attempt again
		await delay(cache.millisecondsToIgnoreAttemptsAfterMaxMissesReached);
		await cache.get(fakeImei);
		await delay(10);

		expect(spy).toHaveBeenCalledTimes(2);
	});

	test('prevents DB hits if the attempt should be ignored', async () => {
		const cache = createCache();

		cache.maxConsecutiveMisses = 1;
		cache.millisecondsToIgnoreAttemptsAfterMaxMissesReached = 10;

		const spy = vi.spyOn(cache, 'getFromDb').mockResolvedValue(null);
		await cache.get(fakeImei);

		// attempt to get the value
		for (let i = 0; i < 10; i++) {
			await cache.get(fakeImei);
		}

		// assert only the first attempt triggered a DB attempt
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
