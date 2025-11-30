import mysql from 'mysql'; // Using the original 'mysql' package which uses callbacks
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for correct path resolution in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data will be loaded asynchronously in the main function
let data = []; 

// -----------------------------------------------------------------------------
// 1. CONFIGURATION (MUST BE UPDATED)
// -----------------------------------------------------------------------------

// Your MySQL connection details.
// NOTE: For the initial connection (to create the database), use a user
// with superuser/CREATE privileges.
const rootDbConfig = {
    user: 'root',          // e.g., 'root'
    host: 'localhost',                // or your server address
    password: 'root',  // *** REPLACE WITH YOUR PASSWORD ***
    port: 3306,                       // Default MySQL port
    // We do NOT specify a database here, we connect to the server itself
};

const DATABASE_NAME = 'siwakop';
const TABLE_NAME = 'tempat';

// -----------------------------------------------------------------------------
// 2. PROMISIFIED DATABASE UTILITIES
// -----------------------------------------------------------------------------

// Promisify the connection query method for use with async/await
function queryPromise(connection, sql, values = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Promisify connection.end()
function endPromise(connection) {
    return new Promise((resolve, reject) => {
        connection.end(error => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

// -----------------------------------------------------------------------------
// 3. DATABASE CREATION AND TABLE SETUP
// -----------------------------------------------------------------------------

/**
 * Creates the siwakop database if it does not exist using the root connection.
 */
async function createDatabase() {
    console.log(`1. Attempting to create database: ${DATABASE_NAME}`);
    
    // Connect to the MySQL server (without specifying a database)
    let connection;
    try {
        // Create the connection using the original mysql package
        connection = mysql.createConnection(rootDbConfig); 

        // The IF NOT EXISTS syntax is used to make the script idempotent.
        const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`;
        await queryPromise(connection, createDbQuery); // Use the promisified function
        console.log(`   Database '${DATABASE_NAME}' setup complete.`);
    } catch (error) {
        console.error('--- DATABASE CONNECTION/CREATION ERROR ---');
        console.error('Check your MySQL server status and ensure rootDbConfig details are correct (user, password, host, port).');
        throw error;
    } finally {
        if (connection) {
            await endPromise(connection); // Use the promisified function
        }
    }
}

/**
 * Connects to the siwakop database and creates the tourism_places table.
 * Since the original 'mysql' package doesn't have a built-in pool.query, 
 * we use a simple connection and immediately end it after table creation.
 * @param {mysql.Connection} dbConnection - The MySQL connection connected to siwakop DB.
 */
async function createTable(dbConnection) {
    console.log(`2. Creating table: ${TABLE_NAME}`);
    
    // In MySQL, we use the standard 'JSON' type for nested objects and arrays.
    // We use DECIMAL(10, 7) for precise latitude/longitude storage.
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
            -- 'id' is the internal primary key, managed by MySQL
            id INT AUTO_INCREMENT PRIMARY KEY, 
            -- 'place_id' is the ID from the JSON file
            place_id INT, 
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            description TEXT,
            address VARCHAR(255),
            kecamatan VARCHAR(100),
            operating_hours JSON,
            price JSON,
            facilities JSON,
            latitude DECIMAL(10, 7),
            longitude DECIMAL(10, 7),
            photo_url VARCHAR(255)
        );
    `;
    // Drop table first to ensure a clean slate for re-running the script
    await queryPromise(dbConnection, `DROP TABLE IF EXISTS ${TABLE_NAME}`);
    await queryPromise(dbConnection, createTableQuery);
    console.log(`   Table '${TABLE_NAME}' created successfully.`);
}

// -----------------------------------------------------------------------------
// 4. DATA INSERTION
// -----------------------------------------------------------------------------

/**
 * Inserts all records from the JSON data into the table.
 * @param {mysql.Connection} dbConnection - The MySQL connection connected to siwakop DB.
 */
async function insertData(dbConnection) {
    console.log(`3. Starting data insertion for ${data.length} records...`);

    // We do not include the primary key 'id' in the list of columns 
    // since it is AUTO_INCREMENT.
    const insertQuery = `
        INSERT INTO ${TABLE_NAME} (
            place_id, name, category, description, address, kecamatan,
            operating_hours, price, facilities, latitude, longitude, photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    let insertedCount = 0;
    
    // Begin a transaction using the promisified query function
    await queryPromise(dbConnection, 'START TRANSACTION');

    try {
        for (const record of data) {
            // Map the JSON data fields to the 12 columns in the VALUES clause (excluding the auto-increment 'id')
            const values = [
                record.id, // This goes into the 'place_id' column
                record.name,
                record.category,
                record.description,
                record.address,
                record.kecamatan,
                // Convert nested objects/arrays to JSON strings 
                JSON.stringify(record.operating_hours || {}),
                JSON.stringify(record.price || {}),
                JSON.stringify(record.facilities || []), 
                record.latitude,
                record.longitude,
                record.photo_url
            ];
            
            // The 'mysql' package uses connection.query for execution, unlike mysql2's connection.execute
            await queryPromise(dbConnection, insertQuery, values);
            insertedCount++;
        }
        
        await queryPromise(dbConnection, 'COMMIT'); // Commit the transaction on success
        console.log(`   Successfully inserted ${insertedCount} records.`);

    } catch (error) {
        console.error(`\n-- Error inserting data. Rolling back transaction. --`);
        console.error(error.message);
        await queryPromise(dbConnection, 'ROLLBACK'); // Rollback on error
        throw error;
    }
}

// -----------------------------------------------------------------------------
// 5. MAIN EXECUTION
// -----------------------------------------------------------------------------

async function main() {
    let dbConnection = null;

    try {
        // 0. Load data asynchronously using fs/promises, which is necessary in ESM
        const dataPath = path.join(__dirname, 'dataPlace.json');
        console.log(`0. Loading data from: ${dataPath}`);
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        data = JSON.parse(fileContent);
        console.log(`   Successfully loaded ${data.length} records.`);


        // Step 1: Create the database
        await createDatabase();

        // Step 2 & 3: Connect to the new database and populate it
        console.log(`\nConnecting to: ${DATABASE_NAME}`);
        
        // Connect directly to the siwakop database using the original mysql package
        dbConnection = mysql.createConnection({ 
            ...rootDbConfig, 
            database: DATABASE_NAME
        });
        
        // Since we are not using a pool, we need to handle the connection manually.
        // Convert connection into a promise-based object on creation.
        // (Note: The functions above already use the promisified queryPromise)
        
        // Create the table structure
        await createTable(dbConnection);

        // Insert the data
        await insertData(dbConnection);

        console.log('\n✅ Script execution complete. The siwakop database is ready!');

    } catch (err) {
        console.error('\n❌ FATAL ERROR DURING SCRIPT EXECUTION ❌');
        // The error object might already contain useful information from the sub-functions
        if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
             console.error('HINT: Did you start your MySQL server? Are the host and port correct?');
        }
        console.error(err.message);
    } finally {
        if (dbConnection) {
            await endPromise(dbConnection); // Close the single connection gracefully
        }
    }
}

main();