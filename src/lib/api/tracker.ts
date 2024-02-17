import { z } from 'zod';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simCardSchema, trackerLocationSchema } from './sim-card.schema';
import {
	trackerSchema,
	type CreateTrackerBody,
	type Tracker,
	type UpdateTrackerBody
} from './tracker.schema';
import { rastercarApi, stripUndefined } from './utils';

/**
 * creates a new tracker
 *
 * ### required permissions
 *
 * - `CREATE_TRACKER`
 */
export const apiCreateTracker = (body: CreateTrackerBody): Promise<Tracker> =>
	rastercarApi.post(body, '/tracker').json<Tracker>().then(trackerSchema.parse);

/**
 * list paginated trackers that belong to the same organization as the request user
 */
export const apiGetTrackers = (
	query?: PaginationWithFilters<GetTrackersFilters>
): Promise<Paginated<Tracker>> =>
	rastercarApi
		.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
		.get('/tracker')
		.json<Paginated<Tracker>>()
		.then(createPaginatedResponseSchema(trackerSchema).parse);

/**
 * update a tracker
 *
 * ### required permissions
 *
 * - `UPDATE_TRACKER`
 */
export const apiUpdateTracker = (id: number, body: UpdateTrackerBody): Promise<Tracker> =>
	rastercarApi.put(body, `/tracker/${id}`).json<Tracker>().then(trackerSchema.parse);

/**
 * Fetch a tracker by ID
 */
export const apiGetTrackerById = (id: number): Promise<Tracker> =>
	rastercarApi.get(`/tracker/${id}`).json<Tracker>().then(trackerSchema.parse);

export interface GetTrackersFilters {
	imei?: string;
	withAssociatedVehicle?: boolean;
}

/**
 * Delete a tracker by id
 *
 * ### required permissions
 *
 * - `DELETE_TRACKER`
 */
export const apiDeleteTracker = (trackerId: number, opts?: { deleteAssociatedSimCards: boolean }) =>
	rastercarApi
		.query({ deleteAssociatedSimCards: opts?.deleteAssociatedSimCards || false })
		.delete(`/tracker/${trackerId}`)
		.json<string>();

/**
 * changes the vehicle a tracker is associated (aka: suposedly installed)
 *
 * ### required permissions
 *
 * - `UPDATE_TRACKER`
 */
export const apiSetTrackerVehicle = (ids: {
	vehicleId: number | null;
	trackerId: number;
}): Promise<string> =>
	rastercarApi
		.put({ vehicleId: ids.vehicleId }, `/tracker/${ids.trackerId}/vehicle`)
		.json<string>();

/**
 * get SIM cards that belong to a tracker
 */
export const apiGetTrackerSimCards = (trackerId: number) =>
	rastercarApi
		.get(`/tracker/${trackerId}/sim-cards`)
		.json<Tracker[]>()
		.then(z.array(simCardSchema).parse);

/**
 * get the last known tracker location
 */
export const apiGetTrackerLastLocation = (trackerId: number) =>
	rastercarApi
		.get(`/tracker/${trackerId}/location`)
		.json<Tracker[]>()
		.then(trackerLocationSchema.nullable().parse);
