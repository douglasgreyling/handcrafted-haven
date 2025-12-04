"use server";

import prisma from "./prisma";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* -----------------------------
   CREATE PRODUCT
------------------------------ */
export async function createProduct(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceStr = String(formData.get("price") || "0").trim();
  const category = String(formData.get("category") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;

  const priceCents = Math.round(Number(priceStr) * 100);

  await prisma.product.create({
    data: {
      name,
      description,
      priceCents,
      category,
      imageUrl,
      inStock: true,
      userId: session.userId,
    },
  });

  revalidatePath("/my-products");
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
export async function updateProduct(id: string | number, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const productId = typeof id === "string" ? Number(id) : id;
  if (isNaN(productId)) throw new Error("Invalid product ID");

  await getOwnedProduct(productId, session.userId);

  const getField = (fd, key) => {
    if (!fd) return undefined;
    if (typeof fd.get === "function") return fd.get(key);
    return fd[key];
  };

  const name = String(getField(formData, "name") || "").trim();
  const description = String(getField(formData, "description") || "").trim();
  const priceStr = String(getField(formData, "price") || "0").trim();
  const category = String(getField(formData, "category") || "").trim() || null;
  const imageUrl = String(getField(formData, "imageUrl") || "").trim() || null;

  const priceCents = Math.round(Number(priceStr) * 100);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      priceCents,
      category,
      imageUrl,
    },
  });

  revalidatePath("/my-products");
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
  redirect("/my-products");
}
