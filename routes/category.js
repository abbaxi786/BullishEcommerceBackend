import Category from "../models/category.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.get("/category", async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      data: categories,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

categoryRouter.get("/category/:id" ,async (req,res)=>{

  const {id} = req.params
  try{
    const category= await Category.find({_id:id});

    return res.send({status:200,data:category})

  }catch(error){
    console.log(error.message);
    res.send({status:500,message:error.message})
  }
});

categoryRouter.post("/category", async (req, res) => {
  const { name } = req.body;

  try {
    const response = await Category.create({ name });

    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default categoryRouter;