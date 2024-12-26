import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/db";
import { notesGroupJunctionTable, notesGroupTable, notesTable } from "../db/schema";
import { NoteCreateType, NoteGroupType, NoteType, NoteUpdateType } from "../model/notes.model";
import { ApiError } from "../util/apiError";
/* 
    CREATE
*/
export async function noteCreateService(
    userId: string,
    data: NoteCreateType
): Promise<NoteType> {
    try {
        const note: NoteType = await db.transaction(async (trx) => {
            //insert note
            const insertNote = await trx
                .insert(notesTable)
                .values({
                    userId: userId,
                    title: data.title,
                    content: data.content,
                    pinned: data.pinned,
                })
                .returning()

            //group logic
            if (data.group && data.group.length > 0) {
                //pre process group
                const preproGroup = data.group.map((group) => {
                    return {
                        userId: userId,
                        name: group
                    }
                })

                //query group that already exist
                const existGroup = await trx
                    .select(
                        {
                            id: notesGroupTable.id,
                            name: notesGroupTable.name
                        }
                    )
                    .from(notesGroupTable)
                    .where(
                        and(
                            eq(notesGroupTable.userId, userId),
                            inArray(notesGroupTable.name, data.group)
                        )
                    )

                //remove group that already exist
                const newGroups = preproGroup.filter((group) => {
                    return !existGroup.some((exist) => {
                        return exist.name === group.name
                    })
                }
                )

                if (newGroups.length > 0) {

                    //insert group that not exist
                    const insertNewGroup = await trx
                        .insert(notesGroupTable)
                        .values(
                            newGroups
                        ).returning(
                            {
                                id: notesGroupTable.id,
                                name: notesGroupTable.name
                            }
                        )


                    //regroup the existing group and new group
                    const regroup = existGroup.concat(insertNewGroup)


                    //insert junction table
                    const junctionTable = regroup.map((group) => {
                        return {
                            userId: userId,
                            groupId: group.id,
                            noteId: insertNote[0].id
                        }
                    })


                    await trx
                        .insert(notesGroupJunctionTable)
                        .values(
                            junctionTable
                        )

                    const finalNote: NoteType = {
                        id: insertNote[0].id,
                        userId: insertNote[0].userId,
                        title: insertNote[0].title,
                        content: insertNote[0].content,
                        pinned: insertNote[0].pinned,
                        createdAt: new Date(insertNote[0].createdAt).toISOString(),
                        updatedAt: new Date(insertNote[0].updatedAt).toISOString(),
                        group: regroup
                    }


                    return finalNote;
                }

                //insert junction table
                const junctionTable = existGroup.map((group) => {
                    return {
                        userId: userId,
                        groupId: group.id,
                        noteId: insertNote[0].id
                    }
                })

                await trx
                    .insert(notesGroupJunctionTable)
                    .values(
                        junctionTable
                    )

                const finalNote: NoteType = {
                    id: insertNote[0].id,
                    userId: insertNote[0].userId,
                    title: insertNote[0].title,
                    content: insertNote[0].content,
                    pinned: insertNote[0].pinned,
                    createdAt: new Date(insertNote[0].createdAt).toISOString(),
                    updatedAt: new Date(insertNote[0].updatedAt).toISOString(),
                    group: existGroup
                }



                return finalNote;

            }


            const finalNote: NoteType = {
                id: insertNote[0].id,
                userId: insertNote[0].userId,
                title: insertNote[0].title,
                content: insertNote[0].content,
                pinned: insertNote[0].pinned,
                createdAt: new Date(insertNote[0].createdAt).toISOString(),
                updatedAt: new Date(insertNote[0].updatedAt).toISOString(),
                group: []
            }

            return finalNote;

        });

        return note;

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

            //get note
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

            //get group in junction table
            const groups = await trx
                .select()
                .from(notesGroupJunctionTable)
                .where(
                    eq(notesGroupJunctionTable.noteId, id)
                )

            //pre process group id
            const groupIds = groups.map((group) => {
                return group.groupId
            })

            //get the group corresponding to the group id
            const noteGroup = await db
                .select({
                    id: notesGroupTable.id,
                    name: notesGroupTable.name
                })
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
                group: noteGroup
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

                //select group in group table where name is in groups
                const selectedGroup = await trx
                    .select()
                    .from(notesGroupTable)
                    .where(
                        and(
                            eq(notesGroupTable.userId, userId),
                            inArray(notesGroupTable.name, groups)
                        )
                    ).orderBy(desc(notesGroupTable.createdAt))

                //get all ids of notes in the group in junction table
                const notesIds = await trx
                    .select(
                        {
                            notesId: notesGroupJunctionTable.noteId
                        }
                    )
                    .from(notesGroupJunctionTable)
                    .where(
                        inArray(notesGroupJunctionTable.groupId,
                            selectedGroup.map((group) => {
                                return group.id
                            })
                        )
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
                    ).orderBy(desc(notesTable.createdAt))

                const finalNote: NoteType[] = await Promise.all(notes.map(async (note) => {
                    //get group in junction table
                    const groups = await trx
                        .select()
                        .from(notesGroupJunctionTable)
                        .where(
                            eq(notesGroupJunctionTable.noteId, note.id)
                        )

                    const groupIds = groups.map((group) => {
                        return group.groupId
                    })

                    //get the group corresponding to the group id
                    const noteGroup = await trx
                        .select({
                            id: notesGroupTable.id,
                            name: notesGroupTable.name
                        })
                        .from(notesGroupTable)
                        .where(
                            and(
                                inArray(notesGroupTable.id, groupIds),
                                eq(notesGroupTable.userId, userId)
                            )
                        ).orderBy(desc(notesGroupTable.createdAt))

                    const finalNote: NoteType = {
                        id: note.id,
                        userId: note.userId,
                        title: note.title,
                        content: note.content,
                        pinned: note.pinned,
                        createdAt: new Date(note.createdAt).toISOString(),
                        updatedAt: new Date(note.updatedAt).toISOString(),
                        group: noteGroup
                    }
                    return finalNote;
                }))

                return finalNote;
            }

            //get all notes
            const notes = await trx
                .select()
                .from(notesTable)
                .where(
                    eq(notesTable.userId, userId)
                ).orderBy(desc(notesTable.createdAt))

            //get all group in junction table for each note
            const finalNote: NoteType[] = await Promise.all(notes.map(async (note) => {
                //get group in junction table
                const groups = await trx
                    .select()
                    .from(notesGroupJunctionTable)
                    .where(
                        eq(notesGroupJunctionTable.noteId, note.id)
                    )

                const groupIds = groups.map((group) => {
                    return group.groupId
                })

                //get the group corresponding to the group id
                const noteGroup = await trx
                    .select({
                        id: notesGroupTable.id,
                        name: notesGroupTable.name
                    })
                    .from(notesGroupTable)
                    .where(
                        and(
                            inArray(notesGroupTable.id, groupIds),
                            eq(notesGroupTable.userId, userId)
                        )
                    ).orderBy(desc(notesGroupTable.createdAt))

                const finalNote: NoteType = {
                    id: note.id,
                    userId: note.userId,
                    title: note.title,
                    content: note.content,
                    pinned: note.pinned,
                    createdAt: new Date(note.createdAt).toISOString(),
                    updatedAt: new Date(note.updatedAt).toISOString(),
                    group: noteGroup
                }

                return finalNote;
            }))

            return finalNote;

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
    READ ALL PINNED NOTES
*/
export async function notesReadAllPinned(
    userId: string,
): Promise<NoteType[]> {
    try {
        const notes: NoteType[] = await db.transaction(async (trx) => {

            //get all notes
            const notes = await trx
                .select()
                .from(notesTable)
                .where(
                    and(
                        eq(notesTable.userId, userId),
                        eq(notesTable.pinned, true)
                    )
                ).orderBy(desc(notesTable.createdAt))

            //get all group in junction table for each note
            const finalNote: NoteType[] = await Promise.all(notes.map(async (note) => {
                //get group in junction table
                const groups = await trx
                    .select()
                    .from(notesGroupJunctionTable)
                    .where(
                        eq(notesGroupJunctionTable.noteId, note.id)
                    )

                const groupIds = groups.map((group) => {
                    return group.groupId
                })

                //get the group corresponding to the group id
                const noteGroup = await trx
                    .select({
                        id: notesGroupTable.id,
                        name: notesGroupTable.name
                    })
                    .from(notesGroupTable)
                    .where(
                        and(
                            inArray(notesGroupTable.id, groupIds),
                            eq(notesGroupTable.userId, userId)
                        )
                    ).orderBy(desc(notesGroupTable.createdAt))

                const finalNote: NoteType = {
                    id: note.id,
                    userId: note.userId,
                    title: note.title,
                    content: note.content,
                    pinned: note.pinned,
                    createdAt: new Date(note.createdAt).toISOString(),
                    updatedAt: new Date(note.updatedAt).toISOString(),
                    group: noteGroup
                }

                return finalNote;
            }))

            return finalNote;

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
        console.log("data in update service", data);

        await db.transaction(async (trx) => {
            await trx
                .update(notesTable)
                .set({
                    title: data.title,
                    content: data.content,
                    pinned: data.pinned
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



        console.log("groups in update group service", groups);

        //query group of the note
        await db.transaction(async (trx) => {
            //get group of the note
            const noteGroupJunctionId = await trx
                .select({
                    groupId: notesGroupJunctionTable.groupId
                })
                .from(notesGroupJunctionTable)
                .where(
                    eq(notesGroupJunctionTable.noteId, id)
                )

            console.log("note group junction id", noteGroupJunctionId);

            const noteGroup = await trx
                .select({
                    id: notesGroupTable.id,
                    name: notesGroupTable.name
                })
                .from(notesGroupTable)
                .where(
                    inArray(notesGroupTable.id, noteGroupJunctionId.map((group) => {
                        return group.groupId
                    })
                    )
                )

            console.log("note group", noteGroup);

            const allGroup: NoteGroupType[] = await trx
                .select({
                    id: notesGroupTable.id,
                    name: notesGroupTable.name
                })
                .from(notesGroupTable)
                .where(
                    eq(notesGroupTable.userId, userId)
                )

            console.log("all group", allGroup);


            //check if a group is not in allGroup
            const notExistGroup = groups.filter((group) => {
                return !allGroup.some((exist) => {
                    return exist.name === group
                })
            })

            console.log("not exist group", notExistGroup);

            //check if a group is in allGroup
            const existGroup = groups.filter((group) => {
                return allGroup.some((exist) => {
                    return exist.name === group
                })
            })

            console.log("exist group", existGroup);

            //query group that already exist
            const existGroupQuery = await trx
                .select({
                    id: notesGroupTable.id,
                    name: notesGroupTable.name
                })
                .from(notesGroupTable)
                .where(
                    and(
                        eq(notesGroupTable.userId, userId),
                        inArray(notesGroupTable.name, existGroup)
                    )
                )

            console.log("exist group query", existGroupQuery);

            //get remove group, group in noteGroup but not in existGroupQuery
            const removeGroup = noteGroup.filter((group) => {
                return !existGroupQuery.some((exist) => {
                    return exist.name === group.name
                })
            })

            console.log("remove group", removeGroup);

            //delete group in junction table
            if (removeGroup.length > 0) {

                //delete group in junction table
                await trx
                    .delete(notesGroupJunctionTable)
                    .where(
                        and(
                            eq(notesGroupJunctionTable.noteId, id),
                            inArray(notesGroupJunctionTable.groupId, removeGroup.map((group) => {
                                return group.id
                            }))
                        )
                    )
            }

            //insert new group to group table and junction table
            if (notExistGroup.length > 0) {
                //create new group
                const resGroup: NoteGroupType[] = await trx
                    .insert(notesGroupTable)
                    .values(
                        notExistGroup.map((group) => {
                            return {
                                userId: userId,
                                name: group
                            }
                        })
                    )
                    .returning({
                        id: notesGroupTable.id,
                        name: notesGroupTable.name
                    })

                console.log("res group", resGroup);

                //insert junction table
                await trx
                    .insert(notesGroupJunctionTable)
                    .values(
                        resGroup.map((group) => {
                            return {
                                userId: userId,
                                groupId: group.id,
                                noteId: id
                            }
                        })
                    )
            }


        })
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