import type { TrackerPosition } from '$lib/api/tracking.schema';
import { type Socket, io } from 'socket.io-client';

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
 * creates a SocketIO connection to the rastercar API under the tracking namspace
 */
export const createWsConnectionToTrackingNamespace = (): Socket<
	ServerToClientEvents,
	ClientToServerEvents
> => {
	// TODO: on prod connect to 3000 on dev connect to 5173
	return io(`http://localhost:5173/tracking`, { reconnectionDelayMax: 10_000 });
};
