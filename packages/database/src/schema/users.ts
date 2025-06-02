
import { date } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    email: text('email').unique().notNull(),
    username: text('username').unique().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    password: text('password').notNull(),
    lastLogin: date('last_login').notNull().defaultNow(),
    birthdate: date('birthdate').notNull(),
    profilePicture: text('profile_picture'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

