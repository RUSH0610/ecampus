const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

// Admin Key for Admin Registration
const ADMIN_KEY = "abc";

// Helper function to exclude sensitive data
const excludeSensitiveData = (user) => {
  const userResponse = { ...user._doc };
  delete userResponse.password;
  return userResponse;
};

// Check Authentication
const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = excludeSensitiveData(user);
    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Register (User registration)
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      isAdmin: false, // Default to false for regular users
    });

    await newUser.save();

    const userResponse = excludeSensitiveData(newUser);
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Register (Admin registration with admin key)
const registerAdmin = async (req, res) => {
  const { fullName, email, password, admincode } = req.body;

  if (admincode !== ADMIN_KEY) {
    return res.status(403).json({ message: "Invalid admin key" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      isAdmin: true, // Set to true for admins
    });

    await newUser.save();

    const userResponse = excludeSensitiveData(newUser);
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login (User login)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse = excludeSensitiveData(user);
    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login (Admin login with admin key)
const loginAdmin = async (req, res) => {
  const { email, password, admincode } = req.body;

  if (admincode !== ADMIN_KEY) {
    return res.status(403).json({ message: "Invalid admin key" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse = excludeSensitiveData(user);
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkAuth,
  registerUser,
  registerAdmin,
  loginUser,
  loginAdmin,
};
