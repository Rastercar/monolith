import { SOCKET_IO_TRACKING_NAMESPACE } from '$lib/constants/socket-io';
import { createVehicleTrackerLocation } from '$lib/server/db/repo/vehicle-tracker-location';
import { getSocketIoInstance } from '$lib/server/socketio';
import { readBufferAsUtf8JsonOfSchema } from '$lib/utils/buffer';
import consola from 'consola';
import { z } from 'zod';

const h02TrackerPositionSchema = z.object({
	// latitude (90 to -90) in decimal degrees
	lat: z.number().gte(-90).lte(90),

	// longitude (90 to -90) in decimal degrees
	lng: z.number().gte(-180).lte(180),

	// speed in km/h
	speed: z.number(),

	// direction in degrees (0 degrees = north, 180 = s)
	direction: z.number(),

	// vehicle date and time sent by the tracker
	timestamp: z.string().datetime(),

	// info about vehicle / tracker status
	status: z.object({
		acc: z.boolean(),
		analog_quantity_transfinit_alarm: z.boolean(),
		custom_alarm: z.boolean(),
		door_open: z.boolean(),
		engine: z.boolean(),
		gprs_occlusion_alarm: z.boolean(),
		gps_antenna_open_circuit_alarm: z.boolean(),
		gps_antenna_short_circuit_alarm: z.boolean(),
		gps_receiver_fault_alarm: z.boolean(),
		high_level_sensor1: z.boolean(),
		high_level_sensor2: z.boolean(),
		host_powered_by_backup_battery: z.boolean(),
		illegal_ignition_alarm: z.boolean(),
		low_level_sensor1_bond_strap: z.boolean(),
		low_level_sensor2_bond_strap: z.boolean(),
		no_entry_cross_border_alarm_in: z.boolean(),
		no_entry_cross_border_alarm_out: z.boolean(),
		oil_and_engine_cut_off: z.boolean(),
		open_circuit_for_gps_antenna: z.boolean(),
		overspeed: z.boolean(),
		overspeed_alarm: z.boolean(),
		roberry_alarm: z.boolean(),
		short_circuit_for_gps_antenna: z.boolean(),
		sos_alarm: z.boolean(),
		storage_battery_removal_state: z.boolean(),
		storage_battery_removed: z.boolean(),
		temperature_alarm: z.boolean(),
		theft_alarm: z.boolean(),
		three_times_pass_error_alarm: z.boolean(),
		vehicle_fortified: z.boolean()
	})
});

type H02TrackerPosition = z.infer<typeof h02TrackerPositionSchema>;

export async function handleH02TrackerPosition(vehicleTrackerId: number, data: Buffer) {
	let position: H02TrackerPosition;

	try {
		// TODO: as vezes isso falha no parse the timestamp, com invalid datetime
		position = readBufferAsUtf8JsonOfSchema(data, h02TrackerPositionSchema);
	} catch (error) {
		// TODO: remove log !?
		JSON.parse(data.toString('utf8'));
		consola.error(error);
		return;
	}

	await createVehicleTrackerLocation({
		vehicleTrackerId,
		time: position.timestamp,
		point: [position.lng, position.lat]
	});

	const io = getSocketIoInstance();
	if (!io) {
		consola.warn('failed to get SocketIO instance to send postions to');
		return;
	}

	// send the location to the vehicle tracker room (room name is the tracker id)
	io.of(SOCKET_IO_TRACKING_NAMESPACE)
		.to(vehicleTrackerId.toString())
		.emit('position', { ...position, trackerId: vehicleTrackerId });
}
