function castToIntWithFallback(v: string | null, def: number) {
	if (!v) return def;
	const n = parseInt(v);

	return Number.isNaN(n) ? def : n;
}

export function getPaginationParamsFromSearchParams(params: URLSearchParams) {
	return {
		page: castToIntWithFallback(params.get('page'), 1),
		pageSize: castToIntWithFallback(params.get('pageSize'), 5)
	};
}
