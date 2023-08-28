import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies }) => {
		console.log('logging in');

		const res = await fetch(`http://localhost:3000/auth/sign-in`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'rastercar.tests.002@gmail.com',
				password: 'testuser'
			})
		});

		const loginResponse = await res.json();

		console.log(loginResponse);
	}
};
