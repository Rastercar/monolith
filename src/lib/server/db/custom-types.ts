import { customType, pgEnum } from 'drizzle-orm/pg-core';

export const bytea = customType<{ data: string | Buffer; notNull: false; default: false }>({
	dataType: () => 'bytea',

	toDriver: (val) => {
		if (typeof val === 'string') {
			if (val.startsWith('0x')) {
				const newVal = val.slice(2);
				return Buffer.from(newVal, 'hex');
			}

			return Buffer.from(val);
		}

		return val;
	},

	fromDriver: (val) => (val as Buffer).toString('hex')
});

export const trackerModel = pgEnum('tracker_model', ['H02']);
