import type { Tracker } from '$lib/api/tracker.schema';
import type { TrackerPosition } from '$lib/api/tracking.schema';
import type { Position } from '$lib/store/map.svelte';
import { type Socket, io } from 'socket.io-client';
import type { ClientToServerEvents } from '../../../../global';

export type SocketIoClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export type TrackerAndPosition = { tracker: Tracker; position?: Position };

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
 * creates a SocketIO connection to the rastercar API under the tracking namspace
 */
export const createWsConnectionToTrackingNamespace = (url: string): SocketIoClient => {
	return io(url, { reconnectionDelayMax: 10_000 });
};
