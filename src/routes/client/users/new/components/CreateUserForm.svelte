<script lang="ts">
	import { apiCreateUser } from '$lib/api/user';
	import { createUserSchema, type CreateUserBody } from '$lib/api/user.schema';
	import { isErrorResponseWithErrorCode } from '$lib/api/utils';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { EMAIL_IN_USE, USERNAME_IN_USE } from '$lib/constants/error-codes';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SelectAccessLevelInput from '$lib/components/non-generic/input/SelectAccessLevelInput.svelte';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';
	import type { AccessLevel } from '$lib/api/access-level.schema';

	export let formSchema: SuperValidated<Infer<typeof createUserSchema>>;

	let selectedAccessLevel: null | AccessLevel = null;

	const form = superForm(formSchema, { validators: zodClient(createUserSchema) });

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: (b: CreateUserBody) => apiCreateUser(b),

		onSuccess: () => {
			selectedAccessLevel = null;
			toaster.success('User created successfully');
		},

		onError: (e) => {
			if (isErrorResponseWithErrorCode(e, EMAIL_IN_USE)) {
				form.validate('email', { value: '', errors: 'email in use', update: 'errors' });
				return;
			}

			if (isErrorResponseWithErrorCode(e, USERNAME_IN_USE)) {
				form.validate('username', { value: '', errors: 'username in use', update: 'errors' });
				return;
			}

			toaster.error();
		}
	});

	const createUser = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		await $mutation.mutateAsync(validated.data);
		form.reset();
	};

	$: ({ form: f } = form);
</script>

<div class="grid grid-cols-2 gap-4 mb-4">
	<TextInput {form} field="email" label="Email" placeholder="email address" class="label" />

	<TextInput {form} field="username" label="Username" placeholder="username" class="label" />

	<PasswordInput {form} field="password" class="label" />

	<PasswordInput
		{form}
		label="Confirm Password"
		placeholder="Confirm Password"
		field="passwordConfirmation"
		class="label"
	/>

	<TextArea
		{form}
		field="description"
		label="Description / Bio"
		placeholder="description"
		class="label col-span-2"
	/>
</div>

<span class="mb-1 block">User Access Level</span>
<SelectAccessLevelInput
	on:item-selected={(e) => {
		$f.accessLevelId = e.detail.id;
		selectedAccessLevel = e.detail;
	}}
/>

{#if selectedAccessLevel}
	<span class="block mt-4 text-lg">
		New Access Level: {selectedAccessLevel.name}
	</span>

	<p class="opacity-90 text-sm line-clamp-4 my-2">
		{selectedAccessLevel.description}
	</p>

	<hr class="my-4" />

	<AccessLevelPermissionsInfo accessLevel={selectedAccessLevel} />
{/if}

<div class="flex justify-end mt-4">
	<LoadableButton
		disabled={!selectedAccessLevel}
		class="btn variant-filled-primary"
		isLoading={$mutation.isPending}
		on:click={createUser}
	>
		create user
	</LoadableButton>
</div>
