"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductForm({ productName, deleteAction }) {
  const router = useRouter();

  return (
    <form action={deleteAction} method="post">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/my-products")}
          className="flex-1 py-2 px-4 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Yes, Delete Product
        </button>
      </div>
    </form>
  );
}
