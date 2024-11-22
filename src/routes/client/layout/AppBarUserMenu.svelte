<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { authStore } from '$lib/store/auth';
	import Icon from '@iconify/svelte';
	import { Popover } from 'bits-ui';
	import UserDisplay from './UserDisplay.svelte';

	const { user } = $derived(authStore.getValue());
</script>

{#if user}
	<Popover.Root>
		<Popover.Trigger class="ml-auto btn hover:cursor-pointer hover:preset-filled-primary-200-800">
			<Icon icon="mdi:user" width="32" height="32" />
		</Popover.Trigger>

		<Popover.Portal>
			<Popover.Content
				class="z-30  max-w-96 rounded-lg bg-surface-300-700 p-4"
				align={'end'}
				sideOffset={8}
			>
				<UserDisplay />

				<hr class="hr my-4 border-t-2" />

				<div class="flex justify-end">
					<a href={route('/auth/sign-out')} class="btn btn-sm preset-filled-primary-100-900">
						Sign Out
					</a>
				</div>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
{/if}
