<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle: string;
		children: Snippet;
	}

	const { title, subtitle, children }: Props = $props();
</script>

<div class="flex min-h-screen">
	<div
		class="bg-surface-50-950 relative hidden w-0 flex-1 items-center justify-center lg:flex lg:w-3/5"
	>
		<div class="mx-auto w-full h-full flex items-center justify-center max-w-4xl">
			<img src="/img/login-page-bg.svg" alt="login-page-background" class="max-w-xl mx-auto" />
		</div>
	</div>

	<div
		class="bg-surface-100-900 relative flex flex-1 flex-col justify-center px-6 py-12 lg:w-2/5 lg:flex-none"
	>
		<div class="relative mx-auto w-full max-w-sm">
			<div class="flex w-full items-center justify-between">
				<a href="/" type="button" class="btn hover:text-primary-600-300 px-0">
					<Icon icon="mdi:keyboard-backspace" />
					<span>Back to Home</span>
				</a>
			</div>

			<h2 class="font-heading text-3xl font-medium mt-6">{title}</h2>
			<p class="font-alt text-sm font-normal mb-6">{subtitle}</p>

			<hr class="border-t-2 my-6" />

			{@render children()}
		</div>
	</div>
</div>
