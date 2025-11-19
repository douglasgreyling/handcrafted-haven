import mongoose from 'mongoose';

const CreateProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true ,collection: "products" });


const CreateProduct = mongoose.models.CreateProduct || mongoose.model('CreateProduct', CreateProductSchema);

export default CreateProduct;