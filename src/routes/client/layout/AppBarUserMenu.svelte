<script lang="ts">
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';
	import { Popover } from 'bits-ui';
	import UserDisplay from './UserDisplay.svelte';
</script>

<Popover.Root>
	<Popover.Trigger class="btn hover:cursor-pointer hover:preset-filled-primary-200-800">
		<Icon icon="mdi:user" width="32" height="32" />
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			class="z-30  max-w-96 rounded-lg bg-surface-300-700 p-4"
			align="end"
			sideOffset={8}
		>
			<UserDisplay classes="mr-4" />

			<hr class="hr my-4 border-t-2" />

			<div class="flex justify-end">
				<a href={route('/auth/sign-out')}>
					<button class="btn preset-filled-primary-100-900 flex items-center">
						Sign Out
						<Icon icon="mdi:sign-out" />
					</button>
				</a>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
