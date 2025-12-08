"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteProductForm({ productId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/my-products/${productId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to delete product');
        setDeleting(false);
        return;
      }

      toast.success('Product deleted successfully!');
      router.push('/my-products');
      router.refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product');
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => router.push("/my-products")}
        className="flex-1 py-2 px-4 border rounded-md hover:bg-gray-100"
        disabled={deleting}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Yes, Delete Product'}
      </button>
    </div>
  );
}
