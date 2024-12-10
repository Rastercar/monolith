<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'bits-ui';

	interface Props {
		email: string;
		verified: boolean;
	}

	let { email, verified }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger class="flex items-center">
			<div class="mr-2">
				<Icon
					icon={verified ? 'mdi:check' : 'mdi:times'}
					class={verified ? 'text-success-500' : 'text-error-500'}
				/>
			</div>

			{email}
		</Tooltip.Trigger>
		<Tooltip.Content class="card py-1 px-3 bg-surface-200-800">
			{verified ? 'email verified' : 'verification pending'}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
