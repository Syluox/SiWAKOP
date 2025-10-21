import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User, Place } from "./models/dbSchemas.js";

import { createProxyMiddleware } from 'http-proxy-middleware';

/// Routes
import placesRouter from "./routes/placesAuth.js";
import userAuth from "./routes/userAuth.js";
import adminAuth from "./routes/adminAuth.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use('/imgChace', express.static(path.join(__dirname, 'public/imgChace'),{
  maxAge: '5d', // Cache for 1 day
}));

// app.use("/api/auth", authRouter);
app.use("/api/places", placesRouter);
app.use("/api/user", userAuth);
app.use('/api/admin', adminAuth);

const connectDB = async (dbName) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`📦 Connected to MongoDB: ${dbName}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

connectDB('siwakop').then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server due to DB connection error:', err);
});