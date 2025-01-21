const MailCategory = require("../models/mailCatergory"); // Mail categories model
const Email = require("../models/emailModel"); // Emails model
const mongoose = require("mongoose");
// Fetch all mail categories
const allmailcategories = async (req, res) => {
  try {
    const categories = await MailCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching mail categories:", error.message);
    res.status(500).json({ message: "Failed to fetch mail categories." });
  }
};

// Fetch emails in a specific category
const getmycategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log(categoryId);
  try {
    const emails = await MailCategory.find({ categoryId: categoryId });
    if (!emails || emails.length === 0) {
      return res
        .status(404)
        .json({ message: "No emails found for this category." });
    }
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching emails for category:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch emails for the category." });
  }
};

// Add a new mail category
const addmailcat = async (req, res) => {
  const { category } = req.body;

  // Check if categoryId is provided
  console.log(category);
  if (!category) {
    return res.status(400).json({ message: "Category name is required." });
  }

  // Optional: Check if categoryId follows a specific pattern
  // if (!/^[a-zA-Z0-9]+$/.test(categoryId)) {
  //   return res.status(400).json({ message: "Invalid category name format." });
  // }

  try {
    // Check if category already exists
    const existingCategory = await MailCategory.findOne({ category });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    // Create and save the new category
    const newCategory = new MailCategory({ category, categoryId: category });
    await newCategory.save();

    // Send response with the newly created category
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding mail category:", error.message);
    res.status(500).json({ message: "Failed to add mail category." });
  }
};

// Delete a mail category
const deletemailcategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log("category ", categoryId);
  try {
    // Check if categoryId is provided
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Assuming you have a MailCategory model
    const deletedCategory = await MailCategory.findOneAndDelete({
      categoryId: categoryId,
    });

    // If the category is not found
    // if (!deletedCategory) {
    //return res.status(404).json({ message: "Category not found" });
    //}

    res
      .status(200)
      .json({ message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addmail = async (req, res) => {
  const { categoryId, emailData } = req.body;
  console.log(categoryId, emailData);
  if (!emailData || !emailData.email || !emailData.category) {
    return res.status(400).json({ message: "Email data is incomplete." });
  }

  try {
    const category = await MailCategory.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const newEmail = new Email({
      ...emailData,
      categoryId,
      categoryName: category.name, // Ensure this matches your schema
    });

    await newEmail.save();
    res.status(201).json(newEmail);
  } catch (error) {
    console.error("Error adding email:", error);
    res.status(500).json({ message: "Failed to add email." });
  }
};

// Remove an email from a category
const removemail = async (req, res) => {
  const { categoryId, emailId } = req.params;

  try {
    const email = await Email.findOneAndDelete({ _id: emailId, categoryId });
    if (!email) {
      return res.status(404).json({ message: "Email not found." });
    }

    res.status(200).json({ message: "Email removed successfully." });
  } catch (error) {
    console.error("Error removing email:", error.message);
    res.status(500).json({ message: "Failed to remove email." });
  }
};

module.exports = {
  allmailcategories,
  getmycategory,
  addmailcat,
  deletemailcategory,
  addmail,
  removemail,
};
