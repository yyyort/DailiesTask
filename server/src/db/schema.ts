import { pgEnum } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { time } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable("users_table", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    email: text('email').unique().notNull(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const taskStatus = pgEnum("task_status", ["todo", "done", "overdue"]);

export const routineTable = pgTable("routine_table", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
})

export const routineTasksTable = pgTable("routine_tasks_table", {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    routineId: uuid('routine_id').notNull().references(() => routineTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    title: text('title').notNull(),
    description: text('description'),
    status: taskStatus('status').default('todo').notNull(),
    timeToDo: time('time_to_do').notNull(),
    deadline: date('deadline').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const taskTable = pgTable("task_table", {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    routineTaskId: uuid('routine_task_id').references(() => routineTasksTable.id, {
        onDelete: 'set null',
    }),
    title: text('title').notNull(),
    description: text('description'),
    status: taskStatus('status').default('todo').notNull(),
    timeToDo: time('time_to_do').notNull(),
    deadline: date('deadline').notNull(),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const contributionTable = pgTable("contribution_table", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    tasksDone: integer('tasks_done').notNull(),
    tasksMissed: integer('tasks_missed').notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const notesTable = pgTable("notes_table", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    title: text('text').notNull(),
    content: text('content').notNull(),
    pinned: boolean('pinned').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const notesGroupTable = pgTable("group_table", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const notesGroupJunctionTable = pgTable("notes_group_junction_table", {
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    groupId: uuid('group_id').notNull().references(() => notesGroupTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    noteId: uuid('note_id').notNull().references(() => notesTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});


export type InsertTask = typeof taskTable.$inferInsert;
export type SelectTask = typeof taskTable.$inferSelect;

//omit createdAt and updatedAt from SelectTask
export type TaskTableReturnType = Omit<SelectTask, "userId" | "createdAt" | "updatedAt">;
export type TaskTableCreateType = Omit<InsertTask, "userId">;