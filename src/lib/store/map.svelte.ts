import type { Tracker } from '$lib/api/tracker.schema';
import { loadFromLocalStorage, setLocalStorage } from '$lib/utils/local-storage';
import { MAP_SELECTED_TRACKERS_LS_KEY, TRACKER_POSITION_CACHE_LS_KEY } from './keys';

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
export type TrackerIdToLastPosition = Record<number, Position>;

type GoogleMap = InstanceType<typeof window.google.maps.Map>;

export class MapPageStore {
	mapElement = $state<HTMLDivElement>();
	mapInstance = $state<GoogleMap>();

	mapSelectedTrackers = $state<TrackerSelection>({});
	trackerPositionCache = $state<TrackerIdToLastPosition>({});

	constructor() {
		this.mapSelectedTrackers = loadFromLocalStorage(MAP_SELECTED_TRACKERS_LS_KEY, {});
		this.trackerPositionCache = loadFromLocalStorage(TRACKER_POSITION_CACHE_LS_KEY, {});

		$effect(() => {
			setLocalStorage(MAP_SELECTED_TRACKERS_LS_KEY, this.mapSelectedTrackers);
			setLocalStorage(TRACKER_POSITION_CACHE_LS_KEY, this.trackerPositionCache);
		});
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
