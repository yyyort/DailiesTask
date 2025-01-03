"use server"
import { TaskCreateType, TaskStatusType, TaskUpdateType } from "@/model/task.model";
import { redirect } from "next/navigation";

import { getAccessToken } from "../auth/authService";
import { revalidateTag } from "next/cache";

const api = process.env.SERVER_URL;

/* 
    create a task
*/
export const taskCreateService = async (data: TaskCreateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + '/task', {
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
        revalidateTag('taskGetAll');
        revalidateTag('taskGetAllHeaders');
        revalidateTag('taskGetToday');

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
export const taskUpdateService = async (id: string, data: TaskUpdateType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + `/task/${id}`, {
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
        revalidateTag('taskGetAll');
        revalidateTag('taskGetAllHeaders');
        revalidateTag('taskGetToday');

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
export const taskUpdateStatusService = async (id: string, status: TaskStatusType): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + `/task/${id}`, {
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
        // revalidate the tasks
        revalidateTag('taskGetAll');
        revalidateTag('taskGetAllHeaders');
        revalidateTag('taskGetToday');

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
export const taskDeleteService = async (id: string): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(api + `/task/${id}`,
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
        revalidateTag('taskGetAll');
        revalidateTag('taskGetAllHeaders');
        revalidateTag('taskGetToday');
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