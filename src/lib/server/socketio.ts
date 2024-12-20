import { Server } from 'socket.io';
import { SOCKET_IO_TRACKING_NAMESPACE } from '../constants/socket-io';

/**
 * Configures a socket io server with the needed callbacks for application logic
 *
 */
// TODO: configure me to prod
export function configureSocketIoServer(io: Server) {
	io.of(SOCKET_IO_TRACKING_NAMESPACE).on('connection', (socket) => {
		// TODO:
		socket.emit('position', {
			trackerId: 1,
			lat: -20.0,
			lng: -54.0,
			timestamp: new Date().toISOString()
		});
	});
}
