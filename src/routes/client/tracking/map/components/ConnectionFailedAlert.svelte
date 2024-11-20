<script lang="ts">
	import { nonpassive } from 'svelte/legacy';

	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		isConnectingToApi?: boolean;
	}

	let { isConnectingToApi = false }: Props = $props();

	const dispatch = createEventDispatcher<{
		'reconnect-click': void;
		'close-click': void;
	}>();
</script>

<aside
	class="alert variant-filled-error"
	use:nonpassive={[
		'wheel',
		() => (e) => {
			e.preventDefault();
			e.stopPropagation();
		}
	]}
>
	<Icon icon="mdi:error" height={48} />

	<div class="alert-message">
		<h4 class="h4">Failed to connect to tracking service</h4>
		<p class="text-sm">
			Realtime updates wont work and any tracker being shown on the map might have outdated
			positions
		</p>
	</div>

	<div class="alert-actions">
		<LoadableButton
			isLoading={isConnectingToApi}
			class="btn btn-sm variant-filled"
			contentWrapperClass="flex items-center"
			loaderWidth="w-4"
			on:click={() => dispatch('reconnect-click')}
		>
			<div>reconnect</div>
			<Icon icon="mdi:reload" class="ml-2" />
		</LoadableButton>

		<button class="btn btn-sm variant-filled" onclick={() => dispatch('close-click')}>
			close
			<Icon icon="mdi:close" class="ml-2" />
		</button>
	</div>
</aside>
