
import { Request, Response } from "express";
import { userCreateService, userDeleteService, userGetService, userSignInService, userUpdateService } from "../service/user.service";
import { UserCreateType, UserReturnType } from "../model/user.model";
import { ApiError } from "../util/apiError";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../util/jwt.util";
import 'dotenv/config';
import { dailyJobs } from "../service/taskCron.service";
/* 
    user sign up
*/
export const userSignUpController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, confirmPassword, name } = req.body;

        const reqBody: UserCreateType = { email, password, confirmPassword, name };

        const user: UserReturnType = await userCreateService(reqBody);

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: '15m' });

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
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day,
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
    user sign in
*/
export const userSignInController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await userSignInService({ email, password });

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: '15m' });

        const refreshToken = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.REFRESH_TOKEN_SECRET! as string, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            priority: 'high',
            domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day,
        });

        //res.header('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`);

        //throw server error if token is undefined
        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Internal Server Error", {
                message: "Token is undefined"
            });
        }


        res.status(200).json({ message: "User signed in successfully", user: user, accessToken: accessToken });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    user get
*/
export const userGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        //if id is undefined or not a uuid
        if (!id || id.length !== 36) {
            throw new ApiError(400, "Invalid id", {
                message: "Invalid id"
            });
        }

        const user = await userGetService(id);

        res.status(200).json({ message: "User retrieved successfully", user: user });
    } catch (error: unknown) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    user update
*/
export const userUpdateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { email, password, name } = req.body;

        //if id is undefined or not a uuid
        if (!id || id.length !== 36) {
            throw new ApiError(400, "Invalid id", {
                message: "Invalid id"
            });
        }

        const data = { email, password, name };

        const user = await userUpdateService(id, data);

        res.status(200).json({ message: "User updated successfully", user: user });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }
};

/* 
    delete user
*/
export const userDeleteController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        //if id is undefined or not a uuid
        if (!id || id.length !== 36) {
            throw new ApiError(400, "Invalid id", {
                message: "Invalid id"
            });
        }

        const user = await userDeleteService(id);

        res.status(200).json({ message: "User deleted successfully", user: user });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    logout user
*/
export const userLogoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.cookie?.split(' ')[0].split('=')[1];

        if (!token) {
            console.error("No token found");
            throw new ApiError(401, "No token found", {
                message: "unauthorized"
            });
        }


        res.clearCookie('refreshToken');
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}

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
            name: decodedData.name
        }

        const accessToken = decodedData.accessToken;

        //revalidate routine tasks if user is logged in today
        await dailyJobs(user.id);

        res.status(200).json({ message: "Token revalidated successfully", user: user, accessToken: accessToken });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });

            //revoked token
            /* if (error.status === 401) {
                res.clearCookie('refreshToken');
            } */
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }

};