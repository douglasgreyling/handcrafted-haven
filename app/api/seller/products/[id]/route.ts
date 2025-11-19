import connectToDatabase from '@/lib/mongoose';
import CreateProduct from '@/models/CreateProductModels';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
      const { id } = await context.params;

    const deleted = await CreateProduct.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
