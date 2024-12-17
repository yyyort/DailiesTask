import z from "zod";
import { TaskCreateSchema, TaskReturnSchema } from "./task.model";

export const RoutineSchema = z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string().refine(data => data.length > 0, {
        message: "Title is required"
    }),
    description: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const RoutineAddSchema = RoutineSchema.omit({ id: true, userId: true, createdAt: true, updatedAt: true }).extend({
    tasks: z.array(TaskCreateSchema).optional().nullable()
});

export const RoutineReturnSchema = RoutineSchema.omit({ userId: true, createdAt: true, updatedAt: true }).extend({
    tasks: z.array(TaskReturnSchema).optional().nullable()
});

export const RoutineUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tasks: z.array(z.object({
        id: z.number().optional().nullable(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["todo", "done", "overdue"]).optional(),
        timeToDo: z.string().optional(),
        deadline: z.string().optional()
    })).optional().nullable()
})

export type RoutineType = z.infer<typeof RoutineSchema>;
export type RoutineCreateType = z.infer<typeof RoutineAddSchema>;
export type RoutineReturnType = z.infer<typeof RoutineReturnSchema>;
export type RoutineUpdateType = z.infer<typeof RoutineUpdateSchema>;