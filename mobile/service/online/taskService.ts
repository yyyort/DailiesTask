import { TaskReturnType } from "@/model/task.model";
import * as SecureStore from 'expo-secure-store';


const api = 'http://192.168.5.139:4000'; // change this to your server url

/* 
    GET tasks
*/
export const getTasks = async (): Promise<TaskReturnType[]> => {
    try {
        //get access token from secure store
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + '/api/task', {
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

        if (!data) {
            throw new Error('Tasks not found');
        }

        return data.tasks;
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

/* 
    PUT task
*/

/* 
    DELETE task
*/