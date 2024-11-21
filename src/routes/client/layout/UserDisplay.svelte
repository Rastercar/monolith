<script lang="ts">
	import UserAvatar from '$lib/components/avatar/UserAvatar.svelte';
	import { authStore } from '$lib/store/auth.svelte';

	interface Props {
		classes?: string;
	}

	let { classes = '' }: Props = $props();

	const { user } = authStore.getValue();
</script>

{#if user}
	<div class={classes}>
		<div class="flex space-x-4 items-center h-16">
			<UserAvatar wrapperClass="w-16" />

			<div>
				<span class="text-sm">welcome:</span>
				<p class="text-ellipsis overflow-hidden">{user.username}</p>
			</div>
		</div>
	</div>
{/if}
