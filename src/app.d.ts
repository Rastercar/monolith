// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
	/**
	 * Error codes, eg (MISSING_SID_COOKIE)
	 */
	interface Error {
		code?: string;
	}
	namespace Superforms {
		type Message = {
			type: 'error' | 'success';
			text: string;
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
