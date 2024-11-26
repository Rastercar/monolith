// see: https://stackoverflow.com/questions/71342646/adding-import-statement-to-global-d-ts-destroys-type-and-module-declarations
type User = import('$lib/api/user.schema').User;
type UserSession = import('$lib/api/user.schema').UserSession;
type RouteMeta = import('$lib/routes-meta').RouteMeta;
type ZodError = import('zod').ZodError['issues'];

// see: https://kit.svelte.dev/docs/types#app
declare namespace App {
	// interface PageData {}
	// interface Platform {}

	/**
	 * Loaded from auth middleware
	 */
	interface Locals {
		/**
		 * The user loaded and authenticated by his session cookie
		 */
		user: User | null;

		/**
		 * The session of the authenticated user
		 */
		session: UserSession | null;

		/**
		 * Route metadata
		 */
		routeMeta?: RouteMeta;
	}

	/**
	 * Error codes, eg (MISSING_SID_COOKIE)
	 */
	interface Error {
		code?: string;
		issues?: ZodError;
	}

	namespace Superforms {
		type Message = {
			type: 'error' | 'success';
			text: string;
			code?: string;
		};
	}
}

/**
 * TODO: check im needed (probably not anymore !)
 */
declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:accept'?: (event: CustomEvent<T>) => void;
		'on:complete'?: (event: CustomEvent<T>) => void;
	}
}
