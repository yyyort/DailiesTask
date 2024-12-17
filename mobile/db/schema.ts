import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("tasks_table", {
    id: integer().unique().primaryKey(),
    userId: text().notNull(),
    title: text().notNull(),
    description: text().notNull(),
    status: text().notNull(),
    sync: integer({
        mode: "boolean"
    }).notNull(),
    createdAt: text().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
})

