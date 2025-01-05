"use server";

import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken } from "./authService";

const api = process.env.SERVER_URL

export const SignOutApi = async () => {
    try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        console.log("api", api);

        if (!api) {
            throw new Error("Server url not found");
        }

        if (!accessToken) {
            throw new Error("Access token not found");
        }

        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }

        const res = await fetch(api + "/user/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'Cookie': `refreshToken=${refreshToken}`
            },
        });

        if (!res.ok) {
            const errorMess = await res.json();

            throw new Error(errorMess.message);
        }

        if (res.ok) {
            await removeAccessToken();
            await removeRefreshToken();
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);

            throw error;
        }

    }
};