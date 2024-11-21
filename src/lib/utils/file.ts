const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

export function fileIsImage(file: File): boolean {
	return validImageTypes.includes(file.type);
}

/**
 * TODO: gambiarra do caralho, superforms permite files agora, arrumar
 *
 * Sets the value to `""` and files to `null` for all HtmlInputs
 * under a HtmlElement with the given ID
 */
export function clearFileInputsUnderFormWithId(id: string) {
	const form = document.getElementById(id) as HTMLElement | null;
	if (!form) return;

	const fileInputs = form.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;

	fileInputs.forEach((f) => {
		f.value = '';
		f.files = null;
	});
}
