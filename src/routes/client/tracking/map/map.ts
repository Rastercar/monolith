import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import type { Tracker } from '$lib/api/tracker.schema';
import type { TrackerPosition } from '$lib/api/tracking.schema';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { Socket, io } from 'socket.io-client';
import { getContext } from 'svelte';

export interface MapContext {
	getGoogleMap: () => InstanceType<typeof window.google.maps.Map>;
	getMapElement: () => HTMLDivElement;
}

interface LatLng {
	lat: number;
	lng: number;
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
	 * uma nova posição do rastreador foi recebida
	 */
	position: (_position: TrackerPosition) => void;
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

const wsUrl = `${PUBLIC_RASTERCAR_API_BASE_URL}/${SOCKET_IO_TRACKING_NAMESPACE}`;

/**
 * creates a SocketIO connection to the rastercar API under the tracking namspace
 *
 * @param token
 * a JWT to authenticate the user
 */
export const createWsConnectionToTrackingNamespace = (
	token: string
): Socket<ServerToClientEvents, ClientToServerEvents> =>
	io(wsUrl, { auth: { token }, reconnectionDelayMax: 10_000 });

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
export const trackerPositionStore = localStorageStore<Record<number, LatLng>>(
	'tracker-position-cache',
	{}
);

export const MAP_CONTEXT_KEY = 'MAP_CONTEXT_KEY';

/**
 * gets the appropriate context for components under the `Map` page
 */
export const getMapContext = () => getContext<MapContext>(MAP_CONTEXT_KEY);
