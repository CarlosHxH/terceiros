import {z} from 'zod'

export const pontoSchema = z.object({
    foto: z.file(),
    ip: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    funcionario: z.number
})

export type PontoForm = z.infer<typeof pontoSchema>