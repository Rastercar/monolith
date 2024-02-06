<script lang="ts">
	import { apiDeleteSimCard, apiSetSimCardTracker } from '$lib/api/sim-card';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { ProgressRadial, popup } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import SimDeletionOrRemovalWarning from './SimDeletionOrRemovalWarning.svelte';

	export let simCard: SimCard;

	export let additionalClasses = '';

	let warningToShow: 'deletion' | 'removal' | null = null;

	const toaster = getToaster();

	const deleteSimMutation = createMutation({
		mutationFn: () => apiDeleteSimCard(simCard.id),
		onSuccess: () => toaster.success('SIM card deleted successfully')
	});

	const removeSimCardMutation = createMutation({
		mutationFn: () => apiSetSimCardTracker({ simCardId: simCard.id, newTrackerId: null }),
		onSuccess: () => toaster.success('SIM card removed from slot successfully')
	});

	const deleteSimCard = () => {
		$deleteSimMutation
			.mutateAsync()
			.then(() => dispatch('sim-deleted'))
			.catch(() => toaster.error('failed to delete sim card'));
	};

	const removeSimCard = () => {
		$removeSimCardMutation
			.mutateAsync()
			.then(() => dispatch('sim-removed'))
			.catch(() => toaster.error('failed to remove sim card'));
	};

	const dispatch = createEventDispatcher<{
		'sim-deleted': void;
		'sim-removed': void;
	}>();
</script>

<div class={`card p-4 ${additionalClasses}`}>
	<div class="flex items-center mb-2">
		<span class="text-md">phone number: {simCard.phoneNumber}</span>

		<!-- Remove SIM button -->
		<button
			class="ml-auto btn-icon btn-icon-sm variant-filled p-0 [&>*]:pointer-events-none"
			disabled={!!warningToShow || $removeSimCardMutation.isPending}
			use:popup={{ event: 'hover', target: 'removeSimPopup', placement: 'top' }}
			on:click={() => (warningToShow = 'removal')}
		>
			{#if $removeSimCardMutation.isPending}
				<ProgressRadial value={undefined} width="w-6" />
			{:else}
				<Icon icon="mdi:close" width={18} />
			{/if}
		</button>

		<ArrowUpTooltip dataPopup="removeSimPopup">
			{$removeSimCardMutation.isPending ? 'removing SIM card' : 'remove SIM card'}
		</ArrowUpTooltip>

		<!-- Delete SIM button -->
		<button
			class="ml-4 btn-icon btn-icon-sm variant-filled p-0 [&>*]:pointer-events-none"
			disabled={!!warningToShow || $deleteSimMutation.isPending}
			use:popup={{ event: 'hover', target: 'deleteSimPopup', placement: 'top' }}
			on:click={() => (warningToShow = 'deletion')}
		>
			{#if $deleteSimMutation.isPending}
				<ProgressRadial value={undefined} width="w-6" />
			{:else}
				<Icon icon="mdi:trash" width={18} />
			{/if}
		</button>

		<ArrowUpTooltip dataPopup="deleteSimPopup">
			{$deleteSimMutation.isPending ? 'deleting sim card' : 'delete SIM card'}
		</ArrowUpTooltip>
	</div>

	{#if warningToShow !== null}
		<SimDeletionOrRemovalWarning
			type={warningToShow}
			on:cancel-click={() => {
				warningToShow = null;
			}}
			on:confirm-click={() => {
				warningToShow === 'deletion' ? deleteSimCard() : removeSimCard();
				warningToShow = null;
			}}
		/>
	{/if}

	<hr class="my-4" />

	<div class="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
		<p><b>SSN:</b> {simCard.ssn}</p>
		<p><b>APN Address:</b> {simCard.apnAddress}</p>
		<p><b>APN User:</b> {simCard.apnUser}</p>
		<p><b>APN Password:</b> {simCard.apnPassword}</p>
		<p><b>PIN:</b> {simCard.pin}</p>
		<p><b>PIN 2:</b> {simCard.pin2}</p>
		<p><b>PUK:</b> {simCard.puk}</p>
		<p><b>PUK 2:</b> {simCard.puk2}</p>
	</div>
</div>
