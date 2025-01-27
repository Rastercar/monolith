import { route } from '$lib/ROUTES';
import { test } from '@playwright/test';

test('login - success flow', async ({ page }) => {
	await page.goto(route('signIn /auth/sign-in'));

	await page.fill('input[name="email"]', 'rastercar.tests.002@gmail.com');
	await page.fill('input[name="password"]', 'Contafake3!');

	await page.click('button[type="submit"]');

	await page.waitForURL(/\/client.*/);
});
