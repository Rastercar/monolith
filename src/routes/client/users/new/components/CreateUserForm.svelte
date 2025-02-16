<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import { createUserSchema, type SimpleUser } from '$lib/api/user.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import CheckboxField from '$lib/components/form/CheckboxField.svelte';
	import PasswordField from '$lib/components/form/PasswordField.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../$types';
	import SelectAccessLevelInput from './SelectAccessLevelInput.svelte';

	interface Props {
		formSchema: SuperValidated<Infer<typeof createUserSchema>>;
		onCreate?: (_: SimpleUser) => void;
	}

	let { formSchema, onCreate }: Props = $props();

	let selectedAccessLevel: null | AccessLevel = $state(null);
	let selectAccessLevelSearchValue = $state('');

	const sForm = superForm(formSchema, {
		dataType: 'json',
		validators: zodClient(createUserSchema),
		onUpdate: ({ form, result }) => {
			if (form.valid) {
				const action = result.data as FormResult<ActionData>;

				selectedAccessLevel = null;
				selectAccessLevelSearchValue = '';

				if (onCreate && action.createdUser) onCreate(action.createdUser);
			}
		},
		onError: showErrorToast
	});
	const { form, submitting: isLoading, errors } = sForm;
</script>

<form method="POST" action={route('createUser /client/users/new')} use:sForm.enhance>
	<div class="grid grid-cols-2 gap-4 mb-4">
		<TextField form={sForm} name="email" label="Email" placeholder="email address" />

		<TextField form={sForm} name="username" label="Username" placeholder="username" />

		<PasswordField form={sForm} name="password" label="Password" />

		<PasswordField
			form={sForm}
			label="Confirm Password"
			placeholder="Confirm Password"
			name="passwordConfirmation"
		/>

		<CheckboxField
			form={sForm}
			classes="col-span-2 mb-2"
			label="Force password change on first sign in"
			name="setPasswordChangeOnFirstSignIn"
		/>

		<TextAreaField
			form={sForm}
			name="description"
			label="Description / Bio"
			placeholder="description"
			classes="col-span-2"
		/>
	</div>

	<span class="mb-2 block">User Access Level</span>
	<SelectAccessLevelInput
		bind:searchValue={selectAccessLevelSearchValue}
		value={selectedAccessLevel?.id.toString() ?? ''}
		onItemSelected={(e) => {
			if (e) {
				$form.accessLevelId = e.id;
				selectedAccessLevel = e;
			} else {
				$form.accessLevelId = 0;
				selectedAccessLevel = null;
			}
		}}
	/>

	{#if $errors.accessLevelId}
		<span class="block text-error-700-300 mt-2">{$errors.accessLevelId}</span>
	{/if}

	{#if selectedAccessLevel}
		<span class="block mt-4 text-lg">
			New Access Level: {selectedAccessLevel.name}
		</span>

		<p class="opacity-90 line-clamp-4 my-2">
			{selectedAccessLevel.description}
		</p>

		<hr class="hr my-4" />

		<AccessLevelPermissionsInfo accessLevel={selectedAccessLevel} />
	{/if}

	<div class="flex justify-end mt-4">
		<LoadableButton classes="btn preset-filled-primary-200-800" isLoading={$isLoading}>
			create user
		</LoadableButton>
	</div>
</form>
