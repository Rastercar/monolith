import { rastercarApi } from './utils';
import { vehicleSchema, type CreateVehicleBody, type Vehicle } from './vehicle.schema';

/**
 * creates a new vehicle
 *
 * ### required permissions
 *
 * - `CREATE_VEHICLE`
 */
export const apiCreateVehicle = async (body: CreateVehicleBody): Promise<unknown> =>
	rastercarApi.formData(body).post(undefined, '/vehicle').json<Vehicle>().then(vehicleSchema.parse);
