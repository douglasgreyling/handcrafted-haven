import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, collection: "sellers" }
);

export default mongoose.models.Seller || mongoose.model('Seller', SellerSchema);
