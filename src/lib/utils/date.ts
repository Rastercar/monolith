type DateOrTimestamp = Date | string;

const castToDate = (d: DateOrTimestamp) => (typeof d === 'string' ? new Date(d) : d);

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
export const isDateOlderThanXMilliseconds = (date: DateOrTimestamp, ms: number) => {
	const nowToDateMsDiff = new Date().getTime() - castToDate(date).getTime();
	return nowToDateMsDiff < ms;
};

export const toDate = (d: DateOrTimestamp) => castToDate(d).toLocaleDateString();

export const toDateTime = (d: DateOrTimestamp, withTimezone = false) =>
	castToDate(d).toLocaleTimeString(undefined, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: withTimezone ? 'short' : undefined
	});

export const getDatesDiffInSeconds = (a: DateOrTimestamp, b: DateOrTimestamp) => {
	const diffMilliseconds = castToDate(a).getTime() - castToDate(b).getTime();
	return Math.abs(Math.floor(diffMilliseconds / 1000));
};

export const createDateXDaysFromNow = (days: number) => {
	const now = new Date();

	const futureDate = new Date();
	futureDate.setDate(now.getDate() + days);

	return futureDate;
};
