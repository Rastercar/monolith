<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="h-full flex items-center justify-center">
	<div class="max-w-md">
		<h1 class="text-center text-4xl mb-4 font-mono">500 | Internal Error</h1>
		<p class="mb-6">{data.errorMessage}</p>

		<a href="/" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
			back to home
		</a>
	</div>
</div>
