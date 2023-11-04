<script lang="ts">
	import Stepper from '$lib/components/stepper/Stepper.svelte';
	import { Step } from '@skeletonlabs/skeleton';
</script>

<div class="p-6 max-w-3xl mx-auto">
	<Stepper>
		<Step>1!</Step>
		<Step>2!</Step>
		<Step>3!</Step>
		<Step>4!</Step>
	</Stepper>
</div>
