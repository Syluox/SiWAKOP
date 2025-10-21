import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (like MONGO_URI)
dotenv.config();

// =========================================================================
// 🛑 STEP 1: Set the name of the collection (table) you want to inspect.
// This is currently set to 'places'.
const COLLECTION_NAME_TO_CHECK = 'places'; 
// =========================================================================

/**
 * Checks MongoDB connection, lists all collections, and reports the document count for the target collection.
 */
async function checkDatabaseAvailability() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/siwakop';
    
    // Extract DB name for clarity
    const dbNameMatch = uri.match(/\/([^/?]+)\??/);
    const targetDbName = dbNameMatch ? dbNameMatch[1] : 'the target database';

    console.log(`\n\u23F3 Starting Database Check...`);
    console.log(`Target URI: ${uri}`);

    try {
        // 1. Establish the connection
        await mongoose.connect(process.env.MONGO_URI, {dbName:'siwakop'});

        console.log('\n\u2705 SUCCESS: MongoDB connection is live.');
        console.log(`Connected to database: ${targetDbName}`);

        // --- List All Collections ---
        console.log(`\n--- Collections Found in ${targetDbName} ---`);
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (collectionNames.length === 0) {
            console.log('\u26a0\ufe0f No collections (tables) found in this database.');
        } else {
            console.log(`Found ${collectionNames.length} collections:`);
            console.log(collectionNames.join(', '));
        }

        // --- Document Count Check ---
        
        // 2. Define a simple model just for counting (Mongoose requirement)
        const SimpleSchema = new mongoose.Schema({}, { strict: false, collection: COLLECTION_NAME_TO_CHECK });
        // Use an existing model name if available, otherwise define a new one
        const SimpleModel = mongoose.models.SimpleChecker || mongoose.model('SimpleChecker', SimpleSchema, COLLECTION_NAME_TO_CHECK);
        
        // 3. Get the total count of documents
        const totalCount = await SimpleModel.countDocuments();
        
        console.log(`\n--- Document Check for ${COLLECTION_NAME_TO_CHECK} ---`);
        
        if (totalCount === 0) {
            console.log(`\u26a0\ufe0f RESULT: The collection is EMPTY. Total documents: 0.`);
            if (!collectionNames.includes(COLLECTION_NAME_TO_CHECK)) {
                 console.log(`\u26a0\ufe0f WARNING: The collection name '${COLLECTION_NAME_TO_CHECK}' does NOT appear in the list above.`);
                 console.log(`\u26a0\ufe0f ACTION: Please update COLLECTION_NAME_TO_CHECK to one of the names listed above.`);
            }
        } else {
            console.log(`\u2714\ufe0f RESULT: Collection has data. Total documents: ${totalCount}`);
        }
        
    } catch (error) {
        // This catches connection timeouts or failed authentication
        console.error('\n❌ FAILURE: Could not connect to MongoDB.');
        console.error('Check your MONGO_URI or ensure the service is running.');
        console.error(`Error Message: ${error.message}`);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log('\n\u23F9 Connection closed.');
    }
}

checkDatabaseAvailability();
