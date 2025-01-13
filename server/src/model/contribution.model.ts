import z from "zod";


export const contributionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    tasksDone: z.number(),
    tasksMissed: z.number(),
    date: z.string().date(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type ContributionType = z.infer<typeof contributionSchema>;

export const contributionCreateSchema = z.object({
    userId: z.string(),
    tasksDone: z.number(),
    tasksMissed: z.number(),
    date: z.string().date(),
})

export type ContributionCreateType = z.infer<typeof contributionCreateSchema>;

export const contributionUpdateSchema = z.object({
    tasksDone: z.number().optional(),
    tasksTotal: z.number().optional(),
    tasksMissed: z.number().optional(),
})

export type ContributionUpdateType = z.infer<typeof contributionUpdateSchema>;

export const contributionReturnSchema = contributionSchema.omit({ userId: true, updatedAt: true, createdAt: true });

export type ContributionReturnType = z.infer<typeof contributionReturnSchema>;