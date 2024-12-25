
import z from "zod";

export const NoteGroupSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export type NoteGroupType = z.infer<typeof NoteGroupSchema>;

export const NoteSchema = z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    pinned: z.boolean(),
    group: z.array(
        NoteGroupSchema
    ),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})




export type NoteType = z.infer<typeof NoteSchema>;

export const NoteCreateSchema = z.object({
    title: z.string(),
    content: z.string(),
    pinned: z.boolean(),
    group: z.array(
        z.string()
    ),
})
export type NoteCreateType = z.infer<typeof NoteCreateSchema>;

export const NoteUpdateSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    pinned: z.boolean().optional(),
    group: z.array(
        z.string()
    ).optional(),
})

export type NoteUpdateType = z.infer<typeof NoteUpdateSchema>;