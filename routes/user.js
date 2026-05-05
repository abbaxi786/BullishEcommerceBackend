import express from 'express';
import User from '../models/user.js';
import Order from '../models/order.js';
import dotenv from "dotenv";
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import upload from '../config/mutler.js'
import cloudinary from '../config/cloudinary.js'
import sharp from "sharp";

dotenv.config();
const userRouter = express.Router();


userRouter.post('/signIn', async (req, res) => {
    const { username, email, password, confirmPassword, imageLink } = req.body;
    try {
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "User already exists"
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            imageLink
        });

        res.status(201).send({
            success: true,
            status: 201,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            status: 500,
            message: error.message
        });
    }
});


userRouter.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        if (!identifier || !password) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "Username/Email and password required"
            });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).send({
                success: false,
                status: 401,
                message: "Invalid password"
            });
        }

        res.status(200).send({
            success: true,
            status: 200,
            message: "Login successful",
            data: user
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            status: 500,
            message: error.message
        });
    }
});

userRouter.get("/user/getUser", async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "user",
                    as: "orders",
                },
            },
            {
                $addFields: {
                    totalOrders: { $size: "$orders" },
                },
            },
            {
                $project: {
                    orders: 0,
                    password: 0,
                },
            },
        ]);

        return res.status(200).send({
            success: true,
            data: users,
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
});



userRouter.post("/adminLog", async (req, res) => {
    const { name, password } = req.body;

    try {
        if (!name || !password) {
            return res.status(400).send({
                message: "Fields missing",
                success: false,
            });
        }
        const admin = process.env.ADMIN;
        const passwords = process.env.PASSWORD;


        if (process.env.ADMIN !== name) {
            return res.status(400).send({
                message: "Incorrect username",
                success: false,
            });
        }

        if (process.env.PASSWORD !== password) {
            return res.status(400).send({
                message: "Incorrect password",
                success: false,
            });
        }

        const encrypt = Date.now();

        return res.status(200).send({
            success: true,
            encrypt,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
            success: false,
        });
    }
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

userRouter.post('/forgotten', async (req, res) => {
    const { email, type, token, newPassword } = req.body;

    try {
        if (type === 'sendEmail') {

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(200).send({
                    message: "If email exists, reset link sent",
                    success: true
                });
            }



            const resetToken = jwt.sign(
                { id: user._id },
                env.process.JWT_SECRET,
                { expiresIn: '5m' }
            );

            const resetLink = `http://localhost:5173/resetpassword/${resetToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset",
                html: `
                    <h3>Reset Password</h3>
                    <p>Click below to reset password:</p>
                    <a href="${resetLink}">Click Me</a>
                `
            });

            return res.status(200).send({
                success: true,
                message: "Reset email sent"
            });
        }

        if (type === 'resetPassword') {

            if (!token || !newPassword) {
                return res.status(400).send({
                    message: "Token and new password required",
                    success: false
                });
            }

            const decoded = jwt.verify(token, env.process.JWT_SECRET);

            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).send({
                    message: "User not found",
                    success: false
                });
            }

            user.password = newPassword;

            await user.save();

            return res.status(200).send({
                success: true,
                message: "Password updated successfully"
            });
        }

        return res.status(400).send({
            message: "Invalid type",
            success: false
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
            success: false
        });
    }
});
userRouter.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file received",
      });
    }

    const buffer = await sharp(req.file.buffer)
      .resize(300, 300)
      .webp({ quality: 80 })
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_images",
          format: "webp",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { imageLink: result.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      user: updatedUser,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default userRouter;