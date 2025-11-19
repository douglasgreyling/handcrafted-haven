"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import React from 'react'


const ItermList = () => {
   const [products, setProducts] = useState([]);
// Fetch products
  const fetchProducts = async () => {
    const res = await axios.get('/api/seller/products');
    setProducts(res.data);
  };

   // Run once on load
  useEffect(() => {
    fetchProducts();
  }, []);

  //Delete function
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/seller/products/${id}`);
      fetchProducts(); // refresh list
    } catch (err) {
      console.log('Delete error:', err);
    }
  };

  return (
    <div>
        <h1 className="text-2xl font-display text-dark">Products List Page</h1>
        <p className="mt-2 text-dark">
            This is where sellers can view and manage their listed products.
        </p>
         {products.map(product => (
        <div key={product._id} className="flex items-center gap-3 border p-2 my-2">
          
          {/* Delete button */}
          <button onClick={() => handleDelete(product._id)}>
  🗑️
</button>
          

          <div>
            <h3>{product.productName}</h3>
          <p>{product.description}</p>
          <strong>${product.price}</strong>
          </div>
        </div>
      ))}

      
    </div>
  )
}

export default ItermList
