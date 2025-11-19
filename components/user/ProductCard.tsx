import React from "react";
import Image from "next/image";

type Props = {
  id: number;
  title: string;
  priceCents: number;
  imageUrl?: string;
  category?: string;
};

const ProductCard = ({ id, title, priceCents, imageUrl, category }: Props) => {
  const price = (priceCents / 100).toFixed(2);

  return (
    <article className="bg-secondary rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-56 w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill style={{ objectFit: "cover" }} />
        ) : (
          <div className="flex items-center justify-center h-full text-accent">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg text-primary truncate">{title}</h3>
        {category && <p className="text-sm text-accent">{category}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-heading">${price}</span>
          <button className="px-3 py-1 rounded-md font-medium bg-cta text-white">
            View
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
