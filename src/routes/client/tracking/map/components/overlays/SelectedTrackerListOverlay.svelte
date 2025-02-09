<script lang="ts">
	import { getMapContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';

	interface Props {
		onCloseClick: () => void;
	}

	const { onCloseClick }: Props = $props();

	const ctx = getMapContext();

	const trackers = $derived(Object.values(ctx.mapSelectedTrackers));
	const trackersCnnt = $derived(Object.keys(ctx.mapSelectedTrackers).length);
</script>

<h2 class="flex items-center mb-4 type-scale-6">
	<Icon icon="mdi:list-status" class="mr-2 hidden md:block" height={32} />
	Selected trackers ({trackersCnnt})

	<Icon icon="mdi:close" onclick={onCloseClick} class="ml-auto" height={32} />
</h2>

<ul class="space-y-4">
	{#each trackers as tracker}
		<li class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow">
			<div>
				<p class="text-gray-700 font-medium">#T12345</p>
				<p class="text-sm text-gray-500">New York, USA</p>
			</div>
			<span class="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-lg">Active</span>
			<p class="text-sm text-gray-500">2025-02-08 14:23</p>
		</li>
	{/each}
</ul>

<!-- TODO: -->
<ul class="space-y-4">
	<li class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow">
		<div>
			<p class="text-gray-700 font-medium">#T12345</p>
			<p class="text-sm text-gray-500">New York, USA</p>
		</div>
		<span class="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-lg">Active</span>
		<p class="text-sm text-gray-500">2025-02-08 14:23</p>
	</li>

	<li class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow">
		<div>
			<p class="text-gray-700 font-medium">#T67890</p>
			<p class="text-sm text-gray-500">London, UK</p>
		</div>
		<span class="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg">Offline</span>
		<p class="text-sm text-gray-500">2025-02-08 13:45</p>
	</li>

	<li class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow">
		<div>
			<p class="text-gray-700 font-medium">#T54321</p>
			<p class="text-sm text-gray-500">Tokyo, Japan</p>
		</div>
		<span class="px-3 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-lg">Idle</span>
		<p class="text-sm text-gray-500">2025-02-08 13:30</p>
	</li>
</ul>
