import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, required: true, trim: true },

    image: [{ type: String, required: true }],

    stock: { type: Number, default: 0 },

    price: { type: Number, required: true },

    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }]
  },
  { timestamps: true }
);


const Product = mongoose.model.products || mongoose.model("products", productSchema);

export default Product;