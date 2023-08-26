<script lang="ts">
	import Icon from '@iconify/svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<!-- TODO: finish this page -->
<div class="flex min-h-screen">
	<div
		class="relative hidden w-0 flex-1 items-center justify-center lg:flex lg:w-3/5 border-2 border-blue-500"
	>
		<div class="mx-auto w-full h-full flex items-center justify-center max-w-4xl">
			<img src="/img/login-page-bg.svg" alt="login-page-background" class="max-w-xl mx-auto" />
		</div>
	</div>

	<div
		class="bg-surface-200-700-token relative flex flex-1 flex-col justify-center px-6 py-12 lg:w-2/5 lg:flex-none border-2 border-red-500"
	>
		<div class="relative mx-auto w-full max-w-sm">
			<div class="flex w-full items-center justify-between">
				<div>
					<Icon icon="mdi:keyboard-backspace" class="text-2xl" />
					xdd
				</div>
				<LightSwitch />
			</div>
		</div>
	</div>
</div>
