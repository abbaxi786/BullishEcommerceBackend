import express, { json } from "express";
import mongoose from "mongoose";
import Product from "../models/PSchema.js";
import Favourite from "../models/faviourite.js";

const productRouter = express.Router();


productRouter.get('/product/search/:txt', async (req, res) => {
  try {
    const value = req.params.txt;

    let category = req.query.category || req.query["category[]"];
    const { priceMin, priceMax } = req.query;

    let filter = {};

    if (category) {
      filter.category = { $in: [].concat(category) };
    }

    if (value && value !== "all") {
      filter.$or = [
        { name: { $regex: value, $options: "i" } },
        { description: { $regex: value, $options: "i" } }
      ];
    }

    if (priceMin || priceMax) {
      filter.price = {
        ...(priceMin && { $gte: Number(priceMin) }),
        ...(priceMax && { $lte: Number(priceMax) })
      };
    }

    const result = await Product.find(filter).populate("category");

    res.send({ success: true, data: result });

  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

productRouter.get("/productname/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


productRouter.patch("/product/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


productRouter.delete("/product/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



productRouter.get("/product/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { userId } = req.query;

    const products = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 });

    if (!userId) {
      return res.status(200).json({
        success: true,
        data: products,
      });
    }

    const favourites = await Favourite.find({ userId });

    const favIds = favourites.map((f) =>
      f.productId.toString()
    );

    const updatedProducts = products.map((p) => ({
      ...p.toObject(),
      isFavourite: favIds.includes(p._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      data: updatedProducts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


export default productRouter;


