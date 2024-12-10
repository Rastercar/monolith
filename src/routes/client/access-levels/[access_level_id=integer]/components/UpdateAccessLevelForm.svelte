<script lang="ts">
	import { apiUpdateAccessLevel } from '$lib/api/access-level';
	import {
		updateAccessLevelSchema,
		type AccessLevel,
		type UpdateAccessLevelBody
	} from '$lib/api/access-level.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import ManageAccessLevelsPermissionSelectedAlert from '$lib/components/non-generic/alert/ManageAccessLevelsPermissionSelectedAlert.svelte';
	import AccessLevelPermissionTogglers from '$lib/components/non-generic/form/AccessLevelPermissionTogglers.svelte';
	import { permissionDetails, type permission } from '$lib/constants/permissions';
	import { type ModalSettinpermissionkeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		accessLevel: AccessLevel;
		formSchema: SuperValidated<Infer<typeof updateAccessLevelSchema>>;
	}

	let { accessLevel, formSchema }: Props = $props();

	let accessLevelInitiallyCouldManageUserAccessLevelsPermission = $state(false);

	const form = superForm(formSchema, { validators: zodClient(updateAccessLevelSchema) });

	const toaster = getToaster();

	/**
	 * key: permission key (eg: CREATE_USER)
	 * val: boolean indicating the permission is selected
	 */
	const permissionToToggleStatus = $state(
		Object.keys(permissionDetails).reduce((acc, v) => ({ ...acc, [v]: false }), {}) as Record<
			apiPermission,
			boolean
		>
	);

	const setPermissionsToggleStatusToTrue = (permissions: string[]) => {
		permissions.forEach((p) => {
			permissionToToggleStatus[p as permission] = true;
		});
	};

	const mutation = createMutation({
		mutationFn: (b: UpdateAccessLevelBody) => apiUpdateAccessLevel(accessLevel.id, b),
		onError: () => toaster.error()
	});

	const dispatch = createEventDispatcher<{ 'access-level-updated': AccessLevel }>();
permission
	const openConfirmationModal = () => {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Confirm changes to access level',
			body: 'All users within this access level will have their permissions changed, do you wish to proceed ?',
			response: (confirmed: boolean) => {
				if (conpermissioneAccessLevel();
			}
		};

		modalStore.trigger(modal);
	};

	const updateAccessLevel = async () => {
		const validated = await form.validateForm();
		if (!validated.valid) return form.restore({ ...validated, tainted: undefined });

		const selectedPermissions = Object.entries(permissionToToggleStatus)
			.filter(([_, toggled]) => toggled)
			.map(([permission]) => permission);

		const requestBody = { ...validated.data, permissions: selectedPermissions };

		$mutation.mutateAsync(requestBody).then((updatedAccessLevel) => {
			resetForm(updatedAccessLevel);
			dispatch('access-level-updated', updatedAccessLevel);
		});
	};

	const resetForm = (formData: AccessLevel) => {
		form.reset({ data: { name: formData.name, description: formData.description } });
		setPermissionsToggleStatusToTrue(formData.permissions);
	};

	onMount(() => {
		resetForm(accessLevel);
		accessLevelInitiallyCouldManageUserAccessLevelsPermission =
			permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS'];
	});

	let { allErrors } = $derived(form);

	let canSubmit = $derived($allErrors.length === 0);
</script>

<TextInput field="name" label="Name" {form} />

<TextArea field="description" label="Description" {form} />

<AccessLevelPermissionTogglers
	{permissionToToggleStatus}
	showManageUserAccessLevelsWarningIfToggled={!accessLevelInitiallyCouldManageUserAccessLevelsPermission}
/>

{#if !accessLevelInitiallyCouldManageUserAccessLevelsPermission && permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS']}
	<ManageAccessLevelsPermissionSelectedAlert
		on:undo-clicked={() => (permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS'] = false)}
	/>
{/if}

<div class="flex justify-end mt-4">
	<LoadableButton
		isLoading={false}
		disabled={!canSubmit}
		class="btn variant-filled-primary ml-auto mt-auto"
		on:click={openConfirmationModal}
	>
		save
	</LoadableButton>
</div>
