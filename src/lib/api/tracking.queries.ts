import { createQuery } from '@tanstack/svelte-query';
import { apiGetTrackersLastPositions } from './tracking';

export function apiGetTrackersLastPositionsQuery(trackerIds: number[]) {
	return createQuery(() => ({
		enabled: trackerIds.length > 0,
		queryKey: ['trackers', trackerIds, 'with-last-location'],
		queryFn: () => apiGetTrackersLastPositions(trackerIds)
	}));
}
