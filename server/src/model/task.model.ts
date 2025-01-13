import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string(),
    userId: z.string(),
    routineTaskId: z.string().optional().nullable(),
    title: z.string().refine(data => data.length > 0, {
        message: "Title is required"
    }),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]),
    timeToDo: z.string().time(),
    deadline: z.string().date(),
    order: z.number().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const TaskReturnSchema = TaskSchema
    .omit({ userId: true, createdAt: true, updatedAt: true });

export const TaskCreateSchema = TaskSchema.pick({ title: true, description: true, status: true, timeToDo: true, deadline: true, routineTaskId: true });

export const TaskUpdateSchema = z.object({
    routineTaskId: z.string().optional().nullable(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]).optional(),
    timeToDo: z.string().time().optional(),
    deadline: z.string().date().optional(),
    order: z.number()
})

export type TaskType = z.infer<typeof TaskSchema>;
export type TaskReturnType = z.infer<typeof TaskReturnSchema>;
export type TaskCreateType = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateType = z.infer<typeof TaskUpdateSchema>;

// additonal schema
export const taskStatusSchema = z.enum(["todo", "done", "overdue"]);
export type TaskStatusType = z.infer<typeof taskStatusSchema>;

