import type { Tracker } from '$lib/api/tracker.schema';
import { loadFromLocalStorage, setLocalStorage } from '$lib/utils/local-storage';
import type { SocketIoClient, TrackerAndPosition } from '../../routes/client/rastreamento/mapa/map';
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

/**
 * The "View" of the map page
 *
 * - tracker history shows the location history of a specific tracker
 * - real time shows multiple trackers on the map and updates their positions in real time
 */
export type mapView = 'tracker-history' | 'real-time';

type GoogleMap = InstanceType<typeof window.google.maps.Map>;

/**
 * overlay to show on the map page
 */
type realtimeMapViewOverlay = 'select-tracker' | 'selected-tracker-list' | 'show-tracker';

interface RealTimeMapViewState {
	/**
	 * Overlay being displayed
	 */
	overlay: realtimeMapViewOverlay | null;

	/**
	 * The trackers selected and thus being show on the map
	 */
	selectedTrackers: TrackerSelection;

	/**
	 * Tracker to display on the selected tracker overlay
	 */
	trackerToDisplay: TrackerAndPosition | null;

	/**
	 * Cache of trackers last positions by their ID
	 */
	trackerPositionCache: TrackerIdToLastPosition;

	/**
	 * SocketIO connection used to recieve positions
	 */
	socket: SocketIoClient | null;

	/**
	 * If SocketIO is connecting or reconnecting to the server
	 */
	isConnecting: boolean;

	/**
	 * if the initial connection has failed and a warning
	 * should be displayed
	 */
	showConnectionErrorAlert: boolean;
}

export class MapPageStore {
	/**
	 * The HTML div bound to the google map instance
	 */
	mapElement = $state<HTMLDivElement>();

	/**
	 * Google map instance
	 */
	mapInstance = $state<GoogleMap>();

	/**
	 * The "View" to display on the map
	 */
	mapView = $state<mapView>('real-time');

	/**
	 * State specific to the map real time view
	 */
	realTimeMapViewState = $state<RealTimeMapViewState>({
		socket: null,
		overlay: null,
		selectedTrackers: {},
		trackerToDisplay: null,
		trackerPositionCache: {},
		isConnecting: true,
		showConnectionErrorAlert: false
	});

	constructor() {
		this.realTimeMapViewState.trackerPositionCache = loadFromLocalStorage(
			TRACKER_POSITION_CACHE_LS_KEY,
			{}
		);

		this.realTimeMapViewState.selectedTrackers = loadFromLocalStorage(
			MAP_SELECTED_TRACKERS_LS_KEY,
			{}
		);

		$effect(() => {
			setLocalStorage(
				TRACKER_POSITION_CACHE_LS_KEY,
				this.realTimeMapViewState.trackerPositionCache
			);

			setLocalStorage(MAP_SELECTED_TRACKERS_LS_KEY, this.realTimeMapViewState.selectedTrackers);
		});
	}

	/**
	 * TODO: this method should not be specific to a view
	 *
	 * creates a LatLngBounds that fits all the selected trackers
	 * that have positions to be show on the map
	 *
	 * @important
	 * the bounds might be empty if there are no trackers selected
	 * or all of them do not have cached positions.
	 */
	getTrackersMapBounds(): google.maps.LatLngBounds {
		const bounds = new google.maps.LatLngBounds();

		Object.values(this.realTimeMapViewState.selectedTrackers).forEach((selectedTracker) => {
			const position = this.realTimeMapViewState.trackerPositionCache[selectedTracker.id];
			if (position) bounds.extend(position);
		});

		return bounds;
	}

	showRealtimeViewSelectedTrackerOverlay(tracker: Tracker, position: Position) {
		this.realTimeMapViewState.overlay = 'show-tracker';
		this.realTimeMapViewState.trackerToDisplay = { tracker, position };
	}
}
