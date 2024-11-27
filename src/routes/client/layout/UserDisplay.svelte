<script lang="ts">
	import UserAvatar from '$lib/components/avatar/UserAvatar.svelte';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import type { PropsWithClasses } from '$lib/utils/svelte';

	let { classes = '' }: PropsWithClasses = $props();

	const auth = getAuthContext();
</script>

{#if auth.user}
	<div class={classes}>
		<div class="flex space-x-4 items-center h-16">
			<UserAvatar wrapperClass="w-16" />

			<div class="max-w-24">
				welcome
				<p class="text-ellipsis overflow-hidden line-clamp-2">
					{auth?.user.username}
				</p>
			</div>
		</div>
	</div>
{/if}
