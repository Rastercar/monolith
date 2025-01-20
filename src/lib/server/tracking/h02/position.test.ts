import { SOCKET_IO_TRACKING_NAMESPACE } from '$lib/constants/socket-io';
import * as locationRepo from '$lib/server/db/repo/vehicle-tracker-location';
import * as socketIo from '$lib/server/socketio';
import { describe, expect, test, vi } from 'vitest';
import type { SocketIoServer } from '../../../../global';
import { handleH02TrackerPosition } from './position';

vi.mock('$lib/server/db/repo/vehicle-tracker-location');
vi.mock('$lib/server/socketio');

const locationRepoMock = vi.mocked(locationRepo);
const socketIoMock = vi.mocked(socketIo);

describe('handleH02TrackerPosition', () => {
	const trackerId = 1;

	const trackerPositionMock = {
		lat: 37.7749,
		lng: -122.4194,
		speed: 50,
		direction: 90,
		timestamp: '2025-01-20T12:34:56Z',
		status: {
			acc: true,
			analog_quantity_transfinit_alarm: false,
			custom_alarm: false,
			door_open: false,
			engine: true,
			gprs_occlusion_alarm: false,
			gps_antenna_open_circuit_alarm: false,
			gps_antenna_short_circuit_alarm: false,
			gps_receiver_fault_alarm: false,
			high_level_sensor1: false,
			high_level_sensor2: false,
			host_powered_by_backup_battery: false,
			illegal_ignition_alarm: false,
			low_level_sensor1_bond_strap: false,
			low_level_sensor2_bond_strap: false,
			no_entry_cross_border_alarm_in: false,
			no_entry_cross_border_alarm_out: false,
			oil_and_engine_cut_off: false,
			open_circuit_for_gps_antenna: false,
			overspeed: false,
			overspeed_alarm: false,
			roberry_alarm: false,
			short_circuit_for_gps_antenna: false,
			sos_alarm: false,
			storage_battery_removal_state: false,
			storage_battery_removed: false,
			temperature_alarm: false,
			theft_alarm: false,
			three_times_pass_error_alarm: false,
			vehicle_fortified: true
		}
	};

	const validPositionBuffer = Buffer.from(JSON.stringify(trackerPositionMock), 'utf-8');

	test('fails if the buffer is not a JSON of a valid H02 position', async () => {
		await expect(() => handleH02TrackerPosition(trackerId, Buffer.from('a'))).rejects.toThrow();
	});

	test('saves the position on the database', async () => {
		await handleH02TrackerPosition(trackerId, validPositionBuffer);

		expect(locationRepoMock.createVehicleTrackerLocation).toHaveBeenLastCalledWith({
			vehicleTrackerId: trackerId,
			time: trackerPositionMock.timestamp,
			point: [trackerPositionMock.lng, trackerPositionMock.lat]
		});
	});

	test('sends the position with the tracker ID to the socket io tracking namespace with the room of the tracker id', async () => {
		const ofM = vi.fn(() => ({ to: toM }));
		const toM = vi.fn(() => ({ emit: emitM }));
		const emitM = vi.fn();

		const socketMock = { of: ofM };

		socketIoMock.getSocketIoInstance.mockImplementation(() => {
			return socketMock as unknown as SocketIoServer;
		});

		await handleH02TrackerPosition(trackerId, validPositionBuffer);

		expect(ofM).toHaveBeenLastCalledWith(SOCKET_IO_TRACKING_NAMESPACE);

		expect(toM).toHaveBeenLastCalledWith(trackerId.toString());

		expect(emitM).toHaveBeenLastCalledWith('position', {
			...trackerPositionMock,
			trackerId
		});
	});
});
