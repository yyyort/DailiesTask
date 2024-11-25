import { z } from "zod";

export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const UserReturnSchema = UserModelSchema.omit({ password: true, createdAt: true, updatedAt: true });
export const UserCreateSchema = UserModelSchema.pick({ email: true, password: true }).extend({
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
})

export type UserModelType = z.infer<typeof UserModelSchema>;
export type UserReturnType = z.infer<typeof UserReturnSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
export type UserSignInType = z.infer<typeof UserSignInSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
