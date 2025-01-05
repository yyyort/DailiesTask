
import { TaskReturnType, TaskTodayReturnType } from "@/model/task.model";
import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/authService";

const api = process.env.SERVER_URL;

/* 
    get all tasks
*/
export const taskGetAllService = async (date?: string, filter?: string): Promise<TaskReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        // check date correct format
        /* if (date && !date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            console.error('Date format is incorrect');
            throw new Error('Date format is incorrect');
        } */
        if (date && filter) {
            const query = `?date=${date}&filter=${filter}`;
            const response = await fetch(api + '/task' + query, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["taskGetAll"]
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
                tasks: TaskReturnType[];
            } = await response.json();

            return data.tasks;
        } else if (date && !filter) {

            const response = await fetch(api + '/task' + (date ? `?date=${date}` : ''), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["taskGetAll"]
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
                tasks: TaskReturnType[];
            } = await response.json();

            return data.tasks;
        } else if (filter && date === undefined) {

            const response = await fetch(api + '/task' + (filter ? `?filter=${filter}` : ''), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["taskGetAll"]
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
                tasks: TaskReturnType[];
            } = await response.json();

            return data.tasks;
        } else {


            const response = await fetch(api + '/task', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["taskGetAll"]
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
                tasks: TaskReturnType[];
            } = await response.json();

            return data.tasks;
        }
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
    GET all tasks with only headers
*/
export const taskGetEverythingService = async (): Promise<{ id: string, date: Date }[]> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + '/task/everything', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            cache: 'force-cache',
            next: {
                tags: ["taskGetAllHeaders"]
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
            tasks: { id: string, date: string }[];
        } = await response.json();

        return data.tasks.map(task => ({
            id: task.id,
            date: new Date(task.date)
        }));
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
    get all today tasks
*/
export const taskTodayGetService = async (filter?: string): Promise<TaskTodayReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + '/task/today' + (filter ? `?filter=${filter}` : '')
            , {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    tags: ["taskGetToday"]
                }
            });

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }

            return [];
        }

        const data: {
            message: string;
            tasks: TaskTodayReturnType[];
        } = await res.json();

        return data.tasks;

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
};


