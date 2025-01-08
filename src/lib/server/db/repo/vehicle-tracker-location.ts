import { db } from '../db';
import { vehicleTrackerLocation } from '../schema';

interface VehicleTrackerLocation {
	time: string;
	vehicleTrackerId: number;

	// x (lng), y (lat)
	point: [number, number];
}

export async function createVehicleTrackerLocation(location: VehicleTrackerLocation) {
	const [createdVehicle] = await db.insert(vehicleTrackerLocation).values(location).returning();

	return createdVehicle;
}
