import ProductForm from "../../../components/create-product";
import { getSession } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { createProduct } from "../../../lib/product-actions";

export default async function NewProductPage() {
  const session = await getSession();
  if (!session) return redirect("/auth");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
        <ProductForm action={createProduct} />
      </div>
    </main>
  );
}
