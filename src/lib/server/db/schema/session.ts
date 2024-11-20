import { relations, sql } from 'drizzle-orm';
import {
	foreignKey,
	inet,
	integer,
	pgTable,
	serial,
	timestamp,
	unique,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { createdAt } from './schema-helpers';
import { user } from './user';

export const session = pgTable(
	'session',
	{
		createdAt,

		/**
		 * A public ID for the session, since this is not used to determine users from sessions,
		 * this can be publically available
		 */
		publicId: serial('public_id').notNull(),

		/**
		 * A UUID representing the session token, this should NOT be publically available
		 * as getting this value can allow attackers to inpersonate other users
		 */
		sessionToken: uuid()
			.default(sql`gen_random_uuid()`)
			.primaryKey()
			.notNull(),

		expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
		userAgent: varchar('user_agent', { length: 255 }).notNull(),
		ip: inet().notNull(),
		userId: integer('user_id').notNull()
	},
	(table) => ({
		sessionUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'session_user_id_fkey'
		}).onDelete('cascade'),
		sessionPublicIdKey: unique('session_public_id_key').on(table.publicId)
	})
);

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));
