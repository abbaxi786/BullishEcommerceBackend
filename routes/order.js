import express from "express";
import Order from "../models/order.js";
import Product from "../models/PSchema.js";

const orderRouter = express.Router();

orderRouter.post("/order", async (req, res) => {
  try {
    const { email, guestName, address, phoneNo, userId, products } = req.body;

    if (!email || !address || !products?.length) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    let totalAmount = 0;
    const formattedProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).send({
          message: `Not enough stock for ${product.name}`,
        });
      }

      const discount = item.discount || 0;

      const discountedPrice =
        product.price - (product.price * discount) / 100;

      totalAmount += discountedPrice * item.quantity;

      formattedProducts.push({
        product: product._id,
        quantity: item.quantity,
        discount,
        originalPrice: product.price,
        priceAtPurchase: discountedPrice,
      });
    }

    const order = await Order.create({
      user: userId || null,
      name: guestName,
      email,
      address,
      phoneNo,
      products: formattedProducts,
      totalAmount,
    });

    for (let item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

orderRouter.get("/order", async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "products.product",
      "name price image"
    );

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

orderRouter.get("/order/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
    }).populate("products.product", "name price image");

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

orderRouter.patch("/order/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.send({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default orderRouter;