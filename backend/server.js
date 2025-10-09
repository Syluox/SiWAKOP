import express from "express";
import mongoose, { Schema } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { rajaCrypto } from "./models/TimotiRonald.js";
import { MainSchematic } from "./models/dbSchemas.js";

import router from "./routes/auth.js";

dotenv.config();
class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 5000;

    this.app.use(cors());
    this.app.use(express.json());
    
    this.app.use("/api/auth", router);
  }

  startServer() {

    this.app.listen(this.PORT, () =>
      console.log(`🚀 Server running on port ${this.PORT}`)
    );
  }

  async connectDB(dbName) {
    return mongoose.createConnection(process.env.MONGO_URI, { dbName });
  }

  static UserEdit = class {
    static async createUser(username, email, password) {
      try {
        // Connect to database
        const server = new Server(); // create a temporary instance to access connectDB
        const userDB = await server.connectDB("public-user");

        // Check if username/email already used
        const existing = await MainSchematic.userModel.findOne({
          $or: [{ username }, { email }],
        });

        if (existing) {
          if (existing.username === username) throw new Error("Username Digunakan");
          if (existing.email === email) throw new Error("Email Telah Digunakan");
        }

        // Hash password
        const hashed = rajaCrypto(password);

        // Create new user
        const newUser = new MainSchematic.userModel({
          username,
          email,
          password: hashed,
        });

        await newUser.save();
        await userDB.close();
        console.log("✅ User created!");
      } catch (err) {
        console.log("❌", err.message);
      }
    }
  };
}

// Create server and start
const mainServer = new Server();
mainServer.startServer();

export default mainServer;
