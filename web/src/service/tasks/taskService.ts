
import { TaskReturnType } from "@/model/task.model";
import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/authService";

const api = process.env.SERVER_URL;

/* 
    get all tasks
*/
export const taskGetAllService = async ({
    date,
    filter
}: {
    date?: string;
    filter?: string;
}): Promise<TaskReturnType[]> => {
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

            //convert date and time from utc to local
            const formattedData = data.tasks.map(task => {
                return {
                    ...task,
                    timeToDo: new Date(`${task.deadline}T${task.timeToDo}.000Z`).toLocaleTimeString("en-US", {
                        hour12: false,
                    }),
                    deadline: new Date(task.deadline).toISOString().split("T")[0]
                }
            });

            return formattedData;
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

            //convert date and time from utc to local
            const formattedData = data.tasks.map(task => {
                return {
                    ...task,
                    timeToDo: new Date(`${task.deadline}T${task.timeToDo}.000Z`).toLocaleTimeString("en-US", {
                        hour12: false,
                    }),
                    deadline: new Date(task.deadline).toISOString().split("T")[0]
                }
            });

            return formattedData;
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

            //convert date and time from utc to local
            const formattedData = data.tasks.map(task => {
                return {
                    ...task,
                    timeToDo: new Date(`${task.deadline}T${task.timeToDo}.000Z`).toLocaleTimeString("en-US", {
                        hour12: false,
                    }),
                    deadline: new Date(task.deadline).toISOString().split("T")[0]
                }
            });

            return formattedData;
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
                redirect('/signin');
            }

            const data: {
                message: string;
                tasks: TaskReturnType[];
            } = await response.json();

            //convert date and time from utc to local
            const formattedData = data.tasks.map(task => {
                return {
                    ...task,
                    timeToDo: new Date(`${task.deadline}T${task.timeToDo}.000Z`).toLocaleTimeString("en-US", {
                        hour12: false,
                    }),
                    deadline: new Date(task.deadline).toISOString().split("T")[0]
                }
            });

            return formattedData;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            redirect('/signin');
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
            redirect('/signin');
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

            redirect('/signin');

        }

        return [];
    }
}

