"use server";
import { RoutineCreateType, RoutineUpdateType } from "@/model/routine.model";
import { getAccessToken } from "../auth/authService";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

const api = process.env.SERVER_URL;

/* 
    post
*/
export const routineAddService = async (data: RoutineCreateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + '/routine/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            }
        );

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        //revalidate
        revalidateTag('routineGetAll');
        revalidateTag('routineGetAllHeaders');
        revalidateTag('taskGetToday');

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to get tasks');
            }
        }
    }
}

/* 
    put
*/
export const routineUpdateService = async (data: RoutineUpdateType, id: string): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        console.log('data in service', data);

        const res = await fetch(api + `/routine/${id}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            }
        );

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        //revalidate
        revalidateTag('routineGetAll');
        revalidateTag('routineGetAllHeaders');
        revalidateTag('taskGetToday');

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to get tasks');
            }
        }
    }
}


/* 
    delete
*/
export const routineDeleteService = async (id: string): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + `/routine/${id}`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },

            }
        );

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        //revalidate
        revalidateTag('routineGetAll');
        revalidateTag('routineGetAllHeaders');
        revalidateTag('taskGetToday');

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to get tasks');
            }
        }
    }
}