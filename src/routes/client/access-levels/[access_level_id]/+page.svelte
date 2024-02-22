<script lang="ts">
	import { apiGetAccessLevelById } from '$lib/api/access-level';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import AccessLevelInfo from './components/AccessLevelInfo.svelte';
	import UpdateAccessLevelForm from './components/UpdateAccessLevelForm.svelte';

	export let data: PageData;

	// TODO: false
	let editMode = true;

	let value = false;

	const query = createQuery({
		queryKey: ['access-level', data.accessLevelId],
		queryFn: () => apiGetAccessLevelById(data.accessLevelId)
	});

	$: ({ data: accessLevel, error, isLoading } = $query);
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<div class="card">
		<div class="flex items-center p-4">
			<div class="flex items-center">
				<Icon icon="mdi:shield" width="32" height="32" class="mr-2" />
				{editMode ? 'Editing access level' : `Access Level: ${accessLevel?.name ?? ''}`}
			</div>

			<button
				class="ml-auto btn-icon btn-icon-sm variant-filled-primary"
				on:click={() => (editMode = !editMode)}
			>
				<Icon icon={editMode ? 'mdi:pencil-off' : 'mdi:pencil'} />
			</button>
		</div>

		<div class="px-4 pb-4">
			{#if error}
				<div class="text-error-500">Error loading access level</div>
			{:else if isLoading}
				<div>loading</div>
			{:else if accessLevel}
				{#if editMode}
					<UpdateAccessLevelForm {accessLevel} />
				{:else}
					<AccessLevelInfo {accessLevel} />
				{/if}
			{/if}
		</div>
	</div>
</div>
