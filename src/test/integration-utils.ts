import { Socket as ClientSocket } from 'socket.io-client';

/**
 * waits until a event is recieved by a socket io client
 */
export function waitFor(emitter: ClientSocket, event: string) {
	return new Promise<any>((resolve) => {
		emitter.once(event, resolve);
	});
}
