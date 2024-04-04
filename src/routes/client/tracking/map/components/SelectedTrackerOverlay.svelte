<script lang="ts">
	import type { Position } from '../map';
	import type { Tracker } from '$lib/api/tracker.schema';
	import Icon from '@iconify/svelte';
	import { toDate } from '$lib/utils/date';
	import { createQuery } from '@tanstack/svelte-query';
	import { apiGetVehicleById } from '$lib/api/vehicle';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { getDrawerStore, popup } from '@skeletonlabs/skeleton';
	import { isDateOlderThanXMilliseconds } from '$lib/utils/date';
	import { cloudFrontUrl } from '$lib/utils/url';

	export let tracker: Tracker;

	export let position: Position;

	const fiveMinutes = 1000 * 60 * 5;

	const drawerStore = getDrawerStore();

	const query = createQuery({
		enabled: !!tracker.vehicleId,
		queryKey: ['vehicle', tracker.vehicleId],
		queryFn: () => apiGetVehicleById(tracker.vehicleId ?? 0)
	});

	$: ({ data: vehicleTracker } = $query);

	$: isOnline =
		!!position.timestamp && isDateOlderThanXMilliseconds(position.timestamp, fiveMinutes);

	$: iconColor = isOnline ? 'bg-green-700 dark:bg-green-300' : 'bg-red-700 dark:bg-red-300';
</script>

<ArrowUpTooltip dataPopup="trackerOverlayStatusPopup">
	<span class="text-xs">
		{isOnline
			? 'this tracker has communicated with the rastercar platform under the last 5 minutes'
			: 'its been over 5 minutes since a position has been recieved from this tracker'}
	</span>
</ArrowUpTooltip>

<div class="max-w-sm">
	<div class="px-4 pt-4">
		<h2 class="flex items-center text-2xl">
			<Icon icon="mdi:cellphone-marker" class="mr-2" height={24} />
			Tracker Information
		</h2>

		<div class="mt-4 mb-1">imei: {tracker.imei}</div>
		<div class="mb-1">model: {tracker.model}</div>

		<div class="flex items-center mb-2">
			status: {isOnline ? 'online' : 'offline'}

			<div
				use:popup={{
					event: 'hover',
					target: 'trackerOverlayStatusPopup',
					placement: 'top'
				}}
				class={`h-2 w-2 ${iconColor} rounded-full ml-2`}
			/>
		</div>

		<div class="mb-2 flex items-center">
			<Icon icon="mdi:calendar" class="mr-2" />
			<span class="mr-2">created at:</span>

			{toDate(tracker.createdAt)}
		</div>

		<div class="flex items-center">
			<Icon icon="mdi:map-marker" class="mr-2" />
			{position.lat.toFixed(5)} <span class="ml-4">{position.lng.toFixed(5)}</span>
		</div>

		<span class="opacity-80 text-xs mt-4">
			last position at {new Date(position.timestamp).toLocaleString()}
		</span>
	</div>

	{#if vehicleTracker}
		<div class="mb-3 mt-6 px-4 flex items-center text-xl">
			<hr class="w-full mr-2" />
			<span class="flex items-center">
				<Icon icon="mdi:car" class="mr-2" />
				vehicle
			</span>

			<hr class="w-full ml-2" />
		</div>

		{#if vehicleTracker.photo}
			<img
				class="h-40 mb-4 w-full object-cover"
				src={cloudFrontUrl(vehicleTracker.photo)}
				alt="vehicle"
			/>
		{/if}

		<div class="px-4">
			<div><span class="text-sm opacity-80">plate:</span> {vehicleTracker.plate ?? 'n/a'}</div>
			<div><span class="text-sm opacity-80">brand:</span> {vehicleTracker.brand ?? 'n/a'}</div>
			<div><span class="text-sm opacity-80">model:</span> {vehicleTracker.model ?? 'n/a'}</div>
			<div><span class="text-sm opacity-80">color:</span> {vehicleTracker.color ?? 'n/a'}</div>

			{#if vehicleTracker.modelYear && vehicleTracker.fabricationYear}
				<div>
					<span class="text-sm opacity-80">year:</span>
					{vehicleTracker.modelYear} / {vehicleTracker.fabricationYear}
				</div>
			{:else}
				<div>
					<span class="text-sm opacity-80">year: n/a</span>
				</div>
			{/if}

			<div>
				<span class="text-sm opacity-80">chassis:</span>
				{vehicleTracker.chassisNumber ?? 'n/a'}
			</div>
		</div>

		{#if vehicleTracker.additionalInfo}
			<p class="px-4 my-2">{vehicleTracker.additionalInfo}</p>
		{/if}

		<div class="flex px-4 justify-end link">
			<a
				class="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
				href={`/client/tracking/vehicles/${vehicleTracker.id}`}
				on:click={() => {
					drawerStore.close();
				}}
			>
				<Icon icon="mdi:link" class="mr-2" />
				see details
			</a>
		</div>
	{:else}
		<div class="p-4 mt-4 text-sm flex items-center text-warning-600-300-token">
			<Icon icon="mdi:warning" class="mr-2" />
			This tracker is not installed on a vehicle
		</div>
	{/if}
</div>
