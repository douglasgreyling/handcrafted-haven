"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export default function SellerProductCard({ product }) {
  return (
    <div className="relative border p-4 rounded-lg shadow-sm bg-white flex flex-col gap-4">

      {/* Edit/Delete Icons */}
      <div className="absolute top-3 right-3 flex gap-3 z-10">
        <Link
          href={`/my-products/${product.id}/edit`}
          className="bg-yellow-400 p-2 rounded-full text-white shadow-md hover:bg-yellow-500 transition"
        >
          <Pencil size={18} />
        </Link>

        <Link
          href={`/my-products/${product.id}/delete`}
          className="bg-red-600 p-2 rounded-full text-white shadow-md hover:bg-red-700 transition"
        >
          <Trash2 size={18} />
        </Link>
      </div>

      {/* Product Image */}
      <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm flex flex-col items-center">
            <svg
              className="mx-auto h-10 w-10 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500 font-medium">
          ${(product.priceCents / 100).toFixed(2)}
        </p>
      </div>

      {/* View Product Button */}
      <div className="mt-auto flex justify-center">
        <Link
          href={`/products/${product.id}`}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700 transition"
        >
          View Product
        </Link>
      </div>

    </div>
  );
}
