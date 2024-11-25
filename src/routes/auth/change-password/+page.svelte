<script lang="ts">
	import { goto } from '$app/navigation';
	import { recoverPasswordByTokenSchema } from '$lib/api/auth.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordField from '$lib/components/form/PasswordField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import AuthRedirectLink from '../components/AuthRedirectLink.svelte';

	let { data } = $props();

	const form = superForm(data.form, { validators: zodClient(recoverPasswordByTokenSchema) });
	const { message, delayed: isLoading, form: f } = form;

	const formStatus = $derived($message ? $message.type : 'not-sent');
	const formErrorCode = $derived($message?.code);
	const formErrorMsg = $derived($message?.text);

	onMount(() => {
		$f.token = data.passwordRecoveryToken;
	});
</script>

<div class="h-full flex justify-center px-6 bg-surface-100-900">
	<div class="w-96">
		{#if formStatus === 'not-sent'}
			<h1 class="mb-4 text-center h2 mt-12">Change Password</h1>

			<form action={route('changePassword /auth/change-password')} method="POST" use:form.enhance>
				<TextField {form} label="token" name="token" labelExtraClasses="hidden" class="hidden" />

				<PasswordField {form} label="New Password" name="newPassword" />

				<PasswordField
					{form}
					label="Confirm new password"
					name="passwordConfirmation"
					labelExtraClasses="mt-4"
				/>

				<LoadableButton
					isLoading={$isLoading}
					classes="btn preset-filled-primary-300-700 mt-4 w-full"
				>
					change password
				</LoadableButton>

				<AuthRedirectLink linkLabel="go back" href="/client" question="False alert?" />
			</form>
		{:else if formStatus === 'error'}
			<aside class="preset-filled-error-100-900 p-4 rounded mt-4 mb-2">
				<div class="flex items-center space-x-4 mb-4">
					<Icon icon="mdi:alert" width="32" height="32" />

					<p>
						{formErrorMsg ?? 'A unknown error happened'}
					</p>
				</div>

				{#if formErrorCode === 'ERR_TOKEN_NOT_FOUND'}
					<span class="text-sm">
						Please
						<a
							href={route('/auth/recover-password')}
							class="text-primary-700-300 underline-offset-4 hover:underline"
						>
							follow this link
						</a>
						to recover your password
					</span>
				{/if}
			</aside>
		{:else if formStatus === 'success'}
			<div class="flex flex-col">
				<h1 class="mb-4 text-center h2 mt-12">password changed successfully !</h1>

				<button
					class="btn preset-filled-primary-300-700 mt-4 mx-auto flex items-center"
					onclick={() => goto(route('/client'))}
				>
					go to home page
					<Icon icon="mdi:home" />
				</button>
			</div>
		{/if}
	</div>
</div>
