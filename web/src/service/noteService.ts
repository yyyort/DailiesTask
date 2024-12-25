import { NoteCreateType, NoteType, NoteUpdateType } from "@/model/notes.model"
import { redirect } from "next/navigation";
import { getAccessToken } from "./authService";

/* 
    GET ALL api/notes
*/
export const notesGetAllService = async (groups?: string): Promise<NoteType[]> => {
    try {
        const accessToken = await getAccessToken();

        console.log('groups in service web', groups);

        if (groups && groups.length > 1) {
            console.log('groups filter in service', groups);

            const response = await fetch(`http://localhost:4000/api/notes?groups=${groups}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'no-cache'
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

        const response = await fetch('http://localhost:4000/api/notes', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'no-cache'
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

        const response = await fetch('http://localhost:4000/api/notes/groups', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'no-cache'
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

        const response = await fetch(`http://localhost:4000/api/notes/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'no-cache'
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


/* 
    POST api/notes
*/
export const notesPostService = async (data: NoteCreateType): Promise<NoteType> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/notes', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
            cache: 'no-cache'
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

        const responseData: {
            message: string;
            note: NoteType;
        } = await response.json();

        return responseData.note;

    } catch (error) {
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

/* 
    PUT api/notes/:id
*/
export const notesUpdateService = async (id: string, data: NoteUpdateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/notes/' + (id), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
            cache: 'no-cache'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }
    }
}

/* 
    PATCh api/notes/:id/pinned
*/
export const notesUpdatePinnedService = async (id: string, data: boolean): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/notes/' + (id) + '/pinned', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                pinned: data
            }),
            cache: 'no-cache'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }
    }
}



/* 
    DELETE api/notes/:id
*/
export const notesDeleteService = async (id: string,): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/notes/' + (id), {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }
    }
}