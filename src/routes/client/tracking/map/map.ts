import type { TrackerPosition } from '$lib/api/tracking.schema';
import { Socket, io } from 'socket.io-client';

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
 */
export const createWsConnectionToTrackingNamespace = (): Socket<
	ServerToClientEvents,
	ClientToServerEvents
> =>
	// TODO:
	io(`http://localhost:3000/${SOCKET_IO_TRACKING_NAMESPACE}`, { reconnectionDelayMax: 10_000 });
