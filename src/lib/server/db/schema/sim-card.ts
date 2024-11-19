import { relations } from 'drizzle-orm';
import { foreignKey, integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';
import { organization } from './organization';
import { createdAt } from './schema-helpers';
import { vehicleTracker } from './vehicle-tracker';

export const simCard = pgTable(
	'sim_card',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		phoneNumber: varchar('phone_number', { length: 255 }).notNull(),
		ssn: varchar({ length: 255 }).notNull(),
		apnAddress: varchar('apn_address', { length: 255 }).notNull(),
		apnUser: varchar('apn_user', { length: 255 }).notNull(),
		apnPassword: varchar('apn_password', { length: 255 }).notNull(),
		pin: varchar({ length: 8 }),
		pin2: varchar({ length: 8 }),
		puk: varchar({ length: 8 }),
		puk2: varchar({ length: 8 }),
		organizationId: integer('organization_id').notNull(),
		vehicleTrackerId: integer('vehicle_tracker_id')
	},
	(table) => ({
		simCardOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'sim_card_organization_id_foreign'
		}).onUpdate('cascade'),
		simCardVehicleTrackerIdForeign: foreignKey({
			columns: [table.vehicleTrackerId],
			foreignColumns: [vehicleTracker.id],
			name: 'sim_card_vehicle_tracker_id_foreign'
		})
			.onUpdate('cascade')
			.onDelete('set null'),
		simCardPhoneNumberUnique: unique('sim_card_phone_number_unique').on(
			table.phoneNumber,
			table.organizationId
		),
		simCardSsnUnique: unique('sim_card_ssn_unique').on(table.ssn, table.organizationId)
	})
);

export const simCardRelations = relations(simCard, ({ one }) => ({
	organization: one(organization, {
		fields: [simCard.organizationId],
		references: [organization.id]
	}),
	vehicleTracker: one(vehicleTracker, {
		fields: [simCard.vehicleTrackerId],
		references: [vehicleTracker.id]
	})
}));
