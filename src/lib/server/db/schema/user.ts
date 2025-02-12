import { relations } from 'drizzle-orm';
import {
	boolean,
	foreignKey,
	integer,
	pgTable,
	serial,
	text,
	unique,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { accessLevel } from './access-level';
import { organization } from './organization';
import { createdAt } from './schema-helpers';
import { session } from './session';

export const user = pgTable(
	'user',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		username: varchar({ length: 255 }).notNull(),
		email: varchar({ length: 255 }).notNull(),
		emailVerified: boolean('email_verified').default(false).notNull(),
		password: varchar({ length: 255 }).notNull(),
		blocked: boolean().notNull().default(false),

		/**
		 * A UUID that is sent to the user email address to so it
		 * can be reset after verifying the user has access to the
		 * email.
		 */
		resetPasswordToken: text('reset_password_token'),

		/**
		 * A UUID that is sent to the user email address to confirm
		 * it belongs to the user
		 */
		confirmEmailToken: uuid(),
		profilePicture: varchar('profile_picture', { length: 255 }),
		description: text(),
		organizationId: integer('organization_id'),
		accessLevelId: integer('access_level_id').notNull()
	},
	(table) => ({
		userAccessLevelIdForeign: foreignKey({
			columns: [table.accessLevelId],
			foreignColumns: [accessLevel.id],
			name: 'user_access_level_id_foreign'
		}).onUpdate('cascade'),
		userOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'user_organization_id_foreign'
		}).onUpdate('cascade'),
		userUsernameUnique: unique('user_username_unique').on(table.username),
		userEmailUnique: unique('user_email_unique').on(table.email),
		userResetPasswordTokenUnique: unique('user_reset_password_token_unique').on(
			table.resetPasswordToken
		),
		userConfirmEmailTokenUnique: unique('user_confirm_email_token_unique').on(
			table.confirmEmailToken
		)
	})
);

export const userRelations = relations(user, ({ one, many }) => ({
	accessLevel: one(accessLevel, {
		fields: [user.accessLevelId],
		references: [accessLevel.id]
	}),
	organization: one(organization, {
		fields: [user.organizationId],
		references: [organization.id],
		relationName: 'user_organizationId_organization_id'
	}),
	sessions: many(session),
	organizations: many(organization, {
		relationName: 'organization_ownerId_user_id'
	})
}));
