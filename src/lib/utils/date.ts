type DateOrTimestamp = Date | string;

export function castToDate(d: DateOrTimestamp): Date {
	return typeof d === 'string' ? new Date(d) : d;
}

/**
 * Returns true if X milliseconds ellapsed since a date
 *
 *
 * @example
 * ```ts
 * const fiveMinutes = 5 * 60 * 1000
 *
 * // true because 02/15/2020 is not between the last five minutes
 * checkMillisecondsEllapsedSinceDate(new Date("2020-02-15T19:06:01Z"), fiveMinutes)
 * ```
 */
export function checkMillisecondsEllapsedSinceDate(date: DateOrTimestamp, ms: number) {
	const nowToDateMsDiff = new Date().getTime() - castToDate(date).getTime();
	return nowToDateMsDiff >= ms;
}

export function toLocaleDateString(d: DateOrTimestamp) {
	return castToDate(d).toLocaleDateString();
}

export function toDateTime(d: DateOrTimestamp, withTimezone = false) {
	return castToDate(d).toLocaleTimeString(undefined, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: withTimezone ? 'short' : undefined
	});
}

export function getDatesDiffInSeconds(a: DateOrTimestamp, b: DateOrTimestamp) {
	const diffMilliseconds = castToDate(a).getTime() - castToDate(b).getTime();
	return Math.abs(Math.floor(diffMilliseconds / 1000));
}

export function createDateXDaysFromNow(days: number) {
	const now = new Date();

	const futureDate = new Date();
	futureDate.setDate(now.getDate() + days);

	return futureDate;
}

/**
 * @example
 * ```ts
 * const fiveMinutes = 5 * 60 * 1000
 *
 * // 2024-11-27_15-30-45
 * getYYYY_MM_DD_HH_MM_SS(new Date("2024-11-27T15:30:45Z"))
 * ```
 */
export function getYYYY_MM_DD_HH_MM_SS(date: DateOrTimestamp = new Date()): string {
	const d = castToDate(date);

	const year = d.getFullYear();
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const day = d.getDate().toString().padStart(2, '0');
	const hours = d.getHours().toString().padStart(2, '0');
	const minutes = d.getMinutes().toString().padStart(2, '0');
	const seconds = d.getSeconds().toString().padStart(2, '0');

	return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
