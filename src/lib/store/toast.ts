import { isAppError } from '$lib/api/utils';
import { toast } from '@zerodevx/svelte-toast';
import { WretchError } from 'wretch/resolver';

// [IMPROVEMENT] while svelte-toast is pretty cool, we want it to use skeleton themes
// if skeleton UI makes a toast component that applies the theme we shall use it,
// if not we can set the toast themes to use skeleton css variables
export const showSuccessToast = (message = 'Success!') => {
	toast.push(message, {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(72,187,120,0.9)',
			'--toastBarBackground': '#2F855A'
		}
	});
};

function getMessageFromError(error: unknown) {
	if (typeof error === 'string') {
		return error;
	}

	if (error instanceof WretchError && isAppError(error.json)) {
		return error.json.message;
	}

	return 'aplication error';
}

export const showErrorToast = (error: unknown) => {
	toast.push(getMessageFromError(error), {
		theme: {
			'--toastColor': 'white',
			'--toastBackground': '#ff4d4d',
			'--toastBarBackground': '#b30000'
		}
	});
};
