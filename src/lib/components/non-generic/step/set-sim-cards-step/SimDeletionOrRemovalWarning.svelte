<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		type: 'deletion' | 'removal';
		onCancel: VoidFunction;
		onConfirm: VoidFunction;
	}

	let { type, onCancel, onConfirm }: Props = $props();
</script>

<div
	class="card preset-outlined-warning-500 grid grid-cols-1 items-center gap-4 p-3 lg:grid-cols-[auto_1fr_auto]"
>
	<Icon icon="mdi:alert" width="24" height="24" />
	<div>
		<p class="type-scale-2">
			{type === 'deletion'
				? 'Do you wish to delete this SIM card permanently ?'
				: 'Do you wish to remove this SIM card from the tracker ?'}
		</p>
	</div>
	<div class="flex gap-1">
		<button type="button" class="btn btn-sm preset-tonal hover:preset-filled" onclick={onCancel}>
			No
		</button>

		<button type="button" class="btn btn-sm preset-tonal hover:preset-filled" onclick={onConfirm}>
			Yes
		</button>
	</div>
</div>
