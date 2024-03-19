import { PUBLIC_RASTERCAR_API_BASE_URL } from '$env/static/public';
import type { Tracker } from '$lib/api/tracker.schema';
import { Socket, io } from 'socket.io-client';
import { getContext } from 'svelte';
import { writable } from 'svelte/store';

export interface MapContext {
	getGoogleMap: () => InstanceType<typeof window.google.maps.Map>;
	getMapElement: () => HTMLDivElement;
}

interface MapState {
	/**
	 * the trackers that should be shown on the map
	 *
	 * key: tracker ID
	 * val: the tracker itself
	 */
	selectedTrackers: Record<number, Tracker>;
}

/**
 * events recieved by the rastercar api
 */
interface ServerToClientEvents {
	/**
	 * uma nova posição do rastreador foi recebida
	 */
	position: (_data: { trackerId: number; lat: number; lng: number }) => void;
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
 * state of the main `Map` page
 */
export const mapStore = writable<MapState>({ selectedTrackers: {} });

export const MAP_CONTEXT_KEY = 'MAP_CONTEXT_KEY';

/**
 * gets the appropriate context for components under the `Map` page
 */
export const getMapContext = () => getContext<MapContext>(MAP_CONTEXT_KEY);
