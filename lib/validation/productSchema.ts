import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z
    .string()
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, {
      message: "Price must be a number >= 0",
    }),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().optional().or(z.literal("")).nullable(),
});
