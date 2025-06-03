
import { Request, Response } from "express";
import { UserCreateType, UserModelType } from "@workspace/types";
import { userCreateService } from "../service/user.service";
import jwt from 'jsonwebtoken';
import { ApiError } from "../lib/apiError";
import { verifyToken } from "../lib/jwt.util";

/* 
    user sign up
*/
export const userSignUpController = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            email,
            password,
            confirmPassword,
            username,
            birthdate,
            firstName,
            lastName,
            profilePicture,
            lastLogin,
        } = req.body;

        const reqBody: UserCreateType = {
            email,
            password,
            confirmPassword,
            username,
            birthdate,
            firstName,
            lastName,
            profilePicture,
            lastLogin,
        };

        const user: UserModelType = await userCreateService(reqBody);

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: '60m' });

        const refreshToken = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.REFRESH_TOKEN_SECRET! as string, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
                    priority: 'high',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days,
                });

        //throw server error if token is undefined
        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Internal Server Error", {
                message: "Token is undefined"
            });
        }

        res.status(201).json({ message: "User created successfully", user: user, accessToken: accessToken });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message, error: error.error });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};


/* 
    revaildate token
*/
export const userRevalidateTokenController = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.cookie?.split(' ')[0].split('=')[1];

        if (!token) {
            console.error("No token found");
            throw new ApiError(401, "No token found", {
                message: "unauthorized"
            });
        }

        if (!process.env.REFRESH_TOKEN_SECRET) {
            console.error("No refresh token secret found");
            throw new Error("No refresh token secret found");
        }

        const decodedData = await verifyToken(token, 'refresh');

        const user = {
            id: decodedData.id,
            email: decodedData.email,
            username: decodedData.username
        }

        const accessToken = decodedData.accessToken;

        res.status(200).json({ message: "Token revalidated successfully", user: user, accessToken: accessToken });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });

            //revoked token
            if (error.status === 401) {
                res.clearCookie('refreshToken');
            }
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }

};