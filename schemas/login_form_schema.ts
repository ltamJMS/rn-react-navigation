import {z} from 'zod';

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, {message: 'Username is required'})
    .max(100, {message: 'Username is maximum 100 letters'}),
  password: z
    .string()
    .min(1, {message: 'Password is required'})
    .max(100, {message: 'Password is maximum 100 letters'}),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
