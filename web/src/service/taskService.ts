"use server"
import { TaskCreateType, TaskReturnType, TaskStatusType, TaskTodayReturnType, TaskUpdateType } from "@/model/task.model";
import { getAccessToken } from "./authService";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* 
    get all tasks
*/
export const taskGetService = async (date?: string): Promise<TaskReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        // check date correct format
        /* if (date && !date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            console.error('Date format is incorrect');
            throw new Error('Date format is incorrect');
        } */

        const response = await fetch('http://localhost:4000/api/task' + (date ? `?date=${date}` : ''), {
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
            tasks: TaskReturnType[];
        } = await response.json();

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
}

export const taskGetEverythingService = async (): Promise<{id: string, date: Date}[]> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/task/everything', {
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
            tasks: {id: string, date: string}[];
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
export const taskTodayGetService = async (filter?: TaskStatusType[]): Promise<TaskTodayReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(
            'http://localhost:4000/api/task/today' + (filter ? `?filter=${filter.join(' ')}` : '')
            , {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache'
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


/* 
    create a task
*/
export const taskCreateService = async (data: TaskCreateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/task', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized');
            }
        }


        // revalidate the tasks
        revalidatePath('/tasks');

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                throw new Error('Failed to create task');
            }
        }
    }
};


/* 
    update task
*/
export const taskUpdateService = async (id: number, data: TaskUpdateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`http://localhost:4000/api/task/${id}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
            cache: 'no-cache'
        })


        if (!response.ok) {
            console.error(response.json());
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        // revalidate the tasks
        revalidatePath('/tasks');
        revalidatePath('/routines');

    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
            }
        }
    }
}


/* 
    update task status
*/
export const taskUpdateStatusService = async (id: number, status: TaskStatusType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`http://localhost:4000/api/task/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                status: status
            }),
            cache: 'no-cache'
        });

        if (!response.ok) {
            console.error(response.json());
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        // revalidate the tasks
        revalidatePath('/tasks');

    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
            }
        }
    }
}

/* 
    delete a task
*/
export const taskDeleteService = async (id: number): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`http://localhost:4000/api/task/${id}`,
            {
                method: 'DELETE',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (!response.ok) {
            console.error(response.json());
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
        }

        // revalidate the tasks
        revalidatePath('/tasks');
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
            }
        }
    }
}