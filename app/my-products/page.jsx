import prisma from "../../lib/prisma";
import { getSession } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SellerProductCard from "../../components/SellerProductCard";
import { Suspense } from "react";

export default async function MyProductsPage() {
  const session = await getSession();
  if (!session) return redirect("/auth");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>

        <Link
          href="/my-products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          + New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <Suspense fallback={<p>Loading products...</p>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <SellerProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
