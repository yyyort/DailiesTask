"use server";
import { RoutineCreateType, RoutineReturnType, RoutineUpdateType } from "@/model/routine.model";
import { getAccessToken } from "./authService";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* 
    get
*/
export const routineGetService = async (filters?: string): Promise<RoutineReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/routine/' + (filters ? `?filter=${filters}` : ''),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'default'
            }
        );

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }
            return [];
        }

        const data: {
            message: string;
            routines: RoutineReturnType[];
        } = await res.json();

        return data.routines;
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

        return [];
    }
}

export const routineGetHeadersService = async (): Promise<{ id: string, title: string }[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/routine/headers',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'default'
            }
        );

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }
            return [];
        }

        const data: {
            message: string;
            routines: {
                id: string;
                title: string;
            }[];
        } = await res.json();

        return data.routines;
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

        return [];
    }
}

/* 
    post
*/
export const routineAddService = async (data: RoutineCreateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/routine/',
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
        // revalidate the tasks
        revalidatePath('/routines');

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

        const res = await fetch(`http://localhost:4000/api/routine/${id}`,
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
        // revalidate the tasks
        revalidatePath('/routines');

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