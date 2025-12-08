"use server";

import prisma from "./prisma";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductSchema } from "./validation/productSchema";

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

/* -----------------------------
   CREATE PRODUCT
------------------------------ */
export async function createProduct(prevState: State, formData: FormData) {
  const session = await getSession();
  if (!session) return { message: "You must be logged in." };

  const validated = ProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    inStock: formData.get("inStock"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create product."
    };
  }

  const { name, description, price, category, imageUrl, inStock } =
    validated.data;

  await prisma.product.create({
    data: {
      name,
      description,
      priceCents: price * 100,
      category,
      imageUrl: imageUrl || null,
      inStock,
      userEmail: session.email,
    },
  });

  revalidatePath("/my-products");
  revalidatePath("/products");
  redirect("/my-products");
}

/* -----------------------------
   GET PRODUCT (ownership optional)
------------------------------ */
export async function getProductById(id: string | number) {
  const productId = typeof id === "string" ? Number(id) : id;
  if (isNaN(productId)) return null;

  return prisma.product.findUnique({
    where: { id: productId },
  });
}

/* -----------------------------
   GET PRODUCT BUT ONLY IF USER OWNS IT
------------------------------ */
async function getOwnedProduct(productId: number, userId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.userId !== userId) {
    throw new Error("Product not found or you do not own this product");
  }

  return product;
}

/* -----------------------------
   UPDATE PRODUCT
------------------------------ */
export async function updateProduct(
  id: number,
  prevState: State,
  formData: FormData
) {
  const session = await getSession();
  if (!session) return { message: "You must be logged in." };

  const validated = ProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    inStock: formData.get("inStock"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update product."
    };
  }

  const { name, description, price, category, imageUrl, inStock } =
    validated.data;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      priceCents: price * 100,
      category,
      imageUrl: imageUrl || null,
      inStock,
    },
  });

  revalidatePath("/my-products");
  revalidatePath("/products");
  redirect("/my-products");
}

/* -----------------------------
   DELETE PRODUCT
------------------------------ */
export async function deleteProduct(id: string | number) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const productId = typeof id === "string" ? Number(id) : id;
  if (isNaN(productId)) throw new Error("Invalid product ID");

  // ensure product belongs to this user
  await getOwnedProduct(productId, session.userId);

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/my-products");
  revalidatePath("/products");
  redirect("/my-products");
}
