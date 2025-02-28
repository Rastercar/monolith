import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../global';
import { TRACKER_SUBSCRIPTION_PER_USER_LIMIT } from '../../constants/socket-io';
import { filterVehicleTrackerIdsByAssertingBelongsToOrg } from '../db/repo/vehicle-tracker';
import type { SocketIoSession } from '../socketio';

/**
 * handles the 'changeTrackersToListen' event by checking the valid ids and
 * joining rooms for each valid tracker so when a position of a tracker is recieved
 * on the backend and its sent to the room with the tracker ID, the socket will recieve
 * that position as well
 */
export async function handleChangeTrackersToListenEvent(
	trackerIds: number[],
	socket: Socket<ClientToServerEvents, ServerToClientEvents>,
	session: SocketIoSession
) {
	if (trackerIds.length > TRACKER_SUBSCRIPTION_PER_USER_LIMIT) {
		socket.emit(
			'error',
			`não é possível escutar mais de ${TRACKER_SUBSCRIPTION_PER_USER_LIMIT} rastreadores`
		);
		return;
	}

	const validIds = session.organizationId
		? await filterVehicleTrackerIdsByAssertingBelongsToOrg(trackerIds, session.organizationId)
		: [];

	const invalidIds = trackerIds.filter((id) => validIds.indexOf(id) === -1);

	if (invalidIds.length > 0) {
		socket.emit('error', `não é permitido escutar aos rastreadores: ${invalidIds.join(',')}`);
	}

	socket.rooms.forEach((room) => {
		socket.leave(room);
	});

	socket.join(validIds.map((id) => id.toString()));
}
