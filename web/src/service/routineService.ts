"use server";
import { RoutineCreateType, RoutineReturnType } from "@/model/routine.model";
import { getAccessToken } from "./authService";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* 
    get
*/
export const routineGetService = async (): Promise<RoutineReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/routine/',
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

/* 
    delete
*/