import { Request, Response } from 'express';
import { ApiError } from '../util/apiError';
import { noteCreateService, notesDeleteService, notesRead, notesReadAll, notesReadAllGroup, notesUpdateGroupService, notesUpdatePinnedService, notesUpdateService } from '../service/notes.service';
import { NoteCreateType, NoteUpdateType } from '../model/notes.model';

/* 
    GET /api/notes
*/
export const notesGetAllController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const groups = req.query.groups as string;

        //process groups
        const filterGroups = groups ? groups.split("-") : [];

        const notes = await notesReadAll(userId, filterGroups);

        res.status(200).json({ message: "Notes retrieved successfully", notes: notes });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};


/* 
    GET /api/notes/:id
*/
export const notesGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const noteId = req.params.id;

        const notes = await notesRead(userId, noteId);

        res.status(200).json({ message: "Notes retrieved successfully", notes: notes });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    GET /api/notes/groups
*/
export const notesGetAllGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;

        const notesGroup = await notesReadAllGroup(userId);

        res.status(200).json({ message: "Notes retrieved successfully", notesGroup: notesGroup });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    POST /api/notes
*/
export const notesPostController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const { title, content, pinned, group } = req.body;

        const data: NoteCreateType = {
            title: title as string,
            content: content as string,
            pinned: pinned as boolean,
            group: group as string[],
        };

        const notes = await noteCreateService(userId, data);

        res.status(201).json({ message: "Notes created successfully", notes: notes });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    PUT /api/notes/:id
*/
export const notesPutController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const noteId = req.params.id;
        const { title, content, pinned, group } = req.body;

        const data: NoteUpdateType = {
            title: title as string,
            content: content as string,
            pinned: pinned as boolean,
            group: group as string[],
        };

        const notes = await notesUpdateService(userId, noteId, data);

        res.status(200).json({ message: "Notes updated successfully", notes: notes });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }
};

/* 
    PUT /api/notes/:id/pinned
*/
export const notesPutPinnedController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const noteId = req.params.id;
        const pinned = req.body.pinned;


        await notesUpdatePinnedService(userId, noteId, pinned as boolean);

        res.status(200).json({ message: "Notes updated successfully" });

    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}

/* 
    PUT /api/notes/:id/group
*/
export const notesPutGroupController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const noteId = req.params.id;
        const group = req.body.group;

        const data = group as string[];

        await notesUpdateGroupService(userId, noteId, data);

        res.status(200).json({ message: "Notes updated successfully" });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }
};

/* 
    DELETE /api/notes/:id
*/
export const notesDeleteController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const noteId = req.params.id;

        await notesDeleteService(userId, noteId);

        res.status(200).json({ message: "Notes updated successfully" });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }
};
