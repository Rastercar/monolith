<script lang="ts">
	import { apiGetAccessLevelsQuery } from '$lib/api/access-level.queries';
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import Icon from '@iconify/svelte';
	import { Combobox } from 'bits-ui';
	import { useDebounce } from 'runed';

	// TODO: THIS COMPONENT IS DUPLICATED !
	// create a base component that takes a query
	// as a prop and make the input and output generic ?
	//
	// maybe even make a cool wraper to work with superforms, that would be bonkers
	//
	// TODO: also test if this works any good by having the initial value set
	// eg loading a update form

	interface Props {
		/**
		 * ID (as a string) of the selected access level
		 */
		value: string;

		/**
		 * Value of the searchbox
		 */
		searchValue: string;

		onItemSelected: (_: AccessLevel | null) => void;
	}

	let { value = $bindable(), searchValue = $bindable(), onItemSelected }: Props = $props();

	const query = $derived(
		apiGetAccessLevelsQuery({ page: 1, pageSize: 100 }, { name: searchValue })
	);

	const searchWithDebounce = useDebounce((v: string) => (searchValue = v), 200);
</script>

<Combobox.Root
	bind:value
	type="single"
	allowDeselect
	onValueChange={(e) => {
		if (!e) return onItemSelected(null);

		const id = parseInt(e);

		const item = (query.data?.records ?? []).find((i) => i.id === id);
		onItemSelected(item ?? null);
	}}
>
	<div class="relative">
		<Combobox.Input
			class="input"
			placeholder="search by name"
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
			<Icon icon="mdi:caret-down" height={28} />
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
				{#each query.data?.records ?? [] as accessLevel, i (i + accessLevel.id)}
					<Combobox.Item
						class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 type-scale-2 data-[highlighted]:bg-surface-300-700"
						value={accessLevel.id.toString()}
						label={accessLevel.name}
					>
						{#snippet children({ selected })}
							<div class="flex justify-between w-full">
								{accessLevel.name}

								<div class="badge variant-filled-primary ml-8">
									{accessLevel?.permissions?.length ?? 0} permissions
								</div>
							</div>
						{/snippet}
					</Combobox.Item>
				{:else}
					<span class="block px-5 py-2 text-sm text-muted-foreground">
						No results found, try again.
					</span>
				{/each}
			</Combobox.Viewport>

			<Combobox.ScrollDownButton class="flex justify-center bg-surface-200-800">
				<Icon icon="mdi:caret-down" height={32} />
			</Combobox.ScrollDownButton>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
