import { z } from "zod";

export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().refine(
        data => data.length > 0,
        {
            message: "Name cannot be empty",
        }
    ),
    password: z.string().min(6),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const UserReturnSchema = UserModelSchema.omit({ password: true, createdAt: true, updatedAt: true });
export const UserCreateSchema = UserModelSchema.pick({ email: true, password: true, name: true }).extend({
    confirmPassword: z.string().min(6),
}).refine(
    data => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
    }
);
export const UserSignInSchema = UserModelSchema.pick({ email: true, password: true });
export const UserUpdateSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    name: z.string().optional(),
})

export type UserModelType = z.infer<typeof UserModelSchema>;
export type UserReturnType = z.infer<typeof UserReturnSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
export type UserSignInType = z.infer<typeof UserSignInSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
