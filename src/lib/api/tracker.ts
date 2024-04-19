import { z } from 'zod';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simCardSchema, trackerLocationSchema, type TrackerLocation } from './sim-card.schema';
import {
	trackerSchema,
	type CreateTrackerBody,
	type Tracker,
	type UpdateTrackerBody
} from './tracker.schema';
import { rastercarApi, stripUndefined } from './utils';

export interface GetTrackersFilters {
	imei?: string;
	withAssociatedVehicle?: boolean;
}

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

/**
 * Delete a tracker by id
 *
 * ### required permissions
 *
 * - `DELETE_TRACKER`
 */
export const apiDeleteTracker = (
	vehicleTrackerId: number,
	opts?: { deleteAssociatedSimCards: boolean }
) =>
	rastercarApi
		.query({ deleteAssociatedSimCards: opts?.deleteAssociatedSimCards || false })
		.delete(`/tracker/${vehicleTrackerId}`)
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
	vehicleTrackerId: number;
}): Promise<string> =>
	rastercarApi
		.put({ vehicleId: ids.vehicleId }, `/tracker/${ids.vehicleTrackerId}/vehicle`)
		.json<string>();

/**
 * get SIM cards that belong to a tracker
 */
export const apiGetTrackerSimCards = (vehicleTrackerId: number) =>
	rastercarApi
		.get(`/tracker/${vehicleTrackerId}/sim-cards`)
		.json<Tracker[]>()
		.then(z.array(simCardSchema).parse);

/**
 * get the last known tracker location
 */
export const apiGetTrackerLastLocation = (vehicleTrackerId: number) =>
	rastercarApi
		.get(`/tracker/${vehicleTrackerId}/last-location`)
		.json<Tracker[]>()
		.then(trackerLocationSchema.nullable().parse);

export interface GetTrackerLocationsDto {
	/**
	 * query positions that appear only after a timestamp
	 */
	after?: string;

	/**
	 * query positions that abear only before a timestamp
	 */
	before?: string;

	/**
	 * the amount of positions to be fetched
	 */
	limit?: number;
}

/**
 * get a list of tracker locations after a start date and a limit
 */
export const apiGetTrackerLocations = (id: number, filters?: GetTrackerLocationsDto) =>
	rastercarApi
		.post(filters ?? {}, `/tracker/${id}/get-location-list`)
		.json<TrackerLocation>()
		.then(z.array(trackerLocationSchema).parse);
