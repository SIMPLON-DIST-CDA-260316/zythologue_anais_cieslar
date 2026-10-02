import { z } from "zod"

const PASSWORD_MESSAGE =
    "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"

export const loginSchema = z.object({
    email: z.email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est obligatoire")
        .min(12, PASSWORD_MESSAGE)
        .max(64, "Le mot de passe ne peut pas contenir plus de 64 caractères")
        .regex(/[A-Z]/, PASSWORD_MESSAGE)
        .regex(/[a-z]/, PASSWORD_MESSAGE)
        .regex(/[0-9]/, PASSWORD_MESSAGE)
        .regex(/[^A-Za-z0-9]/, PASSWORD_MESSAGE),
})