import type { Paginated, PaginationWithFilters } from './common';
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
): Promise<Paginated<Tracker>> => {
	return (
		rastercarApi
			.query(stripUndefined({ ...query?.filters, ...query?.pagination }))
			.get('/tracker')
			// TODO: parse generic schema ?
			.json<Paginated<Tracker>>()
	);
};
