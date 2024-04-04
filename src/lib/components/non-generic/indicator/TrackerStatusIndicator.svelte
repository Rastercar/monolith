<script lang="ts">
	import { apiGetTrackerLastLocation } from '$lib/api/tracker';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { isDateOlderThanXMilliseconds } from '$lib/utils/date';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';

	/**
	 * ID of the tracker to fetch the last known position
	 */
	export let vehicleTrackerId: number;

	const query = createQuery({
		queryKey: ['tracker', vehicleTrackerId, 'location'],
		queryFn: () => apiGetTrackerLastLocation(vehicleTrackerId)
	});

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'trackerStatusPopup',
		placement: 'top'
	};

	const fiveMinutes = 1000 * 60 * 5;

	$: lastPositionDate = $query.data?.time ? new Date($query.data.time) : null;

	$: isOnline = !!lastPositionDate && isDateOlderThanXMilliseconds(lastPositionDate, fiveMinutes);

	$: iconColor = isOnline ? 'bg-green-700 dark:bg-green-300' : 'bg-red-700 dark:bg-red-300';
</script>

<!--
@component
A simple dot that displays if the tracker has been recently connected to the rastercar platform

If a tracker has sent a position within the last 5 minutes then its considered as connected
-->
<ArrowUpTooltip dataPopup="trackerStatusPopup">
	<span class="text-xs">
		{isOnline
			? 'this tracker has communicated with the rastercar platform under the last 5 minutes'
			: 'its been over 5 minutes since a position has been recieved from this tracker'}
	</span>
</ArrowUpTooltip>

<div use:popup={popupHover} class={`h-2 w-2 ${iconColor} rounded-full`} />

<slot {isOnline} {lastPositionDate} />
