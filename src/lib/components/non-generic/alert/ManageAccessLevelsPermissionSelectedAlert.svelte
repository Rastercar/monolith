<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ 'undo-clicked': void }>();
</script>

<aside class="alert variant-ghost-warning my-6">
	<div class="alert-message">
		<div class="flex items-center gap-4">
			<Icon icon="mdi:warning" height={24} />

			<p class="text-sm">
				Be warned! Allowing a access level to manage permissions will make every user within this
				access level to be "admin like".
			</p>
		</div>

		<div class="mt-1 flex justify-end">
			<button class="badge variant-soft-warning" onclick={() => dispatch('undo-clicked')}>
				undo
			</button>
		</div>
	</div>
</aside>
