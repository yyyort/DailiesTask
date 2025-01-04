"use server";
/* 
    get
*/
import { ContributionReturnType } from "@/model/contribution.model";
import { getAccessToken } from "./auth/authService";

const api = process.env.SERVER_URL


export const contributionGetService = async (): Promise<ContributionReturnType[]> => {
    try {
        const accessToken = await getAccessToken();

        const res = await fetch(api + '/contributions/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                cache: 'force-cache',
                next: {
                    revalidate: 60 * 24, //revalidate every 24 hours
                    tags: ["getContributions"]
                }
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