"use client";

import React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { productSchema } from "../lib/validation/productSchema";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tag,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Shapes,
} from "lucide-react";

export default function ProductForm({ action, product }) {
  const initialState = { message: null, errors: {} };

  // Wrap the server action so useActionState calls it with (prevState, formData)
  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      const values = Object.fromEntries(formData.entries());
      const parsed = productSchema.safeParse(values);

      if (!parsed.success) {
        return {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        };
      }

      return await action(formData);
    },
    initialState
  );

  const router = useRouter();

  React.useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }

    if (!state?.message && Object.keys(state.errors || {}).length === 0 && state !== initialState) {
      toast.success("Updated successfully");
      router.push("/my-products");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
        <Tag className="w-5 h-5 text-blue-600" />
        Product Details
      </h2>

      {/* NAME */}
      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          Name
        </label>
        <Input
          name="name"
          defaultValue={product?.name}
          placeholder="Amazing product"
          required
        />
        {state.errors?.name && (
          <p className="text-sm text-red-500">{state.errors.name}</p>
        )}
      </div>

      {/* CATEGORY */}
      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <Shapes className="w-4 h-4 text-gray-500" />
          Category
        </label>
        <Input
          name="category"
          defaultValue={product?.category || ""}
          placeholder="Electronics"
        />
        {state.errors?.category && (
          <p className="text-sm text-red-500">{state.errors.category}</p>
        )}
      </div>

      {/* PRICE */}
      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          Price (USD)
        </label>
        <Input
          type="number"
          step="0.01"
          name="price"
          defaultValue={
            product?.price ??
            (product?.priceCents
              ? (product.priceCents / 100).toFixed(2)
              : "")
          }
          required
        />
        {state.errors?.price && (
          <p className="text-sm text-red-500">{state.errors.price}</p>
        )}
      </div>

      {/* IMAGE URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-500" />
          Image URL
        </label>
        <Input
          name="imageUrl"
          defaultValue={product?.imageUrl || ""}
          placeholder="https://example.com/photo.jpg"
        />
        {state.errors?.imageUrl && (
          <p className="text-sm text-red-500">{state.errors.imageUrl}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" rows={5} defaultValue={product?.description} className="w-full rounded-md border px-3 py-2" />
        {state.errors?.description && (
          <p className="text-sm text-red-500">
            {state.errors.description}
          </p>
        )}
      </div>
      
      {/* BUTTONS */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/my-products")}
        >
          Cancel
        </Button>

        <Button type="submit" variant="cta">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
