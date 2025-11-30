import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from 'http-proxy-middleware';
import mysql from 'mysql'; // Using the installed 'mysql' package
import util from 'util'; // Node.js utility module for promisifying

/// Routes
import placesRouter from "./routes/placesAuth.js";
import userAuth from "./routes/userAuth.js";
import adminAuth from "./routes/adminAuth.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// ----------------------------------------------------------------------
// MySQL Database Connection Setup
// ----------------------------------------------------------------------

// Placeholder for the MySQL connection pool.
// We will export this so routes can access it (e.g., req.app.locals.db).
let db; 

/**
 * Establishes a connection pool to MySQL and promisifies necessary methods.
 * @returns {object} The MySQL connection pool object with promisified methods.
 */
const connectMySQL = async () => {
    // NOTE: You must set these variables in your .env file:
    // MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
    const dbConfig = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'siwakop',
        connectionLimit: 10, // Recommended for a production server
    };

    console.log(`Attempting to connect to MySQL database: ${dbConfig.database}`);

    try {
        // Create the connection pool
        const pool = mysql.createPool(dbConfig);
        
        // Promisify the pool's query method for async/await use throughout the app
        pool.query = util.promisify(pool.query);
        
        // Promisify pool.getConnection to get promise-based connections (for transactions)
        pool.getConnection = util.promisify(pool.getConnection);

        // Test the connection by pinging the database
        const connection = await pool.getConnection();
        connection.release(); // Release the connection immediately after the test
        
        console.log(`📦 Connected successfully to MySQL: ${dbConfig.database}`);
        return pool;

    } catch (error) {
        console.error('❌ MySQL connection error:', error);
        console.error('HINT: Check if your MySQL server is running and .env variables are set correctly.');
        throw error;
    }
};

// ----------------------------------------------------------------------
// Express App Setup
// ----------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use('/imgChace', express.static(path.join(__dirname, 'public/imgChace'),{
  maxAge: '5d', // Cache for 1 day
}));

// Route handlers
app.use("/api/places", placesRouter);
app.use("/api/user", userAuth);
app.use('/api/admin', adminAuth);

// ----------------------------------------------------------------------
// Server Initialization
// ----------------------------------------------------------------------

// 1. Connect to MySQL
connectMySQL()
    .then(pool => {
        // Store the connected pool instance in app.locals for access in routes
        // In your routes, you can now get the pool via: const db = req.app.locals.db;
        app.locals.db = pool; 
        db = pool; // Also store in the local variable 'db' if needed globally

        // 2. Start Express Server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port http://0.0.0.0:${PORT}`);
        });
    })
    .catch(err => {
        // This catch block handles connection failures
        console.error('Failed to start server due to database connection error:', err.message);
    });