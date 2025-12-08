'use server';

import ProductForm from "../../../../components/edit-product";
import { getSession } from "../../../../lib/auth";
import { notFound, redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { updateProduct } from "../../../../lib/product-actions";

export default async function EditProductPage({ params }) {
  const session = await getSession();
  if (!session) return redirect("/auth");

  const resolvedParams = await params;
  const id = Number(resolvedParams?.id);
  if (isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();


  const productForForm = {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: (product.priceCents / 100).toFixed(2),
    category: product.category || "",
    imageUrl: product.imageUrl || "",
    inStock: product.inStock,
  };

  const updateWithId = updateProduct.bind(null, id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

        <ProductForm product={productForForm} action={updateWithId} />
      </div>
    </main>
  );
}
