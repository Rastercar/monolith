import { flushSync } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { createTrackerMock } from '../../test/mocking-utils';
import { MAP_REALTIME_VIEW_LS_KEY, TRACKER_POSITION_CACHE_LS_KEY } from './keys';
import { MapPageStore, type TrackerIdToLastPosition, type TrackerSelection } from './map.svelte';

// TODO: fix broken tests
describe('MapPageStore', () => {
	const setLs = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

	const loadLs = (k: string) => JSON.parse(localStorage.getItem(k) ?? '');

	test('loads mapSelectedTrackers and trackerPositionCache from local storage', () => {
		$effect.root(() => {
			let store = new MapPageStore();

			expect(store.mapSelectedTrackers).toEqual({});
			expect(store.trackerPositionCache).toEqual({});

			const mapSelectedTrackers = { fake: 'value' };
			const trackerPositionCache = { fake: 'value' };

			setLs(MAP_REALTIME_VIEW_LS_KEY, mapSelectedTrackers);
			setLs(TRACKER_POSITION_CACHE_LS_KEY, trackerPositionCache);

			store = new MapPageStore();

			flushSync();

			expect(store.mapSelectedTrackers).toEqual(mapSelectedTrackers);
			expect(store.trackerPositionCache).toEqual(trackerPositionCache);
		});
	});

	test('syncs mapSelectedTrackers and trackerPositionCache with local storage', () => {
		$effect.root(() => {
			localStorage.clear();

			let store = new MapPageStore();

			expect(store.mapSelectedTrackers).toEqual({});
			expect(store.trackerPositionCache).toEqual({});

			store.mapSelectedTrackers = { fake: 'value' } as TrackerSelection;
			store.trackerPositionCache = { fake: 'value' } as TrackerIdToLastPosition;

			store = new MapPageStore();

			flushSync();

			expect(loadLs(MAP_REALTIME_VIEW_LS_KEY)).toEqual(store.mapSelectedTrackers);
			expect(loadLs(TRACKER_POSITION_CACHE_LS_KEY)).toEqual(store.trackerPositionCache);
		});
	});

	test('getTrackersMapBounds - creates a google.maps.LatLngBounds instance that fits every selected tracker', () => {
		global.google = {
			maps: {
				LatLngBounds: vi.fn().mockImplementation(() => ({ extend: vi.fn() }))
			}
		} as unknown as typeof google;

		$effect.root(() => {
			const store = new MapPageStore();

			store.mapSelectedTrackers = {
				1: createTrackerMock({ id: 1, imei: '1' }),
				2: createTrackerMock({ id: 2, imei: '2' }),
				3: createTrackerMock({ id: 3, imei: '3' })
			};

			store.trackerPositionCache = {
				1: { lat: -32.523481, lng: 85.314356, timestamp: '2025-01-19T14:23:11.185Z' },
				2: { lat: -33.523481, lng: 86.314356, timestamp: '2025-02-19T14:23:11.185Z' },
				3: { lat: -34.523481, lng: 87.314356, timestamp: '2025-03-19T14:23:11.185Z' }
			};

			const bounds = store.getTrackersMapBounds();

			expect(google.maps.LatLngBounds).toHaveBeenCalledTimes(1);

			expect(bounds.extend).toHaveBeenCalledTimes(Object.keys(store.trackerPositionCache).length);

			expect(bounds.extend).toHaveBeenNthCalledWith(1, store.trackerPositionCache[1]);
			expect(bounds.extend).toHaveBeenNthCalledWith(2, store.trackerPositionCache[2]);
			expect(bounds.extend).toHaveBeenNthCalledWith(3, store.trackerPositionCache[3]);
		});
	});
});
