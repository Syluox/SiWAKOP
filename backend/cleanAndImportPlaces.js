import mongoose from 'mongoose';
import { Place } from './models/dbSchemas.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanAndImportPlaces() {
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

        // Clean and transform the data
        const cleanedPlaces = places.map(place => {
            // Remove id field
            const { id, ...placeWithoutId } = place;
            
            // Ensure price fields are numbers
            return {
                ...placeWithoutId,
                price: {
                    entry_fee: Number(place.price.entry_fee) || 0,
                    parking_bike: Number(place.price.parking_bike) || 0,
                    parking_car: Number(place.price.parking_car) || 0,
                    note: place.price.note || ''
                },
                operating_hours: {
                    type: place.operating_hours.type,
                    start: place.operating_hours.start || '',
                    end: place.operating_hours.end || ''
                },
                facilities: Array.isArray(place.facilities) ? place.facilities : [],
                reviews: []
            };
        });

        // Delete existing places
        const deleteResult = await Place.deleteMany({});
        console.log(`🧹 Cleared ${deleteResult.deletedCount} existing places`);

        // Insert cleaned places
        console.log('📥 Starting import...');
        const result = await Place.insertMany(cleanedPlaces);
        console.log(`✅ Successfully imported ${result.length} places`);

        // Log categories summary
        const categories = {};
        cleanedPlaces.forEach(place => {
            categories[place.category] = (categories[place.category] || 0) + 1;
        });

        console.log('\n📊 Places by category:');
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} places`);
        });

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
cleanAndImportPlaces();