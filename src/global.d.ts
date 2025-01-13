interface ServerToClientEvents {
	position: (_position: H02TrackerPosition) => void;
}

export interface ClientToServerEvents {
	changeTrackersToListen: (_trackerIds: number[]) => void;
}

type SocketIoServer = import('socket.io').Server<
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
