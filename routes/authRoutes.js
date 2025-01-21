const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifytokenMiddleware"); // Middleware to verify token
const authController = require("../controller/authController"); // Import the controller

// Routes for authentication
router.get("/check", authController.checkAuth); // Route to check if the user is authenticated
router.post("/signup", authController.registerUser); // Route for user signup
router.post("/adminsignup", authController.registerAdmin); // Route for admin signup
router.post("/login", authController.loginUser); // Route for user login
router.post("/adminlogin", authController.loginAdmin); // Route for admin login

module.exports = router;
