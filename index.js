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

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bullish-ecommerce-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", orderRouter);
app.use("/", bannerRouter);
app.use("/", feedBackRouter);
app.use("/", favouriteRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server AFTER DB connection
const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("DB Connection Failed:", error);
  }
};

startServer();