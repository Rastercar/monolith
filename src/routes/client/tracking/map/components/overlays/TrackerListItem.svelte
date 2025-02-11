<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import { route } from '$lib/ROUTES';
	import type { Position } from '$lib/store/map.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		tracker: Tracker;
		position: Position;
		onInfoClick: () => void;
	}

	const { tracker, position, onInfoClick }: Props = $props();

	const trackerDetailsHref = route('/client/tracking/trackers/[tracker_id=integer]', {
		tracker_id: tracker.id.toString()
	});
</script>

<li class="flex items-center justify-between bg-surface-300-700 p-4 shadow">
	<div>
		<span class="type-scale-2 flex">
			{tracker.imei}
			<a
				href={trackerDetailsHref}
				class="flex items-center text-blue-800 dark:text-blue-400 hover:underline"
			>
				<Icon icon="mdi:link" class="ml-2" />
			</a>
		</span>

		<!-- TODO: display in a better manner -->
		<p>Latitude: <span>{position.lat}</span>°</p>
		<p>Longitude: <span>{position.lng}</span>°</p>
	</div>

	<!-- TODO: tracker status -->
	<div class="flex space-x-4 items-center">
		<span class="chip text-xs bg-success-500">Active</span>

		<button type="button" class="chip-icon" onclick={onInfoClick}>
			<Icon icon="mdi:info" height={24} />
		</button>
	</div>

	<!-- TODO: latest position date -->
	<div>
		<span class="type-scale-1 opacity-80">last position at</span>
		<p class="text-sm">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
	</div>
</li>
