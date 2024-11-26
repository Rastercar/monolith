import { toast } from '@zerodevx/svelte-toast';

// [IMPROVEMENT] while svelte-toast is pretty cool, we want it to use skeleton themes
// if skeleton UI makes a toast component that applies the theme we shall use it,
// if not we can set the toas themes to use skeleton css variables

export const showSuccessToast = (message = 'Success!') => {
	toast.push(message, {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(72,187,120,0.9)',
			'--toastBarBackground': '#2F855A'
		}
	});
};
