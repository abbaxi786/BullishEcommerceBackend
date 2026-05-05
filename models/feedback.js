import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema(
  {
    ratingStars: {
      type: Number,
      required: true
    },

    ratingEmail: {
      type: String,
      required: true,
      trim: true
    },

    ratingComments: {
      type: String,
      required: true,
      trim: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "products"
    },
    approval:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

feedBackSchema.index(
  { ratingEmail: 1, productId: 1 },
  { unique: true }
);

const FeedBack =
  mongoose.models.FeedBack || mongoose.model("FeedBack", feedBackSchema);

export default FeedBack;