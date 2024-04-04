import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import type { Tracker } from '$lib/api/tracker.schema';
import type { TrackerPosition } from '$lib/api/tracking.schema';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { Socket, io } from 'socket.io-client';
import { getContext } from 'svelte';
import { get } from 'svelte/store';

export interface MapContext {
	getGoogleMap: () => InstanceType<typeof google.maps.Map>;
	getMapElement: () => HTMLDivElement;
}

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
type TrackerSelection = Record<number, Tracker>;

/**
 * events recieved by the rastercar api
 */
interface ServerToClientEvents {
	/**
	 * a new position for a tracker has been recieved
	 */
	position: (_position: TrackerPosition) => void;
	/**
	 * some server error has happened, this is mostly
	 * usefull for debugging
	 */
	error: (_err: { error: string }) => void;
}

/**
 * events that can be sent to the rastercar api
 */
interface ClientToServerEvents {
	change_trackers_to_listen: (_ids: number[]) => void;
}

/**
 * the SocketIO namespace for vehicle tracking
 */
export const SOCKET_IO_TRACKING_NAMESPACE = 'tracking';

/**
 * creates a SocketIO connection to the rastercar API under the tracking namspace
 *
 * @param token
 * a JWT to authenticate the user
 */
export const createWsConnectionToTrackingNamespace = (
	token: string
): Socket<ServerToClientEvents, ClientToServerEvents> =>
	io(`${PUBLIC_RASTERCAR_API_BASE_URL}/${SOCKET_IO_TRACKING_NAMESPACE}`, {
		auth: { token },
		reconnectionDelayMax: 10_000
	});

/**
 * IDS of the trackers that are selected to be show on the live
 * tracking map and should recieve real time updates.
 */
export const selectedTrackerStore = localStorageStore<TrackerSelection>(
	'map-selected-trackers',
	{}
);

/**
 * KEY: tracker ID
 * VAL: tracker last position
 */
export const trackerPositionStore = localStorageStore<Record<number, Position>>(
	'tracker-position-cache',
	{}
);

export const MAP_CONTEXT_KEY = 'MAP_CONTEXT_KEY';

/**
 * gets the appropriate context for components under the `Map` page
 */
export const getMapContext = () => getContext<MapContext>(MAP_CONTEXT_KEY);

/**
 * creates a LatLngBounds that fits all the selected trackers
 * that have positions to be show on the map
 *
 * @important
 * the bounds might be empty if there are no trackers selected
 * or all of them do not have cached positions.
 */
export const getTrackersMapBounds = () => {
	const bounds = new google.maps.LatLngBounds();

	const cachedTrackerPositions = get(trackerPositionStore);

	Object.values(get(selectedTrackerStore)).forEach((selectedTracker) => {
		const position = cachedTrackerPositions[selectedTracker.id];
		if (position) bounds.extend(position);
	});

	return bounds;
};
