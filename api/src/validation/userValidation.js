import { z } from "zod";

export const createUserSchema = z.object({
    last_name: z.string().trim().min(1, "Last name cannot be empty"),
    first_name: z.string().trim().min(1, "First name cannot be empty"),
    email: z.email().toLowerCase(),
    password: z.string().min(12, "Password must be at least 12 characters")
        .max(64, "Password must be at most 64 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a digit")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
})
