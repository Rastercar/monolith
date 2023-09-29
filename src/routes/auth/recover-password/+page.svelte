<script lang="ts">
	import TextInput from '$lib/components/input/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const recoverForm = superForm(data.form);

	const title = form?.success ? 'Success !' : 'Recover Password';

	const subtitle = form?.success
		? 'Follow the instructions sent to your email address'
		: 'Inform your account email address to receive password recovery instructions';

	// TODO: server side validation, responses etc, check email exists (send and deal with EMAIL_NOT_FOUND response)
</script>

<div class="h-full flex justify-center">
	<div class="w-96">
		<h1 class="mb-1 text-center text-3xl mt-12">{title}</h1>
		<p class="text-sm text-center text-surface-600-300-token mb-4">
			{subtitle}
		</p>

		{#if form?.success}
			<a href="/" class="btn variant-filled mt-4 w-full">back to home</a>
		{:else}
			<form method="post">
				<TextInput
					form={recoverForm}
					field="email"
					label="Your account email"
					placeholder="email address"
				/>

				<button class="btn variant-filled-primary mt-4 w-full"> recover password </button>
			</form>

			<AuthRedirectLink linkLabel="sign-in" href="/auth/sign-in" question="False alert?" />
		{/if}
	</div>
</div>
