import { z } from "zod"

const PASSWORD_MESSAGE =
    "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"

const passwordSchema = z.string().min(1, "Le mot de passe est obligatoire")
    .min(12, PASSWORD_MESSAGE)
    .max(64, "Le mot de passe ne peut pas contenir plus de 64 caractères")
    .regex(/[A-Z]/, PASSWORD_MESSAGE)
    .regex(/[a-z]/, PASSWORD_MESSAGE)
    .regex(/[0-9]/, PASSWORD_MESSAGE)
    .regex(/[^A-Za-z0-9]/, PASSWORD_MESSAGE)

export const loginSchema = z.object({
    email: z.email("Email invalide"),
    password: passwordSchema,
})

export const registerSchema = z.object({
    first_name: z.string().trim().min(1, "Le prénom est obligatoire"),
    last_name: z.string().trim().min(1, "Le nom est obligatoire"),
    email: z.email("Email invalide"),
    password: passwordSchema,
    confirm_password: z.string().min(1, "Veuillez confirmer le mot de passe"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
})
