"use server"
import { TaskCreateType, TaskReturnType, TaskStatusType, TaskTodayReturnType } from "@/model/task.model";
import { getAccessToken } from "./authService";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const taskGetService = async (): Promise<TaskReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/task/', {
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

export const taskTodayGetService = async (): Promise<TaskTodayReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/task/today', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
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