<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { getMapContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';
	import type { TrackerAndPosition } from '../../map';

	interface Props {
		trackerWithPosition: TrackerAndPosition;
		onInfoClick: () => void;
	}

	const { trackerWithPosition: tp, onInfoClick }: Props = $props();

	const trackerDetailsHref = route('/client/tracking/trackers/[tracker_id=integer]', {
		tracker_id: tp.tracker.id.toString()
	});

	const mapCtx = getMapContext();
</script>

<li class="flex items-center justify-between bg-surface-300-700 shadow card px-4">
	<div class="space-y-1">
		<span class="type-scale-2 flex" title="imei">
			{tp.tracker.imei}
			<a
				href={trackerDetailsHref}
				class="flex items-center text-blue-800 dark:text-blue-400 hover:underline"
			>
				<Icon icon="mdi:link" class="ml-2" />
			</a>
		</span>

		<div>Model: {tp.tracker.model}</div>
	</div>

	{#if tp.position}
		<div
			class="space-y-2 hover:bg-surface-200-800 py-2 px-2"
			onclick={() => {
				if (!tp.position || !mapCtx.mapInstance) return;

				mapCtx.mapInstance?.panTo({ lat: tp.position?.lat, lng: tp.position?.lng });
				mapCtx.mapInstance?.setZoom(20);
			}}
			aria-hidden="true"
		>
			<div class="flex items-center">
				<Icon icon="mdi:map-marker" class="mr-2" />
				<span title="latitude">{tp.position.lat.toFixed(5)}</span>
				<span class="ml-2" title="longitude">{tp.position.lng.toFixed(5)}</span>
			</div>

			<div class="flex items-center">
				<Icon icon="mdi:calendar" class="mr-2" />
				<p class="text-sm">
					{new Date(tp.position.timestamp).toLocaleDateString()}
					{new Date(tp.position.timestamp).toLocaleTimeString()}
				</p>
			</div>
		</div>
	{:else}
		<div class="chip preset-filled-warning-200-800">
			<Icon icon="mdi:warning" class="mr-2" />
			No position found
		</div>
	{/if}

	<button type="button" class="chip-icon" onclick={onInfoClick}>
		<Icon icon="mdi:info" height={24} />
	</button>
</li>
