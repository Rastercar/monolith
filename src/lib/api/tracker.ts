import { z } from 'zod';
import {
	createPaginatedResponseSchema,
	type Paginated,
	type PaginationWithFilters
} from './common';
import { simCardSchema } from './sim-card.schema';
import { trackerSchema, type CreateTrackerBody, type Tracker } from './tracker.schema';
import { rastercarApi, stripUndefined } from './utils';

/**
 * creates a new tracker
 *
 * ### required permissions
 *
 * - `CREATE_TRACKER`
 */
export const apiCreateTracker = async (body: CreateTrackerBody): Promise<Tracker> =>
	rastercarApi.post(body, '/tracker').json<Tracker>().then(trackerSchema.parse);

export interface GetTrackersFilters {
	imei?: string;
	withAssociatedVehicle?: boolean;
}

/**
 * list paginated trackers that belong to the same organization as the request user
 */
export const apiGetTrackers = async (
	query?: PaginationWithFilters<GetTrackersFilters>
): Promise<Paginated<Tracker>> =>
	rastercarApi
		.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
		.get('/tracker')
		.json<Paginated<Tracker>>()
		.then(createPaginatedResponseSchema(trackerSchema).parse);

/**
 * changes the vehicle a tracker is associated (aka: suposedly installed)
 */
export const apiSetTrackerVehicle = async (ids: {
	vehicleId: number;
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
