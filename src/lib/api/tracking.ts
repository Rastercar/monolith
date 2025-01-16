import { route } from '$lib/ROUTES';
import { z } from 'zod';
import { positionSchema, type TrackerPosition } from './tracking.schema';
import { api } from './utils';

/**
 * gets the lastest position of a few trackers
 */
export const apiGetTrackersLastPositions = (trackerIds: number[]): Promise<TrackerPosition[]> =>
	api
		.post({ ids: trackerIds }, route('POST /client/tracking/trackers/positions'))
		.json<TrackerPosition[]>()
		.then((a) => z.array(positionSchema).parse(a));
