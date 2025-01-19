import { expect, test, vi } from 'vitest';
import {
	castToDate,
	checkMillisecondsEllapsedSinceDate,
	createDateXDaysFromNow,
	getDatesDiffInSeconds,
	getYYYY_MM_DD_HH_MM_SS,
	toDateTime,
	toLocaleDateString
} from './date';

test('castToDate - converts to date if is string', () => {
	expect(castToDate('2010-02-03')).toBeInstanceOf(Date);
	expect(castToDate(new Date())).toBeInstanceOf(Date);
});

test('checkMillisecondsEllapsedSinceDate', () => {
	// it cant be that two seconds ellapsed since new Date() as its the current time
	expect(checkMillisecondsEllapsedSinceDate(new Date(), 2000)).toBe(false);

	const date = new Date();
	date.setSeconds(date.getSeconds() - 3);

	expect(checkMillisecondsEllapsedSinceDate(date, 2000)).toBe(true);
});

test('toLocaleDateString', () => {
	expect(toLocaleDateString(new Date())).toBe(new Date().toLocaleDateString());
});

test('toDateTime', () => {
	const mockDate = new Date();
	const spy = vi.spyOn(mockDate, 'toLocaleTimeString');

	toDateTime(mockDate, true);

	expect(spy).toHaveBeenCalledWith(undefined, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short'
	});

	toDateTime(mockDate, false);

	expect(spy).toHaveBeenCalledWith(undefined, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: undefined
	});
});

test('getDatesDiffInSeconds', () => {
	const date = new Date();

	const dateTreeSecondsFromNow = new Date();
	dateTreeSecondsFromNow.setSeconds(date.getSeconds() + 3);

	expect(getDatesDiffInSeconds(date, dateTreeSecondsFromNow)).toEqual(3);
	expect(getDatesDiffInSeconds(dateTreeSecondsFromNow, date)).toEqual(3);
});

test('createDateXDaysFromNow', () => {
	const millisecondsInDay = 1000 * 60 * 60 * 24;

	const now = new Date();
	const twoDaysFromNow = createDateXDaysFromNow(2);

	const dayDiff = Math.floor(
		Math.abs(now.getTime() - twoDaysFromNow.getTime()) / millisecondsInDay
	);

	expect(dayDiff).toEqual(2);
});

test('getYYYY_MM_DD_HH_MM_SS', () => {
	const YYYYMMDDHHMMSS = getYYYY_MM_DD_HH_MM_SS();

	const regex =
		/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])_(0\d|1\d|2[0-3])-(0\d|[1-5]\d)-(0\d|[1-5]\d)$/;

	expect(regex.test(YYYYMMDDHHMMSS)).toEqual(true);
});
