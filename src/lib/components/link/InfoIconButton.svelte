<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		href: string;
	}

	let { href }: Props = $props();
</script>

<a {href}>
	<button class="btn rounded-none hover:bg-surface-200-800 w-full justify-start">
		<Icon icon="mdi:info" /> Info
	</button>
</a>
