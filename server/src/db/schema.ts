import { pgEnum } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';
import { time } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { serial } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable("users_table", {
    id: uuid('id').primaryKey().defaultRandom().unique().notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const taskStatus = pgEnum("task_status", ["todo", "done", "overdue"]);

export const taskTable = pgTable("task_table", {
    id: serial('id').primaryKey().unique().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    routineId: uuid('routine_id').references(() => routineTable.id, {
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

export const taskTodayTable = pgTable("task_today_table", {
    id: serial('id').primaryKey().unique().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    taskId: serial('task_id').notNull().references(() => taskTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }).unique(),
    order: integer('order').notNull(),
})

export const routineTable = pgTable("routine_table", {
    id: uuid('id').primaryKey().defaultRandom().unique().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
})


export const contributionTable = pgTable("contribution_table", {
    id: uuid('id').primaryKey().defaultRandom().unique().notNull(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    tasksDone: integer('tasks_done').notNull(),
    tasksTotal: integer('tasks_total').notNull(),
    tasksMissed: integer('tasks_missed').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export type InsertTask = typeof taskTable.$inferInsert;
export type SelectTask = typeof taskTable.$inferSelect;

//omit createdAt and updatedAt from SelectTask
export type TaskTableReturnType = Omit<SelectTask, "userId" | "createdAt" | "updatedAt">;
export type TaskTableCreateType = Omit<InsertTask, "userId">;