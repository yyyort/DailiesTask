"use server";

import { UserReturnType } from "@/model/userModel";
import { cookies } from "next/headers";

export const setAccessToken = async (token: string) => {
    (await cookies()).set('accessToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 15 * 60  // 15 minutes
    })
};

export const setUserData = async (user: UserReturnType) => {
    (await cookies()).set('user', JSON.stringify(user), {
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60  // 7 days
    })
};

export const getAccessToken = async () => {
    return (await cookies()).get('accessToken')?.value;
};

export const getRefreshToken = async () => {
    return (await cookies()).get('refreshToken')?.value;
}

export const getUserData = async (): Promise<UserReturnType> => {
    return JSON.parse((await cookies()).get('user')?.value || '{}');
}

export const removeAccessToken = async () => {
    (await cookies()).delete('accessToken');
}

export const removeRefreshToken = async () => {
    (await cookies()).delete('refreshToken');
}



