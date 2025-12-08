import { z } from "zod";

export const ProductSchema = z.object({
	name: z.string().min(1, "Product name required"),
	description: z.string().optional(),
	price: z.coerce.number().gt(0, "Price must be greater than 0"),
	category: z.string().min(1, "Category required"),
	imageUrl: z.string().url("Invalid image URL").optional().or(z.string().length(0)),
	inStock: z
		.string()
		.transform((v) => v === "true"),
});

export default ProductSchema;
