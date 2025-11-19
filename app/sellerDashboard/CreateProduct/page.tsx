'use client'
import axios from 'axios';
import React from 'react'
import {useState} from 'react';

const CreateProduct = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
   const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const productData = { productName, description, price, quantity };
    try {
      const response = await axios.post('/api/seller/products', {
        productName,
        description,
        price,
        quantity,
        category
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }
  return (
    <div>
        <h1 className="text-2xl font-display text-dark">Create Product Page</h1>
        <p className="mt-2 text-dark">
            This is where sellers can create new products to list in their store.    
        </p>
        <form onSubmit={handleSubmit}>
            <div>
                
                <div>
                  <label htmlFor="productName">Product Name:</label>
                <input type="text" onChange={(e)=> setProductName(e.target.value)} id="productName" name="productName" required />
                </div>
               <div>
                 <label htmlFor="description">Description:</label>
                <input type="text" onChange={(e)=> setDescription(e.target.value)} id="description" name="description" required />
               </div>
                <div>
                  <label htmlFor="price">Price:</label>
                <input type="number" onChange={(e)=> setPrice(Number(e.target.value))} id="price" name="price" required />
                </div>
                <div>
                  <label htmlFor="quantity">Quantity:</label>
                <input type="number" onChange={(e)=> setQuantity(Number(e.target.value))} id="quantity" name="quantity" required />

                </div>
                <div>
                  <label htmlFor="productName">Category:</label>
                <input type="text" onChange={(e)=> setCategory(e.target.value)} id="productName" name="productName" required />
                </div>
               <div>

                </div>
                <button type="submit">Create Product</button>
            </div>
        </form>
      
    </div>
  )
}

export default CreateProduct
