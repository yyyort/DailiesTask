"use server";

import { TaskReturnType } from "@/model/task.model";
import { getAccessToken } from "./authService";
import { redirect } from "next/navigation";

export const taskGetService = async (): Promise<TaskReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('http://localhost:4000/api/task/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            if (error.message === 'Unauthorized') {
                redirect('/signin');
            } else {
                console.error(error);
                return [];
            }
        }

        return [];
    }
}