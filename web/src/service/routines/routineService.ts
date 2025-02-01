"use server";
import { RoutineReturnType } from "@/model/routine.model";
import { getAccessToken } from "../auth/authService";
import { redirect } from "next/navigation";

const api = process.env.SERVER_URL;

/* 
    get all routines
*/
export const routineGetAllService = async (filters?: string): Promise<RoutineReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + '/routine/' + (filters ? `?filter=${filters}` : ''),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["routineGetAll"]
                }
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

        //format date and time from utc to locale
        const formattedData = data.routines.map(routine => {
            return {
                ...routine,
                tasks: routine.tasks?.map(task => {
                    return {
                        ...task,
                        timeToDo: task.timeToDo,
                        deadline: new Date(task.deadline).toISOString().split("T")[0]
                    }
                })
            }
        });

        return formattedData;
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
    get all routine headers
*/
export const routineGetHeadersService = async (): Promise<{ id: string, title: string }[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + '/routine/headers',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["routineGetAllHeaders"]
                }
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
