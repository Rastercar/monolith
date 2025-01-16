export interface ServerToClientEvents {
	error: (message: string) => void;
	position: (_position: H02TrackerPosition & { trackerId: number }) => void;
}

export interface ClientToServerEvents {
	changeTrackersToListen: (_trackerIds: number[]) => void;
}

export type SocketIoServer = import('socket.io').Server<
	ClientToServerEvents,
	ServerToClientEvents,
	{},
	any
>;

declare global {
	/**
	 * Server side global variable of the socket io Server instance
	 *
	 * this is set after the server is initialized
	 */
	var io: SocketIoServer | undefined;
}

export {};
