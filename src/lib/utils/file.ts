const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

export const fileIsImage = (file: File): boolean => {
	return validImageTypes.includes(file.type);
};

/**
 * Sets the value to `""` and files to `null` for all HtmlInputs
 * under a HtmlElement with the given ID
 */
export const clearFileInputsUnderFormWithId = (id: string) => {
	const form = document.getElementById(id) as HTMLElement | null;

	if (!form) return;

	const fileInputs = form.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;

	fileInputs.forEach((f) => {
		f.value = '';
		f.files = null;
	});
};
