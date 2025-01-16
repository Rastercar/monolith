<script lang="ts">
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		onCloseClick: () => void;
		onReconnectClick: () => void;
		isConnectingToApi?: boolean;
	}

	const { isConnectingToApi = false, onCloseClick, onReconnectClick }: Props = $props();
</script>

<aside class="preset-filled-error-200-800 flex items-center p-2">
	<Icon class="mr-2 text-white" icon="mdi:error" height={32} />

	<div class="text-white">
		<h4 class="type-scale-3">Failed to connect to tracking service</h4>
		<p class="type-scale-1">
			Realtime updates wont work and any tracker being shown on the map might have outdated
			positions
		</p>
	</div>

	<div class="ml-auto">
		<LoadableButton
			isLoading={isConnectingToApi}
			classes="btn btn preset-filled-primary-200-800 mr-2"
			contentWrapperClass="flex items-center gap-2"
			onclick={onReconnectClick}
		>
			reconnect
			<Icon icon="mdi:reload" />
		</LoadableButton>

		<button class="btn preset-filled-secondary-200-800" onclick={onCloseClick}>
			close
			<Icon icon="mdi:close" />
		</button>
	</div>
</aside>
