import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/db";
import { notesGroupJunctionTable, notesGroupTable, notesTable } from "../db/schema";
import { NoteCreateType, NoteType, NoteUpdateType } from "../model/notes.model";
import { ApiError } from "../util/apiError";
/* 
    CREATE
*/
export async function noteCreateService(
    userId: string,
    data: NoteCreateType
): Promise<NoteType> {
    try {
        const note = await db
            .insert(notesTable)
            .values({
                userId: userId,
                title: data.title,
                content: data.content,
                pinned: data.pinned,
            })
            .returning()

        if (data.group) {
            //pre process group
            const groups = data.group.map((group) => {
                return {
                    userId: userId,
                    name: group
                }
            })

            // Add to group

            const group = await db
                .insert(notesGroupTable)
                .values(
                    groups
                )
                .returning()


            //pre process junction table
            const junctionTable = group.map((group) => {
                return {
                    userId: userId,
                    groupId: group.id,
                    noteId: note[0].id
                }
            })

            // Add to junction table
            await db
                .insert(notesGroupJunctionTable)
                .values(
                    junctionTable
                )
                .returning()


            const finalNote: NoteType = {
                id: note[0].id,
                userId: note[0].userId,
                title: note[0].title,
                content: note[0].content,
                pinned: note[0].pinned,
                createdAt: new Date(note[0].createdAt).toISOString(),
                updatedAt: new Date(note[0].updatedAt).toISOString(),
                group: data.group
            }

            return finalNote;
        }

        return {
            id: note[0].id,
            userId: note[0].userId,
            title: note[0].title,
            content: note[0].content,
            pinned: note[0].pinned,
            createdAt: new Date(note[0].createdAt).toISOString(),
            updatedAt: new Date(note[0].updatedAt).toISOString(),
            group: []
        }

    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }

}

/* 
    READ
*/
export async function notesRead(
    userId: string,
    id: string
): Promise<NoteType> {
    try {

        const finalNote: NoteType = await db.transaction(async (trx) => {

            const note = await trx
                .select()
                .from(notesTable)
                .where(
                    and(
                        eq(notesTable.userId, userId),
                        eq(notesTable.id, id)
                    )
                )
                .limit(1)

            if (note.length === 0) {
                throw new ApiError(204, "Note not found", {})
            }

            const groups = await trx
                .select()
                .from(notesGroupJunctionTable)
                .where(
                    eq(notesGroupJunctionTable.noteId, id)
                )

            const groupIds = groups.map((group) => {
                return group.groupId
            })

            const groupNames = await db
                .select()
                .from(notesGroupTable)
                .where(
                    and(
                        inArray(notesGroupTable.id, groupIds),
                        eq(notesGroupTable.userId, userId)
                    )
                )


            const finalNote: NoteType = {
                id: note[0].id,
                userId: note[0].userId,
                title: note[0].title,
                content: note[0].content,
                pinned: note[0].pinned,
                createdAt: new Date(note[0].createdAt).toISOString(),
                updatedAt: new Date(note[0].updatedAt).toISOString(),
                group: groupNames.map((group) => {
                    return group.name
                })
            }

            return finalNote;
        });

        return finalNote;
    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}

/* 
    READ ALL
*/
export async function notesReadAll(
    userId: string,
    groups?: string[]
): Promise<NoteType[]> {
    try {
        const notes: NoteType[] = await db.transaction(async (trx) => {
            if (groups) {
                //get all ids of notes in the group in junction table
                const notesIds = await trx
                    .select(
                        {
                            notesId: notesGroupJunctionTable.noteId
                        }
                    )
                    .from(notesGroupJunctionTable)
                    .where(
                        inArray(notesGroupJunctionTable.groupId, groups)
                    )

                //get all notes
                const notes = await trx
                    .select()
                    .from(notesTable)
                    .where(
                        and(
                            eq(notesTable.userId, userId),
                            inArray(notesTable.id, notesIds.map((note) => {
                                return note.notesId
                            }))
                        )
                    )

                return notes.map((note) => {
                    return {
                        id: note.id,
                        userId: note.userId,
                        title: note.title,
                        content: note.content,
                        pinned: note.pinned,
                        createdAt: new Date(note.createdAt).toISOString(),
                        updatedAt: new Date(note.updatedAt).toISOString(),
                        group: []
                    }
                })
            }

            const notes = await trx
                .select()
                .from(notesTable)
                .where(
                    eq(notesTable.userId, userId)
                )

            return notes.map((note) => {
                return {
                    id: note.id,
                    userId: note.userId,
                    title: note.title,
                    content: note.content,
                    pinned: note.pinned,
                    createdAt: new Date(note.createdAt).toISOString(),
                    updatedAt: new Date(note.updatedAt).toISOString(),
                    group: []
                }
            })

        });

        return notes;
    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);

    }
}

/* 
    READ ALL GROUP
*/
export async function notesReadAllGroup(
    userId: string,
): Promise<{ id: string, name: string }[]> {
    try {
        const groups = await db.select({
            id: notesGroupTable.id,
            name: notesGroupTable.name
        })
            .from(notesGroupTable)
            .where(
                eq(notesGroupTable.userId, userId)
            )

        return groups;

    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}

/* 
    UPDATE
*/
export async function notesUpdateService(
    userId: string,
    id: string,
    data: NoteUpdateType
): Promise<void> {
    try {
        await db.transaction(async (trx) => {
            await trx
                .update(notesTable)
                .set({
                    title: data.title,
                    content: data.content,
                })
                .where(
                    and(
                        eq(notesTable.userId, userId),
                        eq(notesTable.id, id)
                    )
                )

            if (data.group) {
                await notesUpdateGroupService(userId, id, data.group)
            }

        });
    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}


/* 
    UPDATE GROUP
*/
export async function notesUpdateGroupService(
    userId: string,
    id: string,
    groups: string[]
): Promise<void> {
    try {
        //pre process group
        const insertGroup = groups.map((group) => {
            return {
                userId: userId,
                noteId: id,
                groupId: group
            }
        })

        await db
            .insert(notesGroupJunctionTable)
            .values(
                insertGroup
            )
    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}

/* 
    UPDATE PINNED
*/
export async function notesUpdatePinnedService(
    userId: string,
    id: string,
    pinned: boolean
): Promise<void> {
    try {
        await db
            .update(notesTable)
            .set({
                pinned: pinned
            })
            .where(
                and(
                    eq(notesTable.userId, userId),
                    eq(notesTable.id, id)
                )
            )

    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}


/* 
    DELETE
*/
export async function notesDeleteService(
    userId: string,
    id: string
): Promise<void> {
    try {
        await db.transaction(async (trx) => {
            await trx
                .delete(notesTable)
                .where(
                    and(
                        eq(notesTable.userId, userId),
                        eq(notesTable.id, id)
                    )
                )

            await trx
                .delete(notesGroupJunctionTable)
                .where(
                    and(
                        eq(notesGroupJunctionTable.noteId, id),
                        eq(notesGroupJunctionTable.userId, userId)
                    )
                )
        })

    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}