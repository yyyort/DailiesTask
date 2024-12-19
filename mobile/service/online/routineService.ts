import { RoutineCreateType, RoutineReturnType, RoutineUpdateType } from "@/model/routine.model";
import * as SecureStore from 'expo-secure-store';

const api = 'http://192.168.5.139:4000'; // change this to your server url

/* 
    GET routines
*/
export const routineGetService = async (): Promise<RoutineReturnType[]> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + '/api/routine'
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

        if (!data.routines) {
            throw new Error('Routines not found');
        }

        const routines: RoutineReturnType[] = data.routines;

        return routines;
    } catch (error) {
        console.error(error);
        return [];
    }
};

/* 
    POST routine
*/
export const routineCreateService = async (formData: RoutineCreateType): Promise<RoutineReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        const res = await fetch(api + '/api/routine', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        const routine: RoutineReturnType = data.routine;

        return routine;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/* 
    PUT routine
*/
export const routineUpdateService = async (formData: RoutineUpdateType, id: string): Promise<RoutineReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        const res = await fetch(api + `/api/routine/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorMess = await res.json();
            throw new Error(errorMess.message);
        }

        const data = await res.json();

        if (!data.routine) {
            throw new Error('Routine not found');
        }

        const routine: RoutineReturnType = data.routine;

        return routine;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



/* 
    DELETE routine
*/
export const routineDeleteService = async (id: string): Promise<RoutineReturnType> => {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!api) {
            throw new Error('Server url not found');
        }

        const res = await fetch(api + `/api/routine/${id}`, {
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

        const routine: RoutineReturnType = data.routine;

        return routine;

    } catch (error) {
        console.error(error);
        throw error;
    }
};