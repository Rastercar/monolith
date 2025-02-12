<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		DropdownMenu,
		type DropdownMenuContentProps,
		type DropdownMenuRootProps,
		type WithoutChild
	} from 'bits-ui';
	import type { Snippet } from 'svelte';
	import SnippetOrString from '../svelte-specific/SnippetOrString.svelte';

	type Props = DropdownMenuRootProps & {
		items: (Snippet | string)[];
		contentProps?: WithoutChild<DropdownMenuContentProps>;
	};

	let { open = $bindable(false), children, items, contentProps, ...restProps }: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger class="flex align-middle justify-center w-full">
		<Icon icon="mdi:menu" width={24} />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content {...contentProps}>
			<DropdownMenu.Group aria-label="actions" class="card bg-surface-200-800 py-4">
				{#each items as item}
					<DropdownMenu.Item closeOnSelect={false}>
						<SnippetOrString children={item} />
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
