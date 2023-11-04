import { rastercarApi } from './utils';
import type { CreateVehicleBody } from './vehicle.schema';

/**
 * creates a new vehicle
 *
 * ### required permissions
 *
 * - `CREATE_VEHICLE`
 */
// TODO: return created vehicle
// .then(vehicleSchema.parse);
export const apiCreateVehicle = async (body: CreateVehicleBody, photo?: File): Promise<string> => {
	// TODO: send photo
	return rastercarApi.post(body, '/vehicle').json<string>();
};
