import { trackerSchema, type CreateTrackerBody, type Tracker } from './tracker.schema';
import { rastercarApi } from './utils';

/**
 * creates a new tracker
 *
 * ### required permissions
 *
 * - `CREATE_TRACKER`
 */
export const apiCreateTracker = async (body: CreateTrackerBody): Promise<Tracker> =>
	rastercarApi.post(body, '/tracker').json<Tracker>().then(trackerSchema.parse);
