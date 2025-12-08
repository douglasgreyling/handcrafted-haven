import { getSession } from "../../../../lib/auth";
import { notFound, redirect } from "next/navigation";
import { PrismaClient } from '@prisma/client'
import DeleteProductForm from "../../../../components/DeleteProduct";

const prisma = new PrismaClient()

export default async function DeleteProductPage({ params }) {
  const session = await getSession();
  if (!session) return redirect("/auth");

  const resolvedParams = await params;
  const id = Number(resolvedParams?.id);
  if (isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();
  if (product.userId !== session.userId) return notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Delete Product</h1>

        <p className="mb-6">
          Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
        </p>

        <DeleteProductForm productId={product.id} />
      </div>
    </main>
  );
}
