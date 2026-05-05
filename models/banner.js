import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  alt: {
    type: String,
  },

  productId: {    
    type: mongoose.Schema.Types.ObjectId,
    unique:true,
    ref: "products",
  },

  caption: {
    type: String,
  },
  discount:{
    type:Number,
    default: 0
  }
});

const Banner =  mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default Banner;