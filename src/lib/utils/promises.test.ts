import { expect, test } from 'vitest';
import { delay, withMinTime } from './promises';

test('delay - creates a promise that resolves in X milliseconds', async () => {
	const nowEpoch = new Date().getTime();

	const delayTime = 5;
	await delay(delayTime);

	const leeway = 50;

	const afterDelayEpoch = new Date().getTime();

	expect(nowEpoch + delayTime).toBeGreaterThanOrEqual(afterDelayEpoch - leeway);
	expect(nowEpoch + delayTime).toBeLessThanOrEqual(afterDelayEpoch + leeway);
});

test('promiseWithMinimumTimeOf - ensures a minimun time is ellapsed', async () => {
	const nowEpoch = new Date().getTime();

	const minimunTime = 5;
	await withMinTime(delay(1), minimunTime);

	const afterDelayEpoch = new Date().getTime();

	const leeway = 50;

	expect(nowEpoch + minimunTime).toBeGreaterThan(afterDelayEpoch - leeway);
	expect(nowEpoch + minimunTime).toBeLessThanOrEqual(afterDelayEpoch + leeway);
});
