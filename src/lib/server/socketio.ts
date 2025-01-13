import { type Server } from 'socket.io';
import { SOCKET_IO_TRACKING_NAMESPACE } from '../constants/socket-io';

/**
 * If the socket IO instance has been configured with event callbacks
 */
let hasConfiguredSocketIoServer = false;

export function setSocketIoInstance(io: Server) {
	globalThis.io = io;
}

export function getSocketIoInstance(): (typeof globalThis)['io'] | null {
	return globalThis.io ?? null;
}

export function ensureSocketIoServerIsConfigured() {
	const io = getSocketIoInstance();

	if (io && !hasConfiguredSocketIoServer) {
		hasConfiguredSocketIoServer = true;
		configureSocketIoServer(io);
	}
}

/**
 * Configures a socket io server with the needed callbacks for application logic
 */
function configureSocketIoServer(io: Server) {
	io.of(SOCKET_IO_TRACKING_NAMESPACE).on('connection', (socket) => {
		// TODO: here we should create the callbacks for the app logic
		// also, remove this log
		console.log('connected to socket io');
	});
}
