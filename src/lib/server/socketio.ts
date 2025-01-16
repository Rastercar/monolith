import type { SocketIoServer } from '../../global';
import { SOCKET_IO_TRACKING_NAMESPACE } from '../constants/socket-io';
import { findUserBySessionToken } from './db/repo/user';
import { handleChangeTrackersToListenEvent } from './tracking/client-to-server-events';

/**
 * If the socket IO instance has been configured with event callbacks
 */
let hasConfiguredSocketIoServer = false;

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

export interface SocketIoSession {
	userId: number;
	organizationId: number | null;
}

/**
 * Configures a socket io server with the needed callbacks for application logic
 */
function configureSocketIoServer(io: SocketIoServer) {
	io.of(SOCKET_IO_TRACKING_NAMESPACE).on('connection', async (socket) => {
		const cookieHeader = socket.handshake.headers.cookie ?? '';

		let [sessionId] = cookieHeader.match(/sid=([a-zA-Z0-9-]+)/) ?? [];
		if (sessionId) sessionId = sessionId.replaceAll('sid=', '');

		if (!sessionId) {
			socket.emit('error', 'session id cookie not found, disconnecting');
			socket.disconnect();
			return;
		}

		const user = await findUserBySessionToken(sessionId);
		if (!user) {
			socket.emit('error', 'didnt find a user with the given session cookie, disconnecting');
			socket.disconnect();
			return;
		}

		const session: SocketIoSession = {
			userId: user.id,
			organizationId: user.organizationId
		};

		socket.on('changeTrackersToListen', (trackerIds) => {
			handleChangeTrackersToListenEvent(trackerIds, socket, session);
		});
	});
}
