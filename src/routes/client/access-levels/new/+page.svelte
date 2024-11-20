<script lang="ts">
	import { apiCreateAccessLevel } from '$lib/api/access-level';
	import {
		createAccessLevelSchema,
		type CreateAccessLevelBody
	} from '$lib/api/access-level.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import AccessLevelPermissionTogglers from '$lib/components/non-generic/form/AccessLevelPermissionTogglers.svelte';
	import { permissionDetails, type apiPermission } from '$lib/constants/permissions';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const form = superForm(data.createAccessLevelForm, {
		validators: zodClient(createAccessLevelSchema)
	});

	const toaster = getToaster();

	/**
	 * key: permission key (eg: CREATE_USER)
	 * val: boolean indicating the permission is selected
	 */
	const permissionToToggleStatus = $state(Object.keys(permissionDetails).reduce(
		(acc, v) => ({ ...acc, [v]: false }),
		{}
	) as Record<apiPermission, boolean>);

	const mutation = createMutation({
		mutationFn: (b: CreateAccessLevelBody) => apiCreateAccessLevel(b),
		onError: () => toaster.error()
	});

	const createAccessLevel = async () => {
		const validated = await form.validateForm();
		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		const selectedPermissions = Object.entries(permissionToToggleStatus)
			.filter(([_, toggled]) => toggled)
			.map(([permission]) => permission);

		const requestBody = { ...validated.data, permissions: selectedPermissions };

		$mutation.mutateAsync(requestBody).then(() => {
			form.reset();
			toaster.success('Access level created');
			Object.keys(permissionToToggleStatus).forEach((key) => {
				permissionToToggleStatus[key as apiPermission] = false;
			});
		});
	};

	let { allErrors } = $derived(form);

	let canSubmit = $derived($allErrors.length === 0);
</script>

<PermissionGuard requiredPermissions={['MANAGE_USER_ACCESS_LEVELS']} />

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="create access level"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ href: '/client/access-levels', icon: 'mdi:shield', text: 'access levels' },
			{ href: '/client/access-levels/new', text: 'new' }
		]}
	/>

	<hr class="my-4" />

	<TextInput field="name" label="Name" {form} />

	<TextArea field="description" label="Description" {form} />

	<AccessLevelPermissionTogglers {permissionToToggleStatus} />

	<div class="flex justify-end mt-4">
		<LoadableButton
			isLoading={false}
			disabled={!canSubmit}
			class="btn variant-filled-primary ml-auto mt-auto"
			on:click={createAccessLevel}
		>
			create access level
		</LoadableButton>
	</div>
</div>
