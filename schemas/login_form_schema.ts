import { z } from 'zod'

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'validator.emptyUsername' })
    .max(100, { message: 'validator.maxLengthUsername' }),
  password: z
    .string()
    .min(1, { message: 'validator.emptyPassword' })
    .max(100, { message: 'validator.maxLengthPassword' }),
  app: z.string(),
  requiredRoles: z.array(z.string())
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>
