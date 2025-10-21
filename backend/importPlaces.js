import mongoose from 'mongoose';
import { Place } from './models/dbSchemas.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importPlaces() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'siwakop',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('📦 Connected to MongoDB Atlas');

        // Read and parse the JSON file
        const jsonPath = path.join(__dirname, 'dataPlace.json');
        console.log('📖 Reading data from:', jsonPath);
        const data = await fs.readFile(jsonPath, 'utf8');
        const places = JSON.parse(data);
        
        // Validate and log data details
        console.log('\n📊 Data Analysis:');
        console.log(`� Total places found: ${places.length}`);
        
        // Group places by category
        const categories = {};
        places.forEach(place => {
            categories[place.category] = (categories[place.category] || 0) + 1;
        });
        
        console.log('\n📑 Places by category:');
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} places`);
        });
        
        // Validate required fields
        console.log('\n🔍 Validating data structure...');
        const requiredFields = ['name', 'category', 'description', 'address', 'kecamatan', 
                              'operating_hours', 'price', 'latitude', 'longitude'];
        
        const invalidPlaces = places.filter(place => {
            return requiredFields.some(field => !place[field]);
        });
        
        if (invalidPlaces.length > 0) {
            console.log('⚠️ Found places with missing required fields:');
            invalidPlaces.forEach(place => {
                console.log(`   - ${place.name || 'Unnamed place'}`);
            });
        } else {
            console.log('✅ All places have required fields');
        }

        // Delete existing places
        const deleteResult = await Place.deleteMany({});
        console.log(`🧹 Cleared ${deleteResult.deletedCount} existing places`);

        // Insert new places
        console.log('📥 Starting import...');
        const result = await Place.insertMany(places);
        console.log(`✅ Successfully imported ${result.length} places`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`  Field '${key}':`, error.errors[key].message);
            });
        }
        process.exit(1);
    } finally {
        // Close the database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('📤 Disconnected from MongoDB');
        }
    }
}

// Run the import
console.log('🚀 Starting place data import process...');
importPlaces();