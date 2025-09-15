import {z} from 'zod'

export const loginSchema = z.object({
    email: z.email("Email inválido"),
    password: z.string('A senha é obrigatória.').min(6, "Senha deve ter pelo menos 6 caracteres.")
})

export type SignInForm = z.infer<typeof loginSchema>