import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	serial,
	unique,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { accessLevel } from './access-level';
import { fleet } from './fleet';
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
		themesCssVars: jsonb(),
		/**
		 * A UUID that is sent to the org billing email address to confirm
		 * it belongs to a user of the organization
		 */
		confirmBillingEmailToken: uuid(),
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
	fleets: many(fleet),
	vehicleTrackers: many(vehicleTracker),
	simCards: many(simCard)
}));
