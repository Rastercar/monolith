import { route } from '$lib/ROUTES';
import { z } from 'zod';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simCardSchema, trackerLocationSchema, type TrackerLocation } from './sim-card.schema';
import {
	trackerSchema,
	type DeleteTrackerBody,
	type GetTrackersFilters,
	type Tracker
} from './tracker.schema';
import { api, stripUndefined } from './utils';

/**
 * list paginated trackers that belong to the same organization as the request user
 */
export const apiGetTrackers = (
	query?: PaginationWithFilters<GetTrackersFilters>
): Promise<Paginated<Tracker>> =>
	api
		.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
		.get(route('/client/tracking/trackers'))
		.json<Paginated<Tracker>>()
		.then(createPaginatedResponseSchema(trackerSchema).parse);

/**
 * Fetch a tracker by ID
 */
export const apiGetTrackerById = (id: number): Promise<Tracker> =>
	api.get(`/tracker/${id}`).json<Tracker>().then(trackerSchema.parse);

/**
 * Delete a tracker by id
 *
 * ### required permissions
 *
 * - `DELETE_TRACKER`
 */
export const apiDeleteTracker = (trackerId: number, opts?: DeleteTrackerBody) =>
	api
		.json({ deleteAssociatedSimCards: opts?.deleteAssociatedSimCards || false })
		.delete(
			route('DELETE /client/tracking/trackers/[tracker_id=integer]', {
				tracker_id: trackerId.toString()
			})
		)
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
	api.put({ vehicleId: ids.vehicleId }, `/tracker/${ids.vehicleTrackerId}/vehicle`).json<string>();

/**
 * get SIM cards that belong to a tracker
 */
export const apiGetTrackerSimCards = (vehicleTrackerId: number) =>
	api
		.get(`/tracker/${vehicleTrackerId}/sim-cards`)
		.json<Tracker[]>()
		.then(z.array(simCardSchema).parse);

/**
 * get the last known tracker location
 */
export const apiGetTrackerLastLocation = (vehicleTrackerId: number) =>
	api
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
	api
		.post(filters ?? {}, `/tracker/${id}/get-location-list`)
		.json<TrackerLocation>()
		.then(z.array(trackerLocationSchema).parse);
