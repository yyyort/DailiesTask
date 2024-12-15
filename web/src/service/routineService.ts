import { RoutineReturnType } from "@/model/routine.model";
import { getAccessToken } from "./authService";
import { redirect } from "next/navigation";

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
                cache: 'force-cache'
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

/* 
    put
*/

/* 
    delete
*/