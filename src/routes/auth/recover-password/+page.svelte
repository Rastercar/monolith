<script lang="ts">
	import { isEmail, withMessage } from '$lib/utils/validators';
	import { LightSwitch, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore = getToastStore();

	const form = superForm(data.form, {
		validators: { email: withMessage(isEmail, 'invalid email') }
	});
	// TODO: server side validation, responses etc
</script>

<!-- TODO: rm me ! -->
<LightSwitch />

<div class="h-full flex justify-center">
	<div class="w-96 text-center">
		<h1 class="mb-1 text-3xl mt-12">Recover Password</h1>
		<span class="text-sm text-surface-600-300-token">
			Follow the instructions sent to your email address
		</span>

		<div class="flex justify-center p-4">apiGetCurrentUser</div>
	</div>
</div>
