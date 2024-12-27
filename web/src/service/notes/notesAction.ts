"use server"
import { NoteCreateType, NoteType, NoteUpdateType } from "@/model/notes.model";
import { getAccessToken } from "../auth/authService";
import { revalidateTag } from "next/cache";

const api = process.env.SERVER_URL

/* 
    to patch DOMPurify not working in server actions
*/

/* 
    POST api/notes
*/
export const notesPostService = async (data: NoteCreateType): Promise<NoteType> => {
    try {
        console.log('in service', data)

        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
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

        //revalidate notesGetAll tag
        revalidateTag('notesGetAll')

        if (data.pinned) {
            revalidateTag('notesGetAllPinned')
        }

        if (data.group) {
            revalidateTag('notesGetGroups')
        }


        return responseData.note;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
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
    POST api/notes/groups
*/
export const notesPostGroupService = async (name: string): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes/groups', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        //revalidate tag
        revalidateTag('notesGetGroups')

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }
    }
}


/* 
    PUT api/notes/:id
*/
export const notesUpdateService = async (id: string, data: NoteUpdateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes/' + (id), {
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

        //revalidate notesGetAll tag
        revalidateTag('notesGetAll')
        revalidateTag('notesGetAllPinned')
        revalidateTag('notesGetGroups')

    } catch (error) {
        console.error(error)
        if (error instanceof Error) {
            console.error(error);
        }
    }
}

/* 
    PATCh api/notes/:id/pinned
*/
export const notesUpdatePinnedService = async (id: string, data: boolean): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes/' + (id) + '/pinned', {
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

        //revalidate notesGetAll tag
        revalidateTag('notesGetAll')
        revalidateTag('notesGetAllPinned')

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

        const response = await fetch(api + '/notes/' + (id), {
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

        //revalidate notesGetAll tag
        revalidateTag('notesGetAll')
        revalidateTag('notesGetAllPinned')


    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }
    }
}

/* 
    DELETE api/notes/groups/:name
*/
export const notesGroupDeleteService = async (name: string,): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/notes/groups/' + (name), {
            method: 'DELETE',
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
        }

        //revalidate notesGetAll tag
        revalidateTag('notesGetAll')
        revalidateTag('notesGetAllPinned')
        revalidateTag('notesGetGroups')

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Failed to get note');
        }
    }
}