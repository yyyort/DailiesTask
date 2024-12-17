
import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.number(),
    user_id: z.string(),
    routineId: z.string().optional().nullable(),
    title: z.string().refine(data => data.length > 0, {
        message: "Title is required"
    }),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]),
    timeToDo: z.string().time().optional(),
    deadline: z.string().date().refine(data => new Date(data).toLocaleDateString()),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const TaskReturnSchema = TaskSchema.omit({ user_id: true, createdAt: true, updatedAt: true });

export const TaskCreateSchema = TaskSchema.pick({ title: true, description: true, status: true, timeToDo: true, deadline: true, routineId: true });

export const TaskUpdateSchema = z.object({
    routineId: z.string().optional().nullable(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]).optional(),
    timeToDo: z.string().time().optional(),
    deadline: z.string().date().optional()
})

export type TaskType = z.infer<typeof TaskSchema>;
export type TaskReturnType = z.infer<typeof TaskReturnSchema>;
export type TaskCreateType = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateType = z.infer<typeof TaskUpdateSchema>;

// additonal schema
export const taskStatusSchema = z.enum(["todo", "done", "overdue"]);
export type TaskStatusType = z.infer<typeof taskStatusSchema>;

export const taskTodayReturnSchema = TaskReturnSchema.extend({
    order: z.number(),
})
export type TaskTodayReturnType = z.infer<typeof taskTodayReturnSchema>;

export const TaskTodaySchema = z.object({
    id: z.number(),
    userId: z.string(),
    taskId: z.number(),
    order: z.number(),
})

export type TaskTodayType = z.infer<typeof TaskTodaySchema>;

