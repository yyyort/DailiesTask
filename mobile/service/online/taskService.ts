import { TaskCreateType, TaskReturnType, TaskStatusType, TaskTodayReturnType, TaskUpdateType } from "@/model/task.model";
import * as SecureStore from 'expo-secure-store';


const api = 'http://192.168.5.139:4000'; // change this to your server url

/* 
    GET tasks
*/
export const taskTodayGetService = async (filter?: TaskStatusType[]): Promise<TaskTodayReturnType[]> => {
    try {
        //get access token from secure store
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        //join filter in into one string
        const filterStr = filter ? filter.join(' ') : null;


        const res = await fetch(api + '/api/task/today'
            + (filterStr ? `?filter=${filterStr}` : '')
            , {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        if (!data.tasks) {
            throw new Error('Tasks not found');
        }

        const tasks: TaskTodayReturnType[] = data.tasks;

        return tasks;
    } catch (error) {
        console.error(error);
        return [];
    }
}

/* 
    GET all tasks
*/

/* 
    POST task  
*/
export const taskCreateService = async (task: TaskCreateType): Promise<TaskReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + '/api/task', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(task),
        });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        if (!data.task) {
            throw new Error('Task not found');
        }

        const newTask: TaskReturnType = data.task;

        return newTask;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

/* 
    PUT task
*/
export const taskUpdateStatusService = async (id: number, status: TaskStatusType): Promise<TaskReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + `/api/task/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        if (!data.task) {
            throw new Error('Task not found');
        }

        const updatedTask: TaskReturnType = data.task;

        return updatedTask;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const taskUpdateService = async (id: number, task: TaskUpdateType): Promise<TaskReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + `/api/task/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(task),
        });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        if (!data.task) {
            throw new Error('Task not found');
        }

        const updatedTask: TaskReturnType = data.task;

        return updatedTask;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

/* 
    DELETE task
*/
export const taskDeleteService = async (id: number): Promise<TaskReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + `/api/task/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        if (!data.task) {
            throw new Error('Task not found');
        }

        const deletedTask: TaskReturnType = data.task;

        return deletedTask;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
