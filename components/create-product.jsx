"use client";

import React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { productSchema } from "../lib/validation/productSchema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ProductForm({ action }) {
  const initialState = { message: null, errors: {} };

  const [state, formAction] = useActionState(async (prevState, formData) => {
    const values = Object.fromEntries(formData.entries());
    const parsed = productSchema.safeParse(values);

    if (!parsed.success) {
      return {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    return await action(formData);
  }, initialState);

  const router = useRouter();

  React.useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }

    if (!state?.message && Object.keys(state.errors || {}).length === 0 && state !== initialState) {
      toast.success("Saved successfully");
      router.push("/my-products");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input name="name" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Input name="category" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price (USD)</label>
        <Input type="number" step="0.01" name="price" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <Input name="imageUrl" placeholder="https://example.com/photo.jpg" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" rows={5} className="w-full rounded-md border px-3 py-2" />
      </div>

      <div className="flex items-center gap-3">
      <Button type="submit" variant="cta">
          Create Product
        </Button>
        <a href="/my-products" className="text-sm text-gray-600 hover:underline">
          Cancel
        </a>
      </div>
    </form>
  );
}
