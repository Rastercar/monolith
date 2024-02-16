<script lang="ts">
	import { apiGetTrackerLastLocation } from '$lib/api/tracker';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';

	export let trackerId: number;

	const query = createQuery({
		queryKey: ['tracker', trackerId, 'location'],
		queryFn: () => apiGetTrackerLastLocation(trackerId)
	});

	const isDateBetweenTheLast5Minutes = (inputDate: Date) => {
		const currentDate = new Date();

		const msDiff = currentDate.getTime() - inputDate.getTime();
		const minutesDifference = msDiff / (1000 * 60);

		return minutesDifference < 5;
	};

	const toDateTime = (d: Date) =>
		d.toLocaleTimeString(undefined, {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'short'
		});

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'trackerStatusPopup',
		placement: 'top'
	};

	$: lastPositionDate = $query.data?.time ? new Date($query.data.time) : null;
	$: isOnline = lastPositionDate && isDateBetweenTheLast5Minutes(lastPositionDate);
</script>

<ArrowUpTooltip dataPopup="trackerStatusPopup" additionalClasses="max-w-xs">
	<span class="text-xs">
		{isOnline
			? 'this tracker has communicated with the rastercar platform under the last 5 minutes'
			: 'its been over 5 minutes since a position has been recieved from this tracker'}
	</span>
</ArrowUpTooltip>

<div class="flex flex-col flex-grow mr-6">
	<div class="flex items-center">
		<span>Installed tracker:</span>

		{#if isOnline}
			<div
				use:popup={popupHover}
				class="h-2 w-2 bg-green-700 dark:bg-green-300 rounded-full mr-2 ml-auto"
			/>
			<div>online</div>
		{:else}
			<div
				use:popup={popupHover}
				class="h-2 w-2 bg-red-700 dark:bg-red-300 rounded-full mr-2 ml-auto"
			/>
			<div>offline</div>
		{/if}
	</div>

	<div class="flex text-sm opacity-70">
		<span>last position at</span>
		<span class="ml-auto">{lastPositionDate ? toDateTime(lastPositionDate) : 'unknown'}</span>
	</div>
</div>
