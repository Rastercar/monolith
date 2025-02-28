/**
 * all posible rastercar permissions
 *
 * this gives or denies access to certain api endpoints / pages / components
 */
export type permission = (typeof permissions)[number];

export type permissionCategory =
	| 'user'
	| 'fleets'
	| 'access levels'
	| 'tracker'
	| 'veículo'
	| 'SIM card'
	| 'organization'
	| 'authentication';

export interface PermissionDetails {
	title: string;
	summary: string;
	category: permissionCategory;
	description: string;
}

export type PermissionDetailsAndKey = PermissionDetails & { key: permission };

type PermissionByCategory = Record<permissionCategory, PermissionDetailsAndKey[]>;

export const permissions = [
	'BLOCK_USER',
	'CREATE_USER',
	'DELETE_USER',
	'LOGOFF_USER',
	'LIST_USER_SESSIONS',
	'MANAGE_USER_ACCESS_LEVELS',
	//
	'CREATE_TRACKER',
	'UPDATE_TRACKER',
	'DELETE_TRACKER',
	//
	'CREATE_VEHICLE',
	'UPDATE_VEHICLE',
	'DELETE_VEHICLE',
	//
	'CREATE_FLEET',
	'UPDATE_FLEET',
	'DELETE_FLEET',
	//
	'DELETE_SIM_CARD',
	'UPDATE_SIM_CARD',
	'CREATE_SIM_CARD',
	//
	'UPDATE_ORGANIZATION'
] as const;

// the reason whe dont export permissions is because it would not be typed as
// permission[], and we cant type it as so due to cyclic refs, so we need this workaround
export const allPermissions = [...permissions] as permission[];

export const permissionCategoryIcons: Record<permissionCategory, string> = {
	user: 'mdi:user',
	authentication: 'mdi:lock',
	'access levels': 'mdi:shield',
	tracker: 'mdi:cellphone',
	veículo: 'mdi:car',
	'SIM card': 'mdi:sim',
	fleets: 'mdi:veículo-multiple',
	organization: 'mdi:building'
};

export const permissionDetails: Record<permission, PermissionDetails> = {
	UPDATE_FLEET: {
		title: 'Atualizar Frotas',
		summary: 'Atualizar',
		category: 'fleets',
		description: 'Permite atualizar frotas'
	},
	DELETE_FLEET: {
		title: 'Deletar Frotas',
		summary: 'Deletar',
		category: 'fleets',
		description: 'Permite deletar frotas'
	},
	CREATE_FLEET: {
		title: 'Cadastrar Frotas',
		summary: 'Cadastrar',
		category: 'fleets',
		description: 'Permite cadastrar frotas'
	},
	BLOCK_USER: {
		title: 'Bloquear Usuários',
		summary: 'Bloquear e desbloquear usuários',
		category: 'authentication',
		description: 'Bloquear usuários, deslogando-os e negando acesso até serem desbloquados'
	},
	MANAGE_USER_ACCESS_LEVELS: {
		title: 'Gerenciar Níveis de Acesso',
		summary: 'Gerenciar Níveis de Acesso',
		category: 'authentication',
		description: 'Gerenciar níveis de acesso de usuários e suas permissões'
	},
	LOGOFF_USER: {
		title: 'Deslogar Usuários',
		summary: 'Deslogar Usuários',
		category: 'authentication',
		description: 'Deletar sessões de outros usuários, deslogando-os'
	},
	LIST_USER_SESSIONS: {
		title: 'Visualizar Sessões',
		summary: 'Visualizar Sessões',
		category: 'authentication',
		description: 'Visualizar sessões de outros usuários'
	},
	//
	CREATE_USER: {
		title: 'Cadastrar Usuário',
		summary: 'Cadastrar',
		category: 'user',
		description: 'Permite cadastrar usuários'
	},
	DELETE_USER: {
		title: 'Deletar Usuário',
		summary: 'Deletar',
		category: 'user',
		description: 'Permite deletar usuários'
	},

	//
	CREATE_TRACKER: {
		title: 'Cadastrar Rastreador',
		summary: 'Cadastrar',
		category: 'tracker',
		description: 'Permite cadastrar rastreadores'
	},
	UPDATE_TRACKER: {
		title: 'Atualizar Rastreador',
		summary: 'Atualizar',
		category: 'tracker',
		description: 'Permite atualizar rastreadores'
	},
	DELETE_TRACKER: {
		title: 'Deletar Rastreador',
		summary: 'Deletar',
		category: 'tracker',
		description: 'Permite deletar rastreadores'
	},
	//
	CREATE_VEHICLE: {
		title: 'Cadastrar Veículo',
		summary: 'Cadastrar',
		category: 'veículo',
		description: 'Permite cadastrar veículos'
	},
	UPDATE_VEHICLE: {
		title: 'Atualizar Veículo',
		summary: 'Atualizar',
		category: 'veículo',
		description: 'Permite atualizar veículos'
	},
	DELETE_VEHICLE: {
		title: 'Deletar Veículo',
		summary: 'Deletar',
		category: 'veículo',
		description: 'Permite deletar veículos'
	},
	//
	CREATE_SIM_CARD: {
		title: 'Cadastrar Cartão SIM',
		summary: 'Cadastrar',
		category: 'SIM card',
		description: 'Permite cadastrar cartões SIM'
	},
	UPDATE_SIM_CARD: {
		title: 'Atualizar Cartão SIM',
		summary: 'Atualizar',
		category: 'SIM card',
		description: 'Permite atualizar cartões SIM'
	},
	DELETE_SIM_CARD: {
		title: 'Deletar Cartão SIM',
		summary: 'Deletar',
		category: 'SIM card',
		description: 'Permite deletar cartões SIM'
	},
	//
	UPDATE_ORGANIZATION: {
		title: 'Atualizar Organização',
		summary: 'Atualizar',
		category: 'organization',
		description:
			'Permite atualizar a organização que o usuário pertence, inclusive o endereço de cobrança'
	}
};

export const getPermissionDetails = (permission: string): PermissionDetails | null => {
	return permissionDetails[permission as permission] ?? null;
};

/**
 * Group a list of permissions by their category
 */
export const groupPermissionsByCategory = (permissions: permission[]): PermissionByCategory => {
	const group = {} as PermissionByCategory;

	permissions.forEach((permission) => {
		const details = permissionDetails[permission]
			? { ...permissionDetails[permission], key: permission }
			: null;

		if (!details) return;

		if (!group[details.category]) group[details.category] = [details];
		else group[details.category]?.push(details);
	});

	return group;
};

export const allPermissionsGroupedByCategory = groupPermissionsByCategory(
	Object.keys(permissionDetails) as permission[]
);
