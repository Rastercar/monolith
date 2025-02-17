<script lang="ts" generics="T">
	import Icon from '@iconify/svelte';
	import { type CreateQueryResult } from '@tanstack/svelte-query';
	import { Combobox } from 'bits-ui';
	import { useDebounce } from 'runed';

	interface Item<T> {
		label: string;
		value: string;
		original: T;
	}

	interface Props {
		/**
		 * ID (as a string) of the selected access level
		 */
		value: string;

		/**
		 * Value of the searchbox
		 */
		searchValue: string;

		query: CreateQueryResult<Item<T>[]>;

		onItemSelected: (_: Item<T> | null) => void;
	}

	let { value = $bindable(), searchValue = $bindable(), query, onItemSelected }: Props = $props();

	const queryData = $derived(query.data ?? []);

	const searchWithDebounce = useDebounce((v: string) => (searchValue = v), 200);
</script>

<Combobox.Root
	bind:value
	type="single"
	allowDeselect
	onValueChange={(e) => {
		if (!e) return onItemSelected(null);

		const item = queryData.find((i) => i.value === e);
		onItemSelected(item ?? null);
	}}
>
	<div class="relative">
		<Combobox.Input
			class="input"
			defaultValue={searchValue}
			placeholder="search by name"
			clearOnDeselect
			oninput={(e) => {
				const v = e.currentTarget.value;

				if (!v) {
					value = '';
					onItemSelected(null);
				}

				searchWithDebounce(v);
			}}
		/>

		<Combobox.Trigger class="absolute end-2 top-[8px]">
			<Icon
				icon={query.isPending ? 'mdi:loading' : 'mdi:caret-down'}
				class={`${query.isPending ? 'animate-spin' : ''}`}
				height={28}
			/>
		</Combobox.Trigger>
	</div>

	<Combobox.Portal>
		<Combobox.Content
			class="max-h-96 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] bg-surface-100-900 rounded"
			sideOffset={10}
		>
			<Combobox.ScrollUpButton class="flex justify-center bg-surface-200-800">
				<Icon icon="mdi:caret-up" height={32} />
			</Combobox.ScrollUpButton>

			<Combobox.Viewport>
				{#each queryData as item, i (i + item.value)}
					<Combobox.Item
						class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 type-scale-2 data-[highlighted]:bg-surface-300-700"
						value={item.value}
						label={item.label}
					>
						{#snippet children()}
							{item.label}
						{/snippet}
					</Combobox.Item>
				{:else}
					<span class="block px-5 py-2 text-sm text-muted-foreground">No items found.</span>
				{/each}
			</Combobox.Viewport>

			<Combobox.ScrollDownButton class="flex justify-center bg-surface-200-800">
				<Icon icon="mdi:caret-down" height={32} />
			</Combobox.ScrollDownButton>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
