import { NoteType } from "@/model/notes.model"
import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/authService";

const api = process.env.SERVER_URL

/* 
    GET ALL api/notes
*/
export const notesGetAllService = async (groups?: string): Promise<NoteType[]> => {
    try {
        const accessToken = await getAccessToken();

        if (groups && groups.length > 1) {
            console.log('groups filter in service', groups);

            const response = await fetch(api + `/notes?groups=${groups}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["notesGetAll"]
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                return [];
            }

            const data: {
                message: string;
                notes: NoteType[];
            } = await response.json();

            return data.notes;
        }

        const response = await fetch(api + '/notes', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'force-cache',
            next: {
                tags: ["notesGetAll"]
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            return [];
        }

        const data: {
            message: string;
            notes: NoteType[];
        } = await response.json();

        return data.notes;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to get notes');
            }
        }

        return [];

    }
}

/* 
    GET
*/
export const notesGetAllPinnedController = async (): Promise<NoteType[]> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes/pinned', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'force-cache',
            next: {
                tags: ['notesGetAllPinned']
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            return [];
        }

        const data: {
            message: string;
            notes: NoteType[];
        } = await response.json();

        return data.notes;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to get notes');
            }
        }

        return [];

    }
}


/* 
    GET all note groups api/notes/groups
*/
export const notesGetGroupsService = async (): Promise<{
    id: string;
    name: string;
}[]> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes/groups', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'force-cache',
            next: {
                tags: ['notesGetGroups']
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            return [];
        }

        const data: {
            message: string;
            groups: {
                id: string;
                name: string;
            }[];
        } = await response.json();

        console.log('groups in service', data.groups);

        return data.groups;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to get note groups');
            }
        }

        return [];

    }
}


/* 
    GET note by id api/note/:id
*/
export const notesGetSerive = async (id: string): Promise<NoteType> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + `/notes/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            return {
                id: '',
                userId: '',
                title: '',
                content: '',
                pinned: false,
                group: [],
                createdAt: '',
                updatedAt: ''
            };
        }

        const data: {
            message: string;
            notes: NoteType;
        } = await response.json();

        return data.notes;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }

        return {
            id: '',
            userId: '',
            title: '',
            content: '',
            pinned: false,
            group: [],
            createdAt: '',
            updatedAt: ''
        };

    }
}

