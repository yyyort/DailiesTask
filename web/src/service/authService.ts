"use server";

import { cookies } from "next/headers";

export const setAccessToken = async (token: string) => {
    (await cookies()).set('accessToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 15 * 60  // 15 minutes
    })
};

export const setRefreshToken = async (token: string) => {
    (await cookies()).set('refreshToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60  // 7 days
    })
};

export const getAccessToken = async () => {
    return (await cookies()).get('accessToken')?.value;
};

export const removeAccessToken = async () => {
    (await cookies()).delete('accessToken');
}

export const removeRefreshToken = async () => {
    (await cookies()).delete('refreshToken');
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



