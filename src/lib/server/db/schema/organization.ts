import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, unique, varchar } from 'drizzle-orm/pg-core';
import { accessLevel } from './access-level';
import { createdAt } from './schema-helpers';
import { simCard } from './sim-card';
import { user } from './user';
import { vehicle } from './vehicle';
import { vehicleTracker } from './vehicle-tracker';

export const organization = pgTable(
	'organization',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		name: varchar({ length: 255 }).notNull(),
		blocked: boolean().notNull(),
		billingEmail: varchar('billing_email', { length: 255 }).notNull(),
		billingEmailVerified: boolean('billing_email_verified').default(false).notNull(),
		confirmBillingEmailToken: text('confirm_billing_email_token'),
		ownerId: integer('owner_id')
	},
	(table) => ({
		organizationBillingEmailUnique: unique('organization_billing_email_unique').on(
			table.billingEmail
		),
		organizationOwnerIdUnique: unique('organization_owner_id_unique').on(table.ownerId)
	})
);

export const organizationRelations = relations(organization, ({ one, many }) => ({
	users: many(user, {
		relationName: 'user_organizationId_organization_id'
	}),
	user: one(user, {
		fields: [organization.ownerId],
		references: [user.id],
		relationName: 'organization_ownerId_user_id'
	}),
	accessLevels: many(accessLevel),
	vehicles: many(vehicle),
	vehicleTrackers: many(vehicleTracker),
	simCards: many(simCard)
}));
