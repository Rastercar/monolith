<script lang="ts">
	import { apiGetAccessLevels } from '$lib/api/access-level';
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import ServerSideSelectInput from '$lib/components/input/ServerSideSelectInput.svelte';

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

	const queryFn = () =>
		apiGetAccessLevels({ pagination, filters: { name: searchValue } }).then((data) =>
			data.records.map((i) => ({ label: i.name, value: i.id.toString(), original: i }))
		);

	const pagination = { page: 1, pageSize: 100 };
	const queryKey = (searchValue: string) => ['access-levels', pagination, searchValue];
</script>

<ServerSideSelectInput
	bind:value
	bind:searchValue
	{queryFn}
	{queryKey}
	onItemSelected={(i) => onItemSelected(i?.original ?? null)}
/>
