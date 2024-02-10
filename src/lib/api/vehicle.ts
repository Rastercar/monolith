import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { trackerSchema, type Tracker } from './tracker.schema';
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

/**
 * Fetch a vehicle by ID
 */
export const apiGetVehicleById = (id: number): Promise<Vehicle> =>
	rastercarApi.get(`/vehicle/${id}`).json<Vehicle>().then(vehicleSchema.parse);

/**
 * Updates a vehicle
 */
export const apiUpdateVehicle = (id: number, body: UpdateVehicleBody): Promise<Vehicle> =>
	rastercarApi.put(body, `/vehicle/${id}`).json<Vehicle>().then(vehicleSchema.parse);

/**
 * change a vehicle photo
 */
export const updateVehiclePhoto = (id: number, image: File): Promise<string> =>
	rastercarApi.formData({ image }).put(undefined, `/vehicle/${id}/photo`).json<string>();

/**
 * delete a vehicle photo
 */
export const removeVehiclePhoto = (id: number): Promise<string> =>
	rastercarApi.delete(`/vehicle/${id}/photo`).json<string>();

/**
 * Fetch a vehicles tracker, might be NULL if the vehicle does not have a installed tracker
 */
export const apiGetTrackerByVehicleId = (id: number): Promise<Tracker | null> =>
	rastercarApi
		.get(`/vehicle/${id}/tracker`)
		.json<Tracker | null>()
		.then((v) => (v ? trackerSchema.parse(v) : v));
