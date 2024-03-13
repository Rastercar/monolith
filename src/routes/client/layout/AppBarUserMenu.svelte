<script lang="ts">
	import { authStore } from '$lib/store/auth';
	import Icon from '@iconify/svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import UserDisplay from './UserDisplay.svelte';

	$: ({ user } = $authStore);
</script>

{#if user}
	<button
		class="btn hover:variant-filled-primary"
		use:popup={{
			event: 'click',
			target: 'theme',
			closeQuery: 'a[href]',
			placement: 'bottom-end',
			middleware: { offset: { mainAxis: 10, alignmentAxis: 16 } }
		}}
	>
		<Icon icon="mdi:user" width="32" height="32" />
	</button>

	<div class="card p-4 w-60 shadow-xl !z-50" data-popup="theme">
		<UserDisplay />

		<hr class="mt-3 mb-4" />

		<div class="flex justify-end">
			<a href="/auth/sign-out" class="btn variant-filled-secondary btn-sm">Sign Out</a>
		</div>
	</div>
{/if}
