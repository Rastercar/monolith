import { z } from 'zod';
import { positionSchema, type TrackerPosition } from './tracking.schema';
import { rastercarApi } from './utils';

/**
 * gets the lastest position of a few trackers
 */
export const apiGetTrackersLastPositions = (trackerIds: number[]): Promise<TrackerPosition[]> =>
	rastercarApi
		.post({ ids: trackerIds }, '/tracking/last-positions')
		.json<TrackerPosition[]>()
		.then((a) => z.array(positionSchema).parse(a));
