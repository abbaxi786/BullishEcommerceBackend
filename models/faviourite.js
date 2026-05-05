import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    }
  },
  { timestamps: true }
);

const Favourite =
  mongoose.models.Favourite ||
  mongoose.model("Favourite", favouriteSchema);

favouriteSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default Favourite;