import { route } from '$lib/ROUTES';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { trackerSchema, type Tracker } from './tracker.schema';
import { api, stripUndefined } from './utils';
import {
	vehicleSchema,
	type CreateVehicleBody,
	type GetVehiclesFilters,
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
	api
		// here we strip undefine because when sending objects with a existing key with
		// with a value of undefined it gets parsed to a form data with undefined as a
		// string for the given key
		.formData(stripUndefined({ ...body }))
		.post(undefined, '/vehicle')
		.json<Vehicle>()
		.then(vehicleSchema.parse);

/**
 * list paginated vehicles that belong to the same organization as the request user
 */
export const apiGetVehicles = (
	query?: PaginationWithFilters<GetVehiclesFilters>
): Promise<Paginated<Vehicle>> =>
	api
		.query(stripUndefined({ ...query?.pagination, ...query?.filters }))
		.get(route('/client/tracking/vehicles'))
		.json<Paginated<Vehicle>>()
		.then(createPaginatedResponseSchema(vehicleSchema).parse);

/**
 * Fetch vehicle by ID
 */
export const apiGetVehicleById = (id: number): Promise<Vehicle> =>
	api.get(`/vehicle/${id}`).json<Vehicle>().then(vehicleSchema.parse);

/**
 * Delete vehicle by ID
 */
export const apiDeleteVehicle = (id: number): Promise<string> =>
	api.delete(`/vehicle/${id}`).json<string>();

/**
 * Updates a vehicle
 */
export const apiUpdateVehicle = (id: number, body: UpdateVehicleBody): Promise<Vehicle> =>
	api.put(body, `/vehicle/${id}`).json<Vehicle>().then(vehicleSchema.parse);

/**
 * change a vehicle photo
 */
export const updateVehiclePhoto = (id: number, image: File): Promise<string> =>
	api.formData({ image }).put(undefined, `/vehicle/${id}/photo`).json<string>();

/**
 * delete a vehicle photo
 */
export const removeVehiclePhoto = (id: number): Promise<string> =>
	api.delete(`/vehicle/${id}/photo`).json<string>();

/**
 * Fetch a vehicles tracker, might be NULL if the vehicle does not have a installed tracker
 */
export const apiGetTrackerByVehicleId = (id: number): Promise<Tracker | null> =>
	api
		.get(`/vehicle/${id}/tracker`)
		.json<Tracker | null>()
		.then((v) => (v ? trackerSchema.parse(v) : v));
