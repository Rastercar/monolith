import { createVehicleTrackerLocation } from '$lib/server/db/repo/vehicle-tracker-location';
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

	await createVehicleTrackerLocation({
		// TODO:
		time: '',
		vehicleTrackerId,
		point: [position.lng, position.lat]
	});

	// TODO: send this to socket somehow (how do i get the socket instance ???)

	// 	let parse_result: Result<shared::dto::decoder::h02::LocationMsg, serde_json::Error> =
	// 	serde_json::from_slice(delivery.data.as_slice());

	// match parse_result {
	// 	Ok(decoded) => {
	// 		let position = PositionDto {
	// 			lat: decoded.lat,
	// 			lng: decoded.lng,
	// 			timestamp: decoded.timestamp,
	// 			tracker_id,
	// 		};

	// 		let _ = socket
	// 			.of("/tracking")
	// 			.expect("/tracking socket io namespace not available")
	// 			.within(tracker_id.to_string())
	// 			.emit("position", position);
	// 	}
	// 	Err(e) => {
	// 		error!("failed to parse H02 location: {e}");
	// 	}
	// }
}
