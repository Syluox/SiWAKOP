import express from "express";
import { User, Place } from "../models/dbSchemas.js"; // Assuming Request model is also imported if needed
import jwt from 'jsonwebtoken'; // Import jwt for token verification

const router = express.Router();

// Inline token verification function
const verifyTokenInline = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

// Inline isAdmin check
const checkAdmin = (decoded) => {
  if (decoded.role !== 'admin') throw new Error('Admin access required');
};

// Get all users
router.get("/users", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Block a user (assuming 'blocked' field)
router.put("/users/:id/block", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.blocked = true;
    await user.save();
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get all places
router.get("/places", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Add new place
router.post("/places", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const place = new Place(req.body);
    await place.save();
    res.json(place);
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Add documentation to place
router.put("/places/:id/documentation", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    place.document = req.body.document;
    await place.save();
    res.json({ message: "Documentation added" });
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Add review to place
router.post("/places/:id/review", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    place.reviews.push({
      userId: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    await place.save();
    res.json({ message: "Review added" });
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete review from place
router.delete("/places/:placeId/review/:reviewId", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const place = await Place.findById(req.params.placeId);
    if (!place) return res.status(404).json({ message: "Place not found" });
    place.reviews = place.reviews.filter(r => r._id.toString() !== req.params.reviewId);
    await place.save();
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get all place requests
router.get("/requests", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const requests = await Request.find().populate("userId", "username");
    res.json(requests);
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Approve place request
router.post("/requests/:id/approve", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    const newPlace = new Place({
      name: request.name,
      // Add other fields from request
    });
    await newPlace.save();
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: "Request approved, place added" });
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get all complains
router.get("/complains", async (req, res) => {
  try {
    const decoded = verifyTokenInline(req);
    checkAdmin(decoded);
    const places = await Place.find();
    const complains = places.flatMap(p => p.complains.map(c => ({
      placeName: p.name,
      userId: c.userId,
      complain: c.complain,
      date: c.date
    })));
    res.json(complains);
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or no token" });
    }
    if (error.message === 'Admin access required') {
      return res.status(403).json({ message: "Admin access required" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;