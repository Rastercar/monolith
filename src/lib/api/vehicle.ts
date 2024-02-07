import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { rastercarApi, stripUndefined } from './utils';
import {
	vehicleSchema,
	type CreateVehicleBody,
	type UpdateVehicleBody,
	type Vehicle
} from './vehicle.schema';

/**
 * creates a new vehicle
 *
 * ### required permissions
 *
 * - `CREATE_VEHICLE`
 */
export const apiCreateVehicle = (body: CreateVehicleBody): Promise<Vehicle> =>
	rastercarApi.formData(body).post(undefined, '/vehicle').json<Vehicle>().then(vehicleSchema.parse);

export interface GetVehiclesFilters {
	plate?: string;
}

/**
 * list paginated vehicles that belong to the same organization as the request user
 */
export const apiGetVehicles = (
	query?: PaginationWithFilters<GetVehiclesFilters>
): Promise<Paginated<Vehicle>> =>
	rastercarApi
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get('/vehicle')
		.json<Paginated<Vehicle>>()
		.then(createPaginatedResponseSchema(vehicleSchema).parse);

export const apiGetVehicleById = (id: number): Promise<Vehicle> =>
	rastercarApi.get(`/vehicle/${id}`).json<Vehicle>().then(vehicleSchema.parse);

/**
 * Updates a vehicle
 */
export const apiUpdateVehicle = (id: number, body: UpdateVehicleBody): Promise<Vehicle> =>
	rastercarApi.put(body, `/vehicle/${id}`).json<Vehicle>().then(vehicleSchema.parse);
