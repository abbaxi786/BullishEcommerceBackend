import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import categoryRouter from "./routes/category.js";
import productRouter from "./routes/products.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import bannerRouter from "./routes/banner.js";
import feedBackRouter from "./routes/feedback.js";
import favouriteRouter from "./routes/favourite.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", categoryRouter);
app.use("/", productRouter);
app.use('/', userRouter);
app.use('/',orderRouter);
app.use('/',bannerRouter);
app.use('/',feedBackRouter);
app.use('/',favouriteRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});