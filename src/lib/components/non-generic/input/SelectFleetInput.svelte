<script lang="ts">
	import { apiGetFleetsAsSelectOptionsQuery } from '$lib/api/fleet.queries';
	import type { Fleet } from '$lib/api/fleet.schema';
	import ServerSideSelectInput from '$lib/components/input/ServerSideSelectInput.svelte';

	interface Props {
		value: string;
		searchValue: string;
		onItemSelected: (_: Fleet | null) => void;
	}

	let { value = $bindable(), searchValue = $bindable(), onItemSelected }: Props = $props();

	const query = apiGetFleetsAsSelectOptionsQuery(searchValue);
</script>

<ServerSideSelectInput
	bind:value
	bind:searchValue
	{query}
	onItemSelected={(i) => onItemSelected(i?.original ?? null)}
/>
