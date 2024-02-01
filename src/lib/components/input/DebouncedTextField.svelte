<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let debounceTimer: ReturnType<typeof setTimeout>;

	export let label: string;
	export let title: string;

	export let debounceMilliseconds = 250;

	let clazz = 'label';
	export { clazz as class };

	const debounce = (v: string) => {
		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {
			dispatch('change', v);
		}, debounceMilliseconds);
	};

	const dispatch = createEventDispatcher<{ change: string }>();
</script>

<label class={clazz}>
	<span>{label}</span>
	<input class="input" {title} type="text" on:keyup={(e) => debounce(e.currentTarget.value)} />
</label>
