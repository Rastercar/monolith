import { SOCKET_IO_TRACKING_NAMESPACE } from '$lib/constants/socket-io';
import { getSocketIoInstance } from '$lib/server/socketio';
import { z } from 'zod';

export const h02TrackerPositionSchema = z.object({
	// latitude (90 to -90) in decimal degrees
	lat: z.number().gte(-90).lte(90),

	// longitude (90 to -90) in decimal degrees
	lng: z.number().gte(-180).lte(180),

	// speed in km/h
	speed: z.number(),

	// direction in degrees (0 degrees = north, 180 = s)
	direction: z.number()

	// TODO:
	// vehicle date and time sent by the tracker
	// pub timestamp: DateTime<Utc>,

	// info about vehicle / tracker status
	// pub status: Status,
});

// TODO: handle tracker location, sending it to interested sockets and inserting it on the db
export async function handleH02TrackerPosition(vehicleTrackerId: number, data: Buffer) {
	// TODO: handle possible errors
	const json = JSON.parse(data.toString('utf8'));

	// TODO: handle possible errors
	const position = h02TrackerPositionSchema.parse(json);

	// await createVehicleTrackerLocation({
	// 	// TODO:
	// 	time: '',
	// 	vehicleTrackerId,
	// 	point: [position.lng, position.lat]
	// });

	// TODO: send this to socket somehow (how do i get the socket instance ???)

	// TODO: Problem, when running in development mode, the SocketIO instance is created
	// on the vite websocket plugin (see vite.config.ts), but we cannot set global values
	// of other modules there since the modules get re-evaluated after the plugin runs
	// and so the global value (SocketIo instance) would be reset
	const io = getSocketIoInstance();
	if (!io) return;

	// send the location to the vehicle tracker room (room name is the tracker id)
	// TODO: TS type the emmited event
	io.of(SOCKET_IO_TRACKING_NAMESPACE).to(vehicleTrackerId.toString()).emit('position', position);
}
