import { inArray } from 'drizzle-orm';
import { db } from '../db';
import { vehicleTrackerLastLocation, vehicleTrackerLocation } from '../schema';

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

export async function findMultipleVehicleTrackerLastLocations(ids: number[]) {
	const positions = await db
		.select()
		.from(vehicleTrackerLastLocation)
		.where(inArray(vehicleTrackerLastLocation.vehicleTrackerId, ids));

	return positions;
}
