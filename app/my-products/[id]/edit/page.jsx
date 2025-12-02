import ProductForm from "../../../../components/edit-product";
import { getProductById, updateProduct } from "../../../../lib/product-actions";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return <div className="p-6 text-center text-red-600">Invalid product ID</div>;
  }

  const product = await getProductById(id);
  if (!product) {
    return (
      <div className="p-6 text-center text-red-600">
        Product not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <ProductForm product={product} action={async (formData) => updateProduct(id, formData)} />
    </div>
  );
}
