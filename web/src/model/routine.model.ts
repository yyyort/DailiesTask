import z from "zod";

//routine tasks schemas
export const RoutineTaskSchema = z.object({
    id: z.string(),
    userId: z.string(),
    routineId: z.string(),
    title: z.string().refine(data => data.length > 0, {
        message: "Title is required"
    }),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]),
    timeToDo: z.preprocess((data) => {
        //transform time to utc time
        const date = new Date().toISOString().split('T')[0];


        return new Date(new Date(`${date}T${data}`).toISOString()).toUTCString().split(' ')[4];
    }, z.string().time()),
    /* deadline: z.string().datetime().transform((data) => new Date(data).toISOString()), */
    deadline: z.preprocess((data) => new Date(String(data)).toISOString().split('T')[0], z.string().date()),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const RoutineTaskReturnSchema = RoutineTaskSchema.omit({ userId: true, createdAt: true, updatedAt: true, routineId: true }).extend({
    routineId: z.string().optional().nullable(),
});

export const RoutineTaskCreateSchema = RoutineTaskSchema.pick({ title: true, description: true, status: true, timeToDo: true, deadline: true }).extend(
    {
        routineId: z.string().optional().nullable()
    }
);

export const RoutineTaskUpdateSchema = z.object({
    routineId: z.string().optional().nullable(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "done", "overdue"]).optional(),
    timeToDo: z.preprocess((data) => {
        //transform time to utc time
        const date = new Date().toISOString().split('T')[0];


        return new Date(new Date(`${date}T${data}`).toISOString()).toUTCString().split(' ')[4];
    }, z.string().time().optional()),
    deadline: z.preprocess((data) => new Date(String(data)).toISOString().split('T')[0], z.string().date().optional()),
})

export type RoutineTaskType = z.infer<typeof RoutineTaskSchema>;
export type RoutineTaskReturnType = z.infer<typeof RoutineTaskReturnSchema>;
export type RoutineTaskCreateType = z.infer<typeof RoutineTaskCreateSchema>;
export type RoutineTaskUpdateType = z.infer<typeof RoutineTaskUpdateSchema>;


//routine schemas
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
    tasks: z.array(RoutineTaskCreateSchema).optional().nullable()
});

export const RoutineReturnSchema = RoutineSchema.omit({ userId: true, createdAt: true, updatedAt: true }).extend({
    tasks: z.array(RoutineTaskReturnSchema).optional().nullable()
});

export const RoutineUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tasks: z.array(RoutineTaskCreateSchema.extend({
        id: z.string().optional().nullable()
    })).optional().nullable()
})

export type RoutineType = z.infer<typeof RoutineSchema>;
export type RoutineCreateType = z.infer<typeof RoutineAddSchema>;
export type RoutineReturnType = z.infer<typeof RoutineReturnSchema>;
export type RoutineUpdateType = z.infer<typeof RoutineUpdateSchema>;

