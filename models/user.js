import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageLink: { type: String, default: "" } // ✅ added
  },
  { timestamps: true }
);

const User =
  mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;