"use server";
/* 
    get
*/
import { ContributionReturnType } from "@/model/contribution.model";
import { getAccessToken } from "./authService";

export const contributionGetService = async (): Promise<ContributionReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch('http://localhost:4000/api/contributions/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'default'
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
            contributions: ContributionReturnType[];
        } = await res.json();

        return data.contributions;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        }

        return [];
    }

}