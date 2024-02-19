/**
 * Returns true if a date has occoured in the last X milliseconds
 *
 * @example
 * ```ts
 * const fiveMinutes = 5 * 60 * 1000
 *
 * // false because 02/15/2020 is not between the last five minutes
 * isDateOlderThanXMilliseconds(new Date("2020-02-15T19:06:01Z"), fiveMinutes)
 * ```
 */
export const isDateOlderThanXMilliseconds = (date: Date, ms: number) => {
	const nowToDateMsDiff = new Date().getTime() - date.getTime();
	return nowToDateMsDiff < ms;
};

export const toDateTime = (d: Date) =>
	d.toLocaleTimeString(undefined, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short'
	});
