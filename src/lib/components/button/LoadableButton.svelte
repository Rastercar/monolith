<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let isLoading: boolean;
	export let disabled = false;

	let clazz: string = '';
	export { clazz as class };

	export let contentWrapperClasses = '!mx-0';
</script>

<button class={`${clazz} relative`} disabled={isLoading || disabled} on:click>
	<div
		class:invisible={!isLoading}
		class="absolute top-0 left-0 w-full h-full flex align-middle justify-center items-center"
	>
		<ProgressRadial value={undefined} width="w-6" />
	</div>

	<div class:invisible={isLoading} class={contentWrapperClasses}>
		<slot />
	</div>
</button>
