import { isPositiveInteger } from '$lib/utils/number';
import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
import type { PaginationParameters } from './common';
import { apiDeleteVehicle as apiDeleteVehicleById, apiGetVehicle, apiGetVehicles } from './vehicle';
import type { GetVehiclesFilters } from './vehicle.schema';

export function apiGetVehiclesQuery(pagination: PaginationParameters, filters: GetVehiclesFilters) {
	return createQuery(() => ({
		queryKey: ['vehicles', pagination, filters],
		queryFn: () => apiGetVehicles({ pagination, filters }),
		placeholderData: keepPreviousData
	}));
}

export function apiGetVehicleQuery(vehicleId: number) {
	return createQuery(() => ({
		enabled: isPositiveInteger(vehicleId),
		queryKey: ['vehicle', vehicleId],
		queryFn: () => apiGetVehicle(vehicleId)
	}));
}

export function apiDeleteVehicleByIdMutation() {
	return createMutation(() => ({
		mutationFn: (id: number) => apiDeleteVehicleById(id)
	}));
}
