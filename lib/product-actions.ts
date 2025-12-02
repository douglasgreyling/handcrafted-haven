"use server";

import prisma from "./prisma";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Convert string or number ID to a valid number
 * Throws an error if the ID is invalid
 */
function parseProductId(id: string | number): number {
  const productId = typeof id === "string" ? Number(id) : id;
  if (isNaN(productId) || productId <= 0) {
    throw new Error("Invalid product ID");
  }
  return productId;
}

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
    data: { name, description, priceCents, category, imageUrl, inStock: true },
  });

  revalidatePath("/my-products");
  redirect("/my-products");
}

export async function updateProduct(id: string | number, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const productId = parseProductId(id);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceStr = String(formData.get("price") || "0").trim();
  const category = String(formData.get("category") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;

  const priceCents = Math.round(Number(priceStr) * 100);

  await prisma.product.update({
    where: { id: productId },
    data: { name, description, priceCents, category, imageUrl },
  });

  revalidatePath("/my-products");
  redirect("/my-products");
}

export async function deleteProduct(id: string | number) {
  const session = await getSession();
  if (!session) redirect("/auth");

  const productId = parseProductId(id);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/my-products");
  redirect("/my-products");
}

export async function getProductById(id: string | number) {
  const productId = parseProductId(id);
  return prisma.product.findUnique({ where: { id: productId } });
}
