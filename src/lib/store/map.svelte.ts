import type { Tracker } from '$lib/api/tracker.schema';
import { loadFromLocalStorage, setLocalStorage } from '$lib/utils/local-storage';
import { getContext, setContext } from 'svelte';
import { MAP_CONTEXT_KEY, MAP_SELECTED_TRACKERS_KEY, TRACKER_POSITION_CACHE_KEY } from './keys';

export interface Position {
	lat: number;
	lng: number;
	timestamp: string;
}

/**
 * the trackers that should be shown on the map
 *
 * key: tracker ID
 * val: the tracker itself
 */
export type TrackerSelection = Record<number, Tracker>;

/**
 * key: tracker ID
 * val: tracker last position
 */
type TrackerIdToLastPosition = Record<number, Position>;

type GoogleMap = InstanceType<typeof window.google.maps.Map>;

class MapPageStore {
	mapElement = $state<HTMLDivElement>();
	mapInstance = $state<GoogleMap>();

	mapSelectedTrackers = $state<TrackerSelection>({});
	trackerPositionCache = $state<TrackerIdToLastPosition>({});

	constructor() {
		this.mapSelectedTrackers = loadFromLocalStorage(MAP_SELECTED_TRACKERS_KEY, {});
		this.trackerPositionCache = loadFromLocalStorage(TRACKER_POSITION_CACHE_KEY, {});

		$effect(() => {
			setLocalStorage(MAP_SELECTED_TRACKERS_KEY, this.mapSelectedTrackers);
			setLocalStorage(TRACKER_POSITION_CACHE_KEY, this.trackerPositionCache);
		});
	}

	getGoogleMap() {
		return this.mapInstance;
	}

	getMapElement() {
		return this.mapElement;
	}

	/**
	 * creates a LatLngBounds that fits all the selected trackers
	 * that have positions to be show on the map
	 *
	 * @important
	 * the bounds might be empty if there are no trackers selected
	 * or all of them do not have cached positions.
	 */
	getTrackersMapBounds(): google.maps.LatLngBounds {
		const bounds = new google.maps.LatLngBounds();

		Object.values(this.mapSelectedTrackers).forEach((selectedTracker) => {
			const position = this.trackerPositionCache[selectedTracker.id];
			if (position) bounds.extend(position);
		});

		return bounds;
	}
}

/**
 * gets the appropriate context for components under the `Map` page
 */
export const getMapContext = () => getContext<ReturnType<typeof setMapContext>>(MAP_CONTEXT_KEY);

export const setMapContext = () => setContext(MAP_CONTEXT_KEY, new MapPageStore());
