
import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.number(),
    user_id: z.string(),
    title: z.string().refine(data => data.length > 0, {
        message: "Title is required"
    }),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]),
    timeToDo: z.string().datetime().optional(),
    deadline: z.string().datetime(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const TaskReturnSchema = TaskSchema.omit({ user_id: true, createdAt: true, updatedAt: true });

export const TaskCreateSchema = TaskSchema.pick({ title: true, description: true, status: true, timeToDo: true, deadline: true })

export const TaskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]).optional(),
    timeToDo: z.string().datetime().optional(),
    deadline: z.string().datetime().optional(),
})

export type TaskType = z.infer<typeof TaskSchema>;
export type TaskReturnType = z.infer<typeof TaskReturnSchema>;
export type TaskCreateType = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateType = z.infer<typeof TaskUpdateSchema>;

