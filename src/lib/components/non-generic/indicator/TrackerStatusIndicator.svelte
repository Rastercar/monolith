<script lang="ts">
	import { apiGetTrackerLastLocation } from '$lib/api/tracker';
	import { checkMillisecondsEllapsedSinceDate } from '$lib/utils/date';
	import { createQuery } from '@tanstack/svelte-query';
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * ID of the tracker to fetch the last known position
		 */
		vehicleTrackerId: number;

		children?: Snippet<[{ isOnline: boolean; lastPositionDate: Date | null }]>;
	}

	let { vehicleTrackerId, children }: Props = $props();

	const query = createQuery(() => ({
		queryKey: ['tracker', vehicleTrackerId, 'last-location'],
		queryFn: () => apiGetTrackerLastLocation(vehicleTrackerId)
	}));

	const fiveMinutes = 1000 * 60 * 5;

	let lastPositionDate = $derived(query.data?.time ? new Date(query.data.time) : null);

	let isOnline = $derived(
		!!lastPositionDate && !checkMillisecondsEllapsedSinceDate(lastPositionDate, fiveMinutes)
	);

	let iconColor = $derived(
		isOnline ? 'bg-green-700 dark:bg-green-300' : 'bg-red-700 dark:bg-red-300'
	);
</script>

{@render children?.({ isOnline, lastPositionDate })}

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger class="h-2 w-2 ${iconColor} rounded-full" />
		<Tooltip.Content sideOffset={8} class="card py-1 px-3 bg-surface-200-800">
			<span class="type-scale-1">
				{isOnline
					? 'this tracker has communicated with the rastercar platform under the last 5 minutes'
					: 'its been over 5 minutes since a position has been recieved from this tracker'}
			</span>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
