<script lang="ts">
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import Icon from '@iconify/svelte';
	import { popup } from '@skeletonlabs/skeleton';

	export let idx: number;
	export let email: string;
	export let verified: boolean;
</script>

<div class="flex items-center">
	<div
		use:popup={{ event: 'hover', target: `emailVerificationStatusPopup-${idx}`, placement: 'top' }}
		class="mr-2"
	>
		<Icon
			icon={verified ? 'mdi:check' : 'mdi:times'}
			class={verified ? 'text-success-500' : 'text-error-500'}
		/>
	</div>

	{email}
</div>

<ArrowUpTooltip dataPopup={`emailVerificationStatusPopup-${idx}`}>
	{verified ? 'email verified' : 'verification pending'}
</ArrowUpTooltip>
