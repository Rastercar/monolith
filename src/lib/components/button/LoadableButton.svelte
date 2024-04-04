<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let isLoading: boolean;
	export let disabled = false;

	export let loaderWidth = 'w-6';

	export let contentWrapperClasses = '!mx-0';

	let clazz = '';
	export { clazz as class };
</script>

<button class={`${clazz} relative`} disabled={isLoading || disabled} on:click>
	<div
		class:invisible={!isLoading}
		class="absolute top-0 left-0 w-full h-full flex align-middle justify-center items-center"
	>
		<ProgressRadial value={undefined} width={loaderWidth} />
	</div>

	<div class:invisible={isLoading} class={contentWrapperClasses}>
		<slot />
	</div>
</button>
