import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validator.emptyEmail' })
    .email({ message: 'validator.invalidEmailFormat' })
    .max(100, { message: 'validator.maxLengthEmail' }),
  password: z
    .string()
    .min(1, { message: 'validator.emptyPassword' })
    .max(100, { message: 'validator.maxLengthPassword' })
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>
