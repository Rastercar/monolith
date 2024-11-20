<script lang="ts">
	import { apiUpdateOrganization } from '$lib/api/organization';
	import {
		updateOrganizationSchema,
		type UpdateOrganizationBody
	} from '$lib/api/organization.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { authStore } from '$lib/store/auth.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const toaster = getToaster();

	const form = superForm(data.form, { validators: zodClient(updateOrganizationSchema) });

	const mutation = createMutation({
		mutationFn: (body: UpdateOrganizationBody) => apiUpdateOrganization(body),

		onSuccess: (updatedOrg) => {
			authStore.updateUserOrg(updatedOrg);
			toaster.success('organization updated successfully');
		},

		onError: () => toaster.error()
	});

	const updateOrg = async () => {
		const validated = await form.validateForm();

		if (!validated.valid) {
			form.restore({ ...validated, tainted: undefined });
			return;
		}

		$mutation.mutate(validated.data);
	};

	onMount(() => {
		if (!user) return;

		const { name, billingEmail } = user.organization;

		form.form.set({ name, billingEmail });
	});

	let { user } = $derived($authStore);
</script>

<h1 class="text-2xl mb-3">My Organization</h1>

<div class="grid grid-cols-2 gap-4 my-4">
	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		field="billingEmail"
		label="Billing Email"
	/>

	<TextInput
		{form}
		class="label sm:col-span-1 col-span-2"
		maxlength="32"
		field="name"
		label="Name"
	/>

	{#if user && !user.organization.billingEmailVerified}
		<div class="mt-2 col-span-2">
			<EmailNotConfirmedWarning sendConfirmationEmailTo="organization" />
		</div>
	{/if}
</div>

<div class="flex justify-end">
	<LoadableButton
		class="btn variant-filled-primary"
		isLoading={$mutation.isPending}
		on:click={updateOrg}
	>
		update
	</LoadableButton>
</div>
