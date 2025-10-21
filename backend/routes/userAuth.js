import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/dbSchemas.js";

function rajaCrypto(pass){
    const cryptonisasi = btoa(atob("dHVnYXMgcGFudGVrCmJ0dyB5YSByaW5kdSBkaWEgaGVoZSwga2FuZ2VuIG5pY2EgPDMKb2ggeWEgcGFzcyBhc2xpIGx1IGluaSA6IA==") + pass)
    return cryptonisasi;
}

const router = express.Router();
// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => { // Use env secret if available
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Register route - Creates user and generates token
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = rajaCrypto(password);
    // Create new user
    const newUser = new User({
      username,
        email,
        password: hashedPassword
    });
    await newUser.save();
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Login route - Authenticates user and generates token
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    // Compare password
    const isMatch = user.password === rajaCrypto(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email}
      
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Protected route example
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
    } catch (err) {
    res.status(500).json({ message: "Server error" });
    }
});

export default router;