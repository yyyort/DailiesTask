"use server";

import { cookies } from "next/headers";

export const setAccessToken = async (token: string) => {
    (await cookies()).set('accessToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 15 * 60  // 15 minutes
    })
};

export const getAccessToken = async () => {
    return (await cookies()).get('accessToken')?.value;
};

export const removeAccessToken = async () => {
    (await cookies()).delete('accessToken');
}

export const authenticatedFetch = async (
    url: string,
    options: RequestInit = {}
) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error('Access token not found');
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
    };

    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });
}



