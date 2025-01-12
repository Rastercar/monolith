type Io = import('socket.io').Server | undefined;

declare global {
	var io: Io;
}

export {};
