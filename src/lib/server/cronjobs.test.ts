import { delay } from '$lib/utils/promises';
import { describe } from 'node:test';
import { expect, test, vi } from 'vitest';
import { createCron, fmt } from './cronjobs';

test('fmt - formats seconds to their biggest date type secs, min, hour, etc', () => {
	const testCases = [
		[1, '1 second'],
		[59, '59 seconds'],
		[1 * 60, '1 minute'],
		[1 * 60 * 59, '59 minutes'],
		[1 * 60 * 60, '1 hour'],
		[1 * 60 * 60 * 23, '23 hours'],
		[1 * 60 * 60 * 24, '1 day'],
		[1 * 60 * 60 * 24 * 500, '500 days']
	] as const;

	testCases.forEach(([input, expectedOutput]) => {
		expect(fmt(input)).toEqual(expectedOutput);
	});
});

describe('createCron', () => {
	const createCronOptions = (cb: () => void) => ({
		key: 'key',
		description: 'test',
		cb,
		intervalMilliseconds: 10
	});

	test('creates a cronjob that runs X milliseconds ', async () => {
		const cronCallRecorder = vi.fn();

		const cronOptions = createCronOptions(cronCallRecorder);

		const leeway = cronOptions.intervalMilliseconds - 5;

		createCron(cronOptions, false);

		await delay(cronOptions.intervalMilliseconds * 3 + leeway);

		expect(cronCallRecorder).toHaveBeenCalledTimes(3);
	});

	test('stops calling the old callback and calls the new callback', async () => {
		const oldCronCallRecorder = vi.fn();
		const newCronCallRecorder = vi.fn();

		const oldCronOptions = createCronOptions(oldCronCallRecorder);
		const newCronOptions = createCronOptions(newCronCallRecorder);

		const leeway = oldCronOptions.intervalMilliseconds - 3;

		createCron(oldCronOptions, false);

		await delay(oldCronOptions.intervalMilliseconds * 3 + leeway);

		expect(oldCronCallRecorder).toHaveBeenCalledTimes(3);

		createCron(newCronOptions, false);

		await delay(oldCronOptions.intervalMilliseconds * 5 + leeway);

		expect(oldCronCallRecorder).toHaveBeenCalledTimes(3);
		expect(newCronCallRecorder).toHaveBeenCalledTimes(5);
	});
});
