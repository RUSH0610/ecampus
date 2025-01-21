const express = require("express");
const router = express.Router(); // Correct capitalization

// Import controllers
const {
  allmailcategories,
  getmycategory,
  addmailcat,
  deletemailcategory,
  addmail,
  removemail,
} = require("../controller/impemailController");

// Define routes
router.get("/categories", allmailcategories);
router.get("/categories/:categoryId/emails", getmycategory);
router.post("/categories/add", addmailcat);
router.delete("/categories/:categoryId/remove", deletemailcategory);
router.post("/categories/:categoryId/emails/add", addmail);
router.delete("/categories/:categoryId/emails/:emailId/remove", removemail);

module.exports = router;
