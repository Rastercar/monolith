<script lang="ts">
	import { apiGetAccessLevels, type GetAccessLevelsFilters } from '$lib/api/access-level';
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import AutoComplete from '$lib/components/input/AutoComplete.svelte';
	import { popup, type AutocompleteOption } from '@skeletonlabs/skeleton';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import { derived, writable } from 'svelte/store';

	type option = AutocompleteOption<string, { original: AccessLevel }>;

	let debounceTimer: ReturnType<typeof setTimeout>;

	const pagination = writable({ page: 1, pageSize: 100 });
	const filters = writable<GetAccessLevelsFilters>({});

	const dispatch = createEventDispatcher<{ 'item-selected': AccessLevel }>();

	const onSelected = (e: CustomEvent<option>) => {
		if (e.detail.meta) dispatch('item-selected', e.detail.meta.original);
	};

	const query = createQuery(
		derived([pagination, filters], ([$pagination, $filters]) => ({
			queryKey: ['access-levels', $pagination, $filters],
			placeholderData: keepPreviousData,
			queryFn: async (): Promise<option[]> => {
				const { records } = await apiGetAccessLevels({
					pagination: $pagination,
					filters: $filters
				});

				return records.map((accessLevel) => ({
					label: accessLevel.name,
					value: accessLevel.id.toString(),
					meta: { original: accessLevel }
				}));
			}
		}))
	);

	const debounce = (v: string) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => ($filters.name = v), 200);
	};

	let { data: accessLevels } = $derived($query);
</script>

<input
	class="input autocomplete mb-1"
	type="search"
	name="autocomplete-search"
	placeholder="Search by mame"
	onkeyup={(e) => debounce(e.currentTarget.value)}
	use:popup={{
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom-start'
	}}
/>

<div data-popup="popupAutocomplete" class="card max-h-48 p-0 overflow-y-auto z-10">
	<AutoComplete bind:input={$filters.name} options={accessLevels ?? []} on:selection={onSelected}>
		{#snippet option({ option })}
				<div   class="flex justify-between w-full">
				{option.label}

				<div class="badge variant-filled-primary ml-8">
					{option.meta?.original.permissions.length ?? 0} permissions
				</div>
			</div>
			{/snippet}
	</AutoComplete>
</div>
