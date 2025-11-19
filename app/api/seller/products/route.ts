import  connectToDatabase from '@/lib/mongoose';
import CreateProduct from '@/models/CreateProductModels';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
    try {
        await connectToDatabase();
        const data = await request.json();
        const { productName, description, price, quantity } = data;
        const newProduct = new CreateProduct({
            productName,
            description,
            price,
            quantity
        });
        await newProduct.save();
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
};


