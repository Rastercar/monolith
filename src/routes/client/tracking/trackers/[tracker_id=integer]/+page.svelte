<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import UpdateTrackerForm from '$lib/components/non-generic/form/UpdateTrackerForm.svelte';
	import TrackerPositionList from '$lib/components/non-generic/list/TrackerPositionList.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';
	import TrackerInfo from './components/TrackerInfo.svelte';

	const { data } = $props();

	let trackerDeleted = $state(false);
	let tracker = $state(data.tracker);
	let editMode = $state(false);
</script>

<PageContainer>
	<PageHeader
		title="rastreador"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/tracking/trackers'), icon: 'mdi:cellphone', text: 'rastreadores' },
			{
				href: route('/client/tracking/trackers/[tracker_id=integer]', {
					tracker_id: data.tracker.id.toString()
				}),
				text: data.tracker.imei
			}
		]}
	/>

	<hr class="hr my-4" />

	{#if trackerDeleted}
		<DeletionSuccessMessage title="Rastreador deletado" href={route('/client/tracking/trackers')} />
	{:else if !editMode}
		<div class="card preset-filled-surface-100-900">
			<TrackerInfo
				bind:tracker
				createSimCardForm={data.createSimCardForm}
				updateSimCardForm={data.updateSimCardForm}
				onEditModeClick={() => (editMode = true)}
				onTrackerDeleted={() => (trackerDeleted = true)}
			/>
		</div>

		<div class="card preset-filled-surface-100-900 mt-4">
			<TrackerPositionList trackerId={data.tracker.id} />
		</div>
	{:else}
		<div class="card preset-filled-surface-100-900 p-4">
			<div class="flex justify-between items-center">
				<span>Atualizando rastreador do veículo</span>

				<button class="btn-icon preset-filled-primary-500" onclick={() => (editMode = false)}>
					<Icon icon="mdi:pencil-off" />
				</button>
			</div>

			<hr class="hr my-4" />

			<UpdateTrackerForm
				trackerId={data.tracker.id}
				initialValues={data.tracker}
				formSchema={data.updateTrackerForm}
				onUpdated={(v) => {
					editMode = false;
					tracker = v;
				}}
			/>
		</div>
	{/if}
</PageContainer>
