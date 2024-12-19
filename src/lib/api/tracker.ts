import { route } from '$lib/ROUTES';
import { z } from 'zod';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simCardSchema } from './sim-card.schema';
import {
	trackerLocationSchema,
	trackerSchema,
	type DeleteTrackerBody,
	type GetTrackerLocationsFilters,
	type GetTrackersFilters,
	type Tracker,
	type TrackerLocation
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
}): Promise<string> => {
	const url = route('PUT /client/tracking/trackers/[tracker_id=integer]', {
		tracker_id: ids.vehicleTrackerId.toString()
	});

	return api.put({ vehicleId: ids.vehicleId }, url).json<string>();
};

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
export const apiGetTrackerLastLocation = (id: number) => {
	const url = route('GET /client/tracking/trackers/[tracker_id=integer]/last-location', {
		tracker_id: id.toString()
	});

	return api.get(url).json<TrackerLocation | null>().then(trackerLocationSchema.nullable().parse);
};

/**
 * get a list of tracker locations after a start date and a limit
 */
export const apiGetTrackerLocations = async (id: number, filters?: GetTrackerLocationsFilters) => {
	const url = route('GET /client/tracking/trackers/[tracker_id=integer]/locations', {
		tracker_id: id.toString()
	});

	const data = await api
		.query(stripUndefined({ ...filters }))
		.get(url)
		.json<TrackerLocation>();

	return z.array(trackerLocationSchema).parse(data);
};
