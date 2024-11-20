<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		href: string;
	}

	let { href }: Props = $props();
</script>

<div class="flex align-middle justify-center">
	<a {href}>
		<button class="btn-icon">
			<Icon icon="mdi:info" width={24} />
		</button>
	</a>
</div>
