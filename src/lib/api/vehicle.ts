import { createPaginatedResponseSchema, type Paginated, type PaginationParameters } from './common';
import { rastercarApi, stripUndefined } from './utils';
import { vehicleSchema, type CreateVehicleBody, type Vehicle } from './vehicle.schema';

/**
 * creates a new vehicle
 *
 * ### required permissions
 *
 * - `CREATE_VEHICLE`
 */
export const apiCreateVehicle = (body: CreateVehicleBody): Promise<Vehicle> =>
	rastercarApi.formData(body).post(undefined, '/vehicle').json<Vehicle>().then(vehicleSchema.parse);

/**
 * list paginated vehicles that belong to the same organization as the request user
 */
export const apiGetVehicles = (query?: PaginationParameters): Promise<Paginated<Vehicle>> =>
	rastercarApi
		.query(stripUndefined({ ...query }))
		.get('/vehicle')
		.json<Paginated<Vehicle>>()
		.then(createPaginatedResponseSchema(vehicleSchema).parse);
