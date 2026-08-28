import { z } from "zod";

export const createBeerSchema = z.object({
    name: z.string().trim().min(1, "Name cannot be empty"),
    description: z.string(),
    alcohol_deg: z.number().min(0, "Alcohol degree must be a positive number"),
    price: z.number().positive("Price must be a positive number"),
    brewery_id: z.number().min(1, "A valid brewery_id is required"),
});

export const updateBeerSchema = createBeerSchema.partial();
