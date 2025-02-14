import { showErrorToast } from '$lib/store/toast';
import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { ApiQueryOptions, Paginated, PaginationParameters } from './common';
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

export function apiDeleteTrackerMutation() {
	return createMutation(() => ({
		mutationFn: ({
			id,
			deleteAssociatedSimCards
		}: {
			id: number;
			deleteAssociatedSimCards: boolean;
		}) => {
			return apiDeleteTracker(id, { deleteAssociatedSimCards });
		},
		onError: showErrorToast
	}));
}

export function apiSetTrackerVehicleMutation() {
	return createMutation(() => ({
		mutationFn: (ids: { vehicleId: number | null; vehicleTrackerId: number }) =>
			apiSetTrackerVehicle(ids),
		onError: showErrorToast
	}));
}
