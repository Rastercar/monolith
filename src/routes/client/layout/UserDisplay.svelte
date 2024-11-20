<script lang="ts">
	import UserAvatar from '$lib/components/avatar/UserAvatar.svelte';
	import { authStore } from '$lib/store/auth.svelte';

	interface Props {
		class?: string;
	}

	let { class: clazz = '' }: Props = $props();
	

	let { user } = $derived($authStore);
</script>

{#if user}
	<div class={clazz}>
		<div class="flex space-x-4 items-center h-16">
			<UserAvatar avatarProps={{ width: 'w-16' }} />

			<div>
				<span class="text-sm">welcome:</span>
				<p class="text-ellipsis overflow-hidden">{user.username}</p>
			</div>
		</div>
	</div>
{/if}
