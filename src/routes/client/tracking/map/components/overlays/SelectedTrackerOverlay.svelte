<script lang="ts">
	import { apiGetVehicle } from '$lib/api/vehicle';
	import { route } from '$lib/ROUTES';
	import { checkMillisecondsEllapsedSinceDate, toLocaleDateString } from '$lib/utils/date';
	import { cloudFrontUrl } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import type { TrackerAndPosition } from '../../map';

	interface Props {
		trackerWithPosition: TrackerAndPosition;
		title?: Snippet;
	}

	let { trackerWithPosition, title }: Props = $props();

	const { tracker, position } = $derived(trackerWithPosition);

	const fiveMinutes = 1000 * 60 * 5;

	const query = createQuery(() => ({
		enabled: !!tracker.vehicleId,
		queryKey: ['vehicle', tracker.vehicleId],
		queryFn: () => apiGetVehicle(tracker.vehicleId ?? 0)
	}));

	let { data: vehicleTracker } = $derived(query);

	let isOnline = $derived(
		!!position?.timestamp && !checkMillisecondsEllapsedSinceDate(position.timestamp, fiveMinutes)
	);
</script>

{#snippet field(xd: string, value: string | null)}
	<div><span class="type-scale-2 opacity-80">{xd}:</span> {value ?? 'n/a'}</div>
{/snippet}

<div class="p-6">
	<div>
		<h2 class="flex items-center text-2xl">
			<Icon icon="mdi:cellphone-marker" class="mr-2" height={24} />
			Tracker Information

			{@render title?.()}
		</h2>

		<div class="mt-4 mb-1">imei: {tracker.imei}</div>
		<div class="mb-1">model: {tracker.model}</div>

		<div class="flex items-center mb-2">
			status: {isOnline ? 'online' : 'offline'}
		</div>

		<div class="mb-2 flex items-center">
			<Icon icon="mdi:calendar" class="mr-2" />
			<span class="mr-2">created at:</span>

			{toLocaleDateString(tracker.createdAt)}
		</div>

		{#if position}
			<div class="flex items-center">
				<Icon icon="mdi:map-marker" class="mr-2" />
				{position.lat.toFixed(5)} <span class="ml-4">{position.lng.toFixed(5)}</span>
			</div>

			<span class="opacity-80 type-scale-1 mt-4">
				last position at {new Date(position.timestamp).toLocaleString()}
			</span>
		{/if}

		<a
			class="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
			href={route(`/client/tracking/trackers/[tracker_id=integer]`, {
				tracker_id: tracker.id.toString()
			})}
		>
			<Icon icon="mdi:link" class="mr-2" />
			see details
		</a>
	</div>

	{#if vehicleTracker}
		<div class="mb-3 mt-6 flex items-center text-xl">
			<hr class="w-full mr-2 hr" />

			<span class="flex items-center">
				<Icon icon="mdi:car" class="mr-2" />
				vehicle
			</span>

			<hr class="w-full ml-2 hr" />
		</div>

		{#if vehicleTracker.photo}
			<img
				class="h-40 mb-4 w-full object-cover px-4"
				src={cloudFrontUrl(vehicleTracker.photo)}
				alt="vehicle"
			/>
		{/if}

		<div>
			{@render field('plate', vehicleTracker.plate)}
			{@render field('brand', vehicleTracker.brand)}
			{@render field('model', vehicleTracker.model)}
			{@render field('color', vehicleTracker.color)}

			{#if vehicleTracker.modelYear && vehicleTracker.fabricationYear}
				<div>
					<span class="type-scale-2 opacity-80">year:</span>
					{vehicleTracker.modelYear} / {vehicleTracker.fabricationYear}
				</div>
			{:else}
				<div>
					<span class="type-scale-2 opacity-80">year: n/a</span>
				</div>
			{/if}

			<div>
				<span class="type-scale-2 opacity-80">chassis:</span>
				{vehicleTracker.chassisNumber ?? 'n/a'}
			</div>
		</div>

		{#if vehicleTracker.additionalInfo}
			<p class="my-2">{vehicleTracker.additionalInfo}</p>
		{/if}

		<a
			class="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
			href={route('/client/tracking/vehicles/[vehicle_id=integer]', {
				vehicle_id: vehicleTracker.id.toString()
			})}
		>
			<Icon icon="mdi:link" class="mr-2" />
			see details
		</a>
	{:else}
		<div class="p-4 mt-4 type-scale-2 flex items-center text-warning-600-300-token">
			<Icon icon="mdi:warning" class="mr-2" />
			This tracker is not installed on a vehicle
		</div>
	{/if}
</div>
