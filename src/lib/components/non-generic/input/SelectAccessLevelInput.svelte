<script lang="ts">
	import { apiGetAccessLevels } from '$lib/api/access-level';
	import type { AccessLevel, GetAccessLevelFilters } from '$lib/api/access-level.schema';
	import Icon from '@iconify/svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import { Combobox } from 'bits-ui';

	interface Props {
		/**
		 * ID (as a string) of the selected access level
		 */
		value: string;

		onItemSelected: (_: AccessLevel | null) => void;
	}

	let { value = $bindable(), onItemSelected }: Props = $props();

	interface Option<T = undefined> {
		label: string;
		value: string;
		meta: T;
	}

	let debounceTimer: ReturnType<typeof setTimeout>;

	const pagination = $state({ page: 1, pageSize: 100 });
	const filters = $state<GetAccessLevelFilters>({});

	const query = createQuery(() => ({
		queryKey: ['access-levels', pagination, filters],
		placeholderData: keepPreviousData,
		queryFn: async (): Promise<Option<AccessLevel>[]> => {
			const { records } = await apiGetAccessLevels({ pagination, filters });

			return records.map((accessLevel) => ({
				label: accessLevel.name,
				value: accessLevel.id.toString(),
				meta: accessLevel
			}));
		}
	}));

	const debounce = (v: string) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => (filters.name = v), 200);
	};
</script>

<Combobox.Root
	bind:value
	type="single"
	allowDeselect
	controlledValue
	onValueChange={(e) => {
		if (!e) return onItemSelected(null);

		const id = parseInt(e);

		const item = query.data?.find((i) => i.meta.id === id);
		onItemSelected(item?.meta ?? null);
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

				debounce(v);
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
				{#each query?.data ?? [] as option, i (i + option.value)}
					<Combobox.Item
						class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 type-scale-2 data-[highlighted]:bg-surface-300-700"
						value={option.value}
						label={option.label}
					>
						{#snippet children({ selected })}
							<div class="flex justify-between w-full">
								{option.label}

								<div class="badge variant-filled-primary ml-8">
									{option.meta?.permissions.length ?? 0} permissions
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
