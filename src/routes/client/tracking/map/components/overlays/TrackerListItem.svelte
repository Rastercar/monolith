<script lang="ts">
	import type { Tracker } from '$lib/api/tracker.schema';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	interface Props {
		tracker: Tracker;
	}

	const { tracker }: Props = $props();

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

		<!-- TODO: reverse geocode ? -->
		<p class="text-sm">New York, USA</p>
	</div>

	<!-- TODO: tracker status -->
	<span class="px-3 py-1 text-xs font-semibold bg-success-500">Active</span>

	<!-- TODO: latest position date -->
	<div>
		<span class="type-scale-1 opacity-80">last position at</span>
		<p class="text-sm">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
	</div>
</li>
