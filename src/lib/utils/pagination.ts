export function getPaginationParamsFromSearchParams(params: URLSearchParams) {
	const _page = parseInt(params.get('page') ?? '1');
	const _pageSize = parseInt(params.get('pageSize') ?? '5');

	return {
		page: Number.isNaN(_page) ? 1 : _page,
		pageSize: Number.isNaN(_pageSize) ? 5 : _pageSize
	};
}
