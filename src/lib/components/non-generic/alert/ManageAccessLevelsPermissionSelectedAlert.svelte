<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		onUndoClicked: () => void;
	}

	const { onUndoClicked }: Props = $props();
</script>

<aside class="card preset-outlined-warning-200-800 my-6 p-4">
	<div class="flex items-center gap-4">
		<Icon icon="mdi:warning" height={24} />

		<p class="text-sm">
			Be warned! Allowing a access level to manage permissions will make every user within this
			access level to be "admin like".
		</p>

		<button
			class="btn btn-sm ml-auto preset-filled-secondary-200-800"
			onclick={() => onUndoClicked()}
		>
			undo
		</button>
	</div>
</aside>
