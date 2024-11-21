<script lang="ts">
	import { authStore } from '$lib/store/auth.svelte';
	import Icon from '@iconify/svelte';
	import {
		arrow,
		autoUpdate,
		flip,
		FloatingArrow,
		offset,
		useClick,
		useDismiss,
		useFloating,
		useInteractions,
		useRole
	} from '@skeletonlabs/floating-ui-svelte';
	import { fade } from 'svelte/transition';
	import UserDisplay from './UserDisplay.svelte';

	const { user } = authStore.getValue();

	// State
	let open = $state(false);
	let elemArrow: HTMLElement | null = $state(null);

	// Use Floating
	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => (open = v),
		placement: 'top',
		get middleware() {
			return [offset(10), flip(), elemArrow && arrow({ element: elemArrow })];
		}
	});

	// Interactions
	const role = useRole(floating.context);
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, click, dismiss]);
</script>

<!-- Reference Element -->
<button
	bind:this={floating.elements.reference}
	{...interactions.getReferenceProps()}
	class="btn-gradient"
>
	Click Me
</button>

<!-- Floating Element -->
{#if floating.open}
	<div
		bind:this={floating.elements.floating}
		style={floating.floatingStyles}
		{...interactions.getFloatingProps()}
		class="floating popover-neutral bg-red-100"
		transition:fade={{ duration: 200 }}
	>
		<p>
			You can press the <kbd class="kbd">esc</kbd> key or click outside to
			<strong>*dismiss*</strong> this floating element.
		</p>
		<FloatingArrow bind:ref={elemArrow} context={floating.context} fill="#575969" />
	</div>
{/if}

{#if user}
	<!-- 
		use:popup={{
			event: 'click',
			target: 'theme',
			closeQuery: 'a[href]',
			placement: 'bottom-end',
			middleware: { offset: { mainAxis: 10, alignmentAxis: 16 } }
		}} 
	-->
	<button class="btn hover:variant-filled-primary">
		<Icon icon="mdi:user" width="32" height="32" />
	</button>

	<div class="card p-4 w-60 shadow-xl !z-50" data-popup="theme">
		<UserDisplay />

		<hr class="mt-3 mb-4" />

		<div class="flex justify-end">
			<a href="/auth/sign-out" class="btn variant-filled-secondary btn-sm">Sign Out</a>
		</div>
	</div>
{/if}
