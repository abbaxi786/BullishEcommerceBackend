import express from 'express'
import Favourite from '../models/faviourite.js'

const favouriteRouter = express.Router();


favouriteRouter.post('/favourite', async (req, res) => {
    const { productId, userId } = req.body;
    console.log("This product Id :  "+productId)
    console.log("This is user id:  "+userId);
    try {
        const favourite = await Favourite.create({ productId, userId });

        return res.status(200).send({ data: favourite, success: true });
    } catch (error) {
        return res.status(500).send({ message: error.message, success: false });
    }
});

favouriteRouter.post('/favourite/toggle', async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const existing = await Favourite.findOne({ productId, userId });

    if (existing) {
      await Favourite.findByIdAndDelete(existing._id);
      return res.send({ success: true, removed: true });
    }

    const fav = await Favourite.create({ productId, userId });

    return res.send({ success: true, added: true, data: fav });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// GET all favourites of a user
favouriteRouter.get('/favourite/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const favourites = await Favourite.find({ userId })
      .populate("productId"); // populate product details (important)

    return res.send({
      success: true,
      count: favourites.length,
      data: favourites
    });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

favouriteRouter.get('/favourite/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const favourites = await Favourite.find({ userId })
      .populate("productId"); // populate product details (important)

    return res.send({
      success: true,
      count: favourites.length,
      data: favourites
    });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});



export default favouriteRouter;