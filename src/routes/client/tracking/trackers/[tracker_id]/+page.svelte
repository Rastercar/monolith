<script lang="ts">
	import { run } from 'svelte/legacy';

	import { apiGetTrackerById } from '$lib/api/tracker';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import UpdateTrackerForm from '$lib/components/non-generic/form/UpdateTrackerForm.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import Icon from '@iconify/svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import TrackerInfo from './components/TrackerInfo.svelte';
	import TrackerPositionList from '$lib/components/non-generic/list/TrackerPositionList.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const query = createQuery({
		queryKey: ['tracker', data.vehicleTrackerId],
		placeholderData: keepPreviousData,
		queryFn: () => apiGetTrackerById(data.vehicleTrackerId)
	});

	let editMode = $state(false);

	let trackerDeleted = $state(false);

	let tracker;
	run(() => {
		tracker = $query.data;
	});
</script>

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="tracker info"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/trackers', icon: 'mdi:cellphone', text: 'trackers' },
			{
				href: `/client/tracking/trackers/${data.vehicleTrackerId}`,
				text: data.vehicleTrackerId.toString()
			}
		]}
	/>

	<hr class="my-4" />

	{#if trackerDeleted}
		<DeletionSuccessMessage title="Tracker deleted successfully" href="/client/tracking/trackers" />
	{:else if tracker}
		{#if !editMode}
			<div class="card">
				<TrackerInfo
					{tracker}
					createSimCardForm={data.createSimCardForm}
					updateSimCardForm={data.updateSimCardForm}
					on:edit-mode-on={() => (editMode = true)}
					on:tracker-deleted={() => (trackerDeleted = true)}
				/>
			</div>

			<div class="card mt-4">
				<TrackerPositionList trackerId={tracker.id} />
			</div>
		{:else}
			<div class="card p-4">
				<div class="flex justify-between items-center">
					<span>Updating vehicle tracker</span>

					<button
						class="btn-icon btn-icon-sm variant-filled-primary"
						onclick={() => (editMode = false)}
					>
						<Icon icon="mdi:pencil-off" />
					</button>
				</div>

				<hr class="my-4" />

				<UpdateTrackerForm
					{tracker}
					formSchema={data.updateTrackerForm}
					on:tracker-updated={(e) => {
						editMode = false;
						tracker = e.detail;
					}}
				/>
			</div>
		{/if}
	{/if}
</div>
