<script lang="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let href: string;
</script>

<div class="text-center mb-2 flex items-center">
	<div class="text-2xl flex items-center">
		<Icon icon="mdi:check" class="mr-3" />
		{title}
	</div>
	<a {href} class="ml-auto font-medium text-blue-600 dark:text-blue-500 hover:underline">
		go back
	</a>
</div>
