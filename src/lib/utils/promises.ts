/**
 * Creates a promise that will resolve after X milliseconds
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Waits for a minium time (milliseconds) before returning the result of a certain promise
 */
export const promiseWithMinimumTimeOf = async <T>(
	originalPromise: Promise<T>,
	delayMs = 1000
): Promise<T> => {
	const [promiseResult] = await Promise.all([originalPromise, delay(delayMs)]);
	return promiseResult;
};
