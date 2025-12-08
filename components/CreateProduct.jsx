"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tag,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Shapes,
} from "lucide-react";

export default function CreateProductForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      imageUrl: formData.get('imageUrl'),
      inStock: formData.get('inStock') === 'true',
    };

    try {
      const response = await fetch('/api/my-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to create product');
        setSubmitting(false);
        return;
      }

      toast.success('Product created successfully!');
      router.push('/my-products');
      router.refresh();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('An error occurred while creating the product');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
        <Tag className="w-5 h-5 text-blue-600" />
        Create New Product
      </h2>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          Name
        </label>
        <Input name="name" placeholder="Amazing product" required />
        {errors?.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <Shapes className="w-4 h-4 text-gray-500" />
          Category
        </label>
        <Input name="category" placeholder="Electronics" required />
        {errors?.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          Price (USD)
        </label>
        <Input
          type="number"
          step="0.01"
          name="price"
          placeholder="49.99"
          required
          min="0.01"
        />
        {errors?.price && (
          <p className="text-sm text-red-500">{errors.price}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-500" />
          Image URL
        </label>
        <Input name="imageUrl" placeholder="https://example.com/photo.jpg" />
        {errors?.imageUrl && (
          <p className="text-sm text-red-500">{errors.imageUrl}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Short description of your product"
        />
        {errors?.description && (
          <p className="text-sm text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            value="true"
            defaultChecked
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium">In Stock</span>
        </label>
        {errors?.inStock && (
          <p className="text-sm text-red-500">{errors.inStock}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/my-products")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="cta" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
