<script lang="ts">
	import { apiGetTrackerLastLocationQuery } from '$lib/api/tracker.queries';
	import { checkMillisecondsEllapsedSinceDate } from '$lib/utils/date';
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

	const query = apiGetTrackerLastLocationQuery(vehicleTrackerId);

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
					? 'esse rastreador se comunicou com a plataforma nos ultimos 5 minutos'
					: 'esse rastreador não se comunicou com a plataforma nos ultimos 5 minutos'}
			</span>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
