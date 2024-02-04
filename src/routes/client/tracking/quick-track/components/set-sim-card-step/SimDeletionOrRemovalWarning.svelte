<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let type: 'deletion' | 'removal';

	const dispatch = createEventDispatcher<{
		'cancel-click': void;
		'confirm-click': void;
	}>();
</script>

<aside class="alert variant-filled-warning my-4">
	<Icon icon="mdi:alert" width="36" height="36" />

	<p class="alert-message text-sm">
		{type === 'deletion'
			? 'Do you wish to delete this SIM card permanently'
			: 'Do you wish to remove this SIM card from the tracker'}
	</p>

	<div class="alert-actions">
		<button
			type="button"
			class="btn btn-sm variant-filled"
			on:click={() => dispatch('cancel-click')}
		>
			No
		</button>

		<button
			type="button"
			class="btn btn-sm variant-filled"
			on:click={() => dispatch('confirm-click')}
		>
			Yes
		</button>
	</div>
</aside>
