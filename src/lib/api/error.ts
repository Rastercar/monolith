interface ApiErrorObject {
	error: string;
}

export class ApiErrorResponse extends Error {
	apiError!: string;
	response!: Response;

	constructor(apiError: string, response: Response) {
		super(apiError);
		this.name = 'ApiError';
		this.apiError = apiError;
		this.response = response;
	}
}

export const isApiErrorResponse = (v: unknown): v is ApiErrorResponse => {
	return v instanceof ApiErrorResponse;
};

export const isApiErrorObject = (v: unknown): v is ApiErrorObject => {
	return typeof v === 'object' && v !== null && typeof (v as ApiErrorObject).error === 'string';
};
