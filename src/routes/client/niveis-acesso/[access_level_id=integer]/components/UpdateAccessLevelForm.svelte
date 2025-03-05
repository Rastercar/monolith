<script lang="ts">
	import { updateAccessLevelSchema, type AccessLevel } from '$lib/api/access-level.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import AccessLevelPermissionTogglers from '$lib/components/non-generic/form/AccessLevelPermissionTogglers.svelte';
	import { permissionDetails, type permission } from '$lib/constants/permissions';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import { onMount } from 'svelte';
	import type { FormResult, Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData } from '../$types';

	interface Props {
		formSchema: SuperValidated<Infer<typeof updateAccessLevelSchema>>;
		accessLevel: AccessLevel;
		onUpdate: (_: AccessLevel) => void;
	}

	let { accessLevel, formSchema, onUpdate }: Props = $props();

	const getPermissionsToToggleMapFromAccessLevel = () =>
		Object.keys(permissionDetails).reduce(
			(acc, v) => ({ ...acc, [v]: (accessLevel.permissions ?? []).includes(v as permission) }),
			{}
		) as Record<permission, boolean>;

	/**
	 * key: permission key (eg: CREATE_USER)
	 * val: boolean indicating the permission is selected
	 */
	const permissionToToggleStatus = $state(getPermissionsToToggleMapFromAccessLevel());

	let accessLevelInitiallyCouldManageUserAccessLevelsPermission = $state(
		permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS']
	);

	const sForm = superForm(formSchema, {
		validators: zodClient(updateAccessLevelSchema),
		dataType: 'json',
		onSubmit({ jsonData, cancel }) {
			const ok = confirm(
				'os usuários com esse nível de acesso terão as novas permissões, prosseguir?'
			);
			if (!ok) return cancel();

			const selectedPermissions = Object.entries(permissionToToggleStatus)
				.filter(([_, toggled]) => toggled)
				.map(([permission]) => permission);

			jsonData({ ...$form, permissions: selectedPermissions });
		},
		onUpdate: ({ form, result }) => {
			if (form.valid && result.type === 'success') {
				showSuccessToast('nível de acesso atualizado');
				const action = result.data as FormResult<ActionData>;
				if (form.valid && action.updatedAccessLevel) onUpdate(action.updatedAccessLevel);
			}
		}
	});
	const { form, submitting: isLoading } = sForm;

	onMount(() => {
		accessLevelInitiallyCouldManageUserAccessLevelsPermission =
			permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS'];
	});
</script>

<form
	method="POST"
	datatype="json"
	action={route('updateAccessLevel /client/niveis-acesso/[access_level_id=integer]', {
		access_level_id: accessLevel.id.toString()
	})}
	use:sForm.enhance
>
	<TextField name="name" label="Nome" form={sForm} />

	<TextAreaField name="description" label="Descrição" form={sForm} />

	<AccessLevelPermissionTogglers
		{permissionToToggleStatus}
		showManageUserAccessLevelsWarningIfToggled={!accessLevelInitiallyCouldManageUserAccessLevelsPermission}
	/>

	<div class="flex justify-end mt-4">
		<LoadableButton isLoading={$isLoading} classes="btn preset-filled-primary-200-800 mt-auto">
			atualizar
		</LoadableButton>
	</div>
</form>
