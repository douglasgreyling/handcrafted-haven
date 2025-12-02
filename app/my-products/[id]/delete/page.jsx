"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProductById, deleteProduct } from "../../../lib/product-actions";

export default function DeleteProductPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  const id = Number(params.id);
  if (isNaN(id)) return <div className="p-6 text-red-600">Invalid product ID</div>;

  // Load product on first render
  if (!product) {
    getProductById(id).then((p) => setProduct(p));
    return <div className="p-6">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-red-600">
        Product not found or cannot be loaded.
      </div>
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      router.push("/my-products");
    } catch (err) {
      toast.error("Failed to delete product");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-red-600">Delete Product</h1>
      <p className="mb-6">
        Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/my-products")}
          className="flex-1 py-2 px-4 border rounded-md hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Yes, Delete Product"}
        </button>
      </div>
    </div>
  );
}
