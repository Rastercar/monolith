import { faker } from '@faker-js/faker';

/**
 * Creates a brazilian vehicle plate in the `AAA9999` format, where:
 *
 * - A = uppercase alphabetic characters
 * - 9 = numbers 0 to 9
 */
export function fakeBrazilianVehiclePlate() {
	const letters = faker.string.alpha({ length: 3, casing: 'upper' });
	const numbers = faker.string.numeric(4);
	return `${letters}${numbers}`;
}

// Function to generate a random phone number in E.164 format
export function fakeE164PhoneNumber() {
	// Generate a random country code (for example, 1 for US, 44 for UK, 55 for Brazil)
	const countryCode = faker.number.int({ min: 1, max: 99 }).toString();
	const subscriberNumber = faker.number.int({ min: 1000000000, max: 9999999999 }).toString();

	return `+${countryCode}${subscriberNumber}`;
}

export function fakeSsn() {
	const ssn = faker.number.int({ min: 10000, max: 999999 }).toString();
	return `00${ssn}`;
}

/**
 * Creates a random SIM card PIN (personal identification number)
 *
 * see: https://www.sciencedirect.com/topics/computer-science/personal-identification-number
 */

export function fakePinNumber() {
	return faker.number.int({ min: 1000, max: 9999 }).toString();
}

/**
 * Creates a random SIM card PUK (personal unlocking key)
 *
 * see: https://www.sciencedirect.com/topics/computer-science/personal-identification-number
 */
export function fakePukCode() {
	return faker.number.int({ min: 10000, max: 999999 }).toString();
}
