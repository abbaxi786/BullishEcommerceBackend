import express from "express";
import Contact from "../models/contact.js";

const contactRouter = express.Router();


contactRouter.post("/contact", async (req, res) => {
  const { name, email, phoneNumber, subject, message } = req.body;

  try {
    if (!name || !email || !phoneNumber || !message) {
      return res.status(400).json({
        message: "Please fill all required fields",
        success: false,
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phoneNumber,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Contact message submitted successfully",
      success: true,
      data: contact,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
      success: false,
    });
  }
});


contactRouter.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      data: contacts,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
      success: false,
    });
  }
});


contactRouter.delete("/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Contact ID is required",
        success: false,
      });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Contact deleted successfully",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
      success: false,
    });
  }
});

export default contactRouter;