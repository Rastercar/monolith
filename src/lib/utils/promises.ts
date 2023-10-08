/**
 * Creates a promise that will resolve after X milliseconds
 */
export const createPromiseThatResolvesIn = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * Waits for a minium time (milliseconds) before returning the result of a certain promise
 */
export const awaitPromiseWithMinimumDelay = async <T>(
	originalPromise: Promise<T>,
	delay = 1000
): Promise<T> => {
	const [promiseResult] = await Promise.all([originalPromise, createPromiseThatResolvesIn(delay)]);
	return promiseResult;
};
