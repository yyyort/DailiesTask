import z from 'zod';

export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6),
    lastLogin: z.date(),
    birthdate: z.date(),
    profilePicture: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const UserReturnSchema = UserModelSchema.omit({ password: true, createdAt: true, updatedAt: true });

export const UserCreateSchema = UserModelSchema.omit({ createdAt: true, updatedAt: true, id: true }).extend({
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
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthdate: z.date().optional(),
    profilePicture: z.string().optional().nullable(),
    lastLogin: z.date().optional(),
})

export type UserModelType = z.infer<typeof UserModelSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
export type UserSignInType = z.infer<typeof UserSignInSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
