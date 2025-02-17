import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import {
	createMutation,
	type ApiMutation,
	type ApiQueryOptions,
	type Paginated,
	type PaginationParameters
} from './common';
import {
	apiDeleteTracker,
	apiGetTrackerLastLocation,
	apiGetTrackers,
	apiSetTrackerVehicle
} from './tracker';
import type { GetTrackersFilters, Tracker } from './tracker.schema';

export function apiGetTrackerLastLocationQuery(
	vehicleTrackerId: number,
	opts?: ApiQueryOptions<Awaited<ReturnType<typeof apiGetTrackerLastLocation>>>
) {
	return createQuery(() => ({
		queryKey: ['tracker', vehicleTrackerId, 'last-location'],
		queryFn: () => apiGetTrackerLastLocation(vehicleTrackerId),
		...opts
	}));
}

export function apiGetTrackersQuery(
	pagination: PaginationParameters,
	filters: GetTrackersFilters,
	opts?: ApiQueryOptions<Paginated<Tracker>>
) {
	return createQuery(() => ({
		queryKey: ['trackers', pagination, filters],
		queryFn: () => apiGetTrackers({ pagination, filters }),
		placeholderData: keepPreviousData,
		...opts
	}));
}

export function apiDeleteTrackerMutation(
	opts?: ApiMutation<string, { id: number; deleteAssociatedSimCards: boolean }>
) {
	return createMutation({
		fn: ({ id, deleteAssociatedSimCards }) => apiDeleteTracker(id, { deleteAssociatedSimCards }),
		...opts
	});
}

export function apiSetTrackerVehicleMutation(
	opts?: ApiMutation<string, { vehicleId: number | null; vehicleTrackerId: number }>
) {
	return createMutation({ fn: apiSetTrackerVehicle, ...opts });
}
