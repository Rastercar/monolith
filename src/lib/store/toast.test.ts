import { toast } from '@zerodevx/svelte-toast';
import { describe } from 'node:test';
import { beforeAll, expect, test, vi } from 'vitest';
import { WretchError } from 'wretch/resolver';
import { showErrorToast, showSuccessToast } from './toast';

beforeAll(() => {
	// Mock `toast` from '@zerodevx/svelte-toast'
	vi.mock('@zerodevx/svelte-toast', () => ({
		toast: {
			push: vi.fn()
		}
	}));
});

test('showSuccessToast - just calls @zerodevx/svelte-toast push with the message and a sensible success theme', () => {
	showSuccessToast('message');

	expect(toast.push).toHaveBeenLastCalledWith('message', {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(72,187,120,0.9)',
			'--toastBarBackground': '#2F855A'
		}
	});
});

describe('show error toast', () => {
	test('uses a sensible error theme ', () => {
		showErrorToast('message');

		expect(toast.push).toHaveBeenLastCalledWith('message', {
			theme: {
				'--toastColor': 'white',
				'--toastBackground': '#ff4d4d',
				'--toastBarBackground': '#b30000'
			}
		});
	});

	test('uses the error message if its a string', () => {
		showErrorToast('message');
		expect(toast.push).toHaveBeenLastCalledWith('message', expect.anything());
	});

	test("sets the message to 'aplication error' on unknown error", () => {
		showErrorToast(new Error());
		expect(toast.push).toHaveBeenLastCalledWith('aplication error', expect.anything());
	});

	test('sets the message to the message returned by the api on a API call error', () => {
		const apiError = new WretchError();
		apiError.json = { message: 'error' };

		showErrorToast(apiError);
		expect(toast.push).toHaveBeenLastCalledWith(apiError.json?.message, expect.anything());
	});
});
