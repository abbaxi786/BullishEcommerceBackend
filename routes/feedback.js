import express from 'express';
import FeedBack from '../models/feedback.js';

const feedBackRouter = express.Router();

feedBackRouter.post('/feedback', async (req, res) => {
  const { ratingStars, ratingEmail, ratingComments, productId } = req.body;

  try {
    if (!productId || !ratingEmail) {
      return res.status(400).send({
        message: "Product ID and Email are required",
        success: false
      });
    }

    const feedback = await FeedBack.findOneAndUpdate(
      { ratingEmail, productId },
      {
        ratingStars,
        ratingComments
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).send({
      data: feedback,
      success: true
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false
    });
  }
});

feedBackRouter.get('/feedback/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const feedbacks = await FeedBack.find({ productId, approval: { $eq: true } });

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(200).send({
        data: [],
        success: true,
        message: "No feedback found"
      });
    }

    return res.status(200).send({
      data: feedbacks,
      success: true
    });

  } catch (error) {
    return res.status(500).send({
      message: error?.message,
      success: false
    });
  }
});

feedBackRouter.get('/admin/feedback', async (req, res) => {
  try {
    const nonApproval = await FeedBack.find({ approval: false }).populate('productId', 'name image');
    return res.status(200).send({ data: nonApproval, success: true });
  } catch (error) {
    return res.status(500).send({ message: error, success: false });
  }
})

feedBackRouter.patch('/admin/feedback', async (req, res) => {
  const { _id } = req.body;

  try {
    const feedback = await FeedBack.findById(_id);

    if (!feedback) {
      return res.status(404).send({
        message: "Feedback not found",
        success: false
      });
    }

    const updatedFeedback = await FeedBack.findByIdAndUpdate(
      _id,
      { $set: { approval: true } },
      { returnDocument: 'after' }
    );

    return res.status(200).send({
      data: updatedFeedback,
      success: true
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false
    });
  }
});

export default feedBackRouter;