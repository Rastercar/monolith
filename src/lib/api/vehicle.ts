import { route } from '$lib/ROUTES';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { api, stripUndefined } from './utils';
import { vehicleSchema, type GetVehiclesFilters, type Vehicle } from './vehicle.schema';

export const apiGetVehicle = (id: number): Promise<Vehicle> =>
	api
		.get(route('GET /client/tracking/vehicles/[vehicle_id=integer]', { vehicle_id: id.toString() }))
		.json<Paginated<Vehicle>>()
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
 * Delete vehicle by ID
 */
export const apiDeleteVehicle = (id: number): Promise<string> => {
	const url = route('DELETE /client/tracking/vehicles/[vehicle_id=integer]', {
		vehicle_id: id.toString()
	});

	return api.delete(url).json<string>();
};

/**
 * change a vehicle photo
 */
export const updateVehiclePhoto = (id: number, image: File): Promise<string> => {
	const url = route('PUT /client/tracking/vehicles/[vehicle_id=integer]/photo', {
		vehicle_id: id.toString()
	});

	return api.formData({ image }).put(undefined, url).json<string>();
};

/**
 * delete a vehicle photo
 */
export const removeVehiclePhoto = (id: number): Promise<string> => {
	const url = route('DELETE /client/tracking/vehicles/[vehicle_id=integer]/photo', {
		vehicle_id: id.toString()
	});

	return api.delete(url).json<string>();
};
