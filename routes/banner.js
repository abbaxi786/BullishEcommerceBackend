import express from 'express';
import Banner from '../models/banner.js';

const bannerRouter = express.Router();

bannerRouter.post('/banner', async (req, res) => {
  try {
    const { alt, productId, caption, discount } = req.body; 

    if (!alt || !productId || !caption || discount === undefined) {
      return res.status(400).send({
        message: "All fields are required",
        success: false
      });
    }

    const banner = await Banner.create({
      alt,
      productId,
      caption,
      discount
    });

    return res.status(201).send({
      message: "Banner created successfully",
      success: true,
      data: banner
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: error.message,
      success: false
    });
  }
});

bannerRouter.get('/bannerdata', async (req, res) => {
  try {
    const bannerData = await Banner.find()
    return res.status(200).send({
      success: true,
      data: bannerData
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: error.message,
      success: false
    });
  }
});


bannerRouter.get('/banner', async (req, res) => {
  try {
    const bannerData = await Banner.find()
      .populate('productId', '_id image');

    return res.status(200).send({
      success: true,
      data: bannerData
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: error.message,
      success: false
    });
  }
});

// 🗑️ DELETE BANNER
bannerRouter.delete('/banner/:id', async (req, res) => {
  try {
    const { id } = req.params; // get banner id from URL

    // 🔍 check if id is provided
    if (!id) {
      return res.status(400).send({
        message: "Banner ID is required",
        success: false
      });
    }

    // 🔍 find and delete banner
    const deletedBanner = await Banner.findByIdAndDelete(id);

    // ❌ if banner not found
    if (!deletedBanner) {
      return res.status(404).send({
        message: "Banner not found",
        success: false
      });
    }

    // ✅ success response
    return res.status(200).send({
      message: "Banner deleted successfully",
      success: true,
      data: deletedBanner
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).send({
      message: error.message,
      success: false
    });
  }
});

export default bannerRouter;