import mongoose from "mongoose";



const connectDB = async () => {
    
  try {
    await mongoose.connect(process.env.mongoURL);
    console.log("DB is connected");
  } catch (err) {
    console.log("DB connection error:", err);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;