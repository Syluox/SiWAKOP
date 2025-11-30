import express from 'express';

const router = express.Router();
// The database connection pool is available via req.app.locals.db
const TABLE_NAME = 'tempat';

// Middleware to get the database connection pool
router.use((req, res, next) => {
    // Ensure the database connection is available before proceeding
    if (!req.app.locals.db) {
        return res.status(503).json({ 
            message: 'Database service unavailable. Server starting up.' 
        });
    }
    next();
});

// -------------------------------------------------------------------
// GET /api/places - Get all places
// -------------------------------------------------------------------
router.get('/', async (req, res) => {
    const db = req.app.locals.db;
    try {
        // SELECT all columns from the tourism_places table
        const sql = `SELECT * FROM ${TABLE_NAME}`;
        
        // Use db.query, which has been promisified in server.js
        const rows = await db.query(sql);

        // For the original 'mysql' package, query often returns rows as the first element
        // If your setup returns [rows, fields], you may need const [rows] = await db.query(sql);
        res.json(rows);

    } catch (err) {
        console.error('Error fetching all places:', err);
        res.status(500).json({ message: 'Failed to retrieve places from database.' });
    }
});

// -------------------------------------------------------------------
// GET /api/places/rand - Get 10 random places (Replaces $sample)
// -------------------------------------------------------------------
router.get('/rand', async (req, res) => {
    const db = req.app.locals.db;
    try {
        // Use the MySQL RAND() function to mimic MongoDB's $sample
        const sql = `SELECT * FROM ${TABLE_NAME} ORDER BY RAND() LIMIT 10`;
        const rows = await db.query(sql);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching random places:', err);
        res.status(500).json({ message: 'Failed to retrieve random places.' });
    }
});

// -------------------------------------------------------------------
// GET /api/places/:id - Get a specific place by ID
// -------------------------------------------------------------------
router.get('/:id', async (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    try {
        // Find the place by its primary key 'id'
        const sql = `SELECT * FROM ${TABLE_NAME} WHERE id = ?`;
        const rows = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: `Place with ID ${id} not found` });
        }
        // Return the first (and only) row found
        res.json(rows[0]);
    } catch (err) {
        console.error(`Error fetching place ID ${id}:`, err);
        res.status(500).json({ message: 'Failed to retrieve place.' });
    }
});

// -------------------------------------------------------------------
// POST /api/places - Add a new place (Replaces place.save())
// -------------------------------------------------------------------
router.post('/', async (req, res) => {
    const db = req.app.locals.db;
    
    // Destructure required fields from the request body
    const { name, category, description, address, kecamatan, operating_hours, price, facilities, latitude, longitude, photo_url } = req.body;

    // Use a transaction for safe insertion, although not strictly required here, it's good practice.
    let connection;
    try {
        connection = await db.getConnection(); // Get connection from pool
        await connection.beginTransaction();

        const sql = `
            INSERT INTO ${TABLE_NAME} (
                name, category, description, address, kecamatan, operating_hours, price, 
                facilities, latitude, longitude, photo_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Prepare values, JSON.stringify complex objects for storage
        const values = [
            name, category, description, address, kecamatan,
            JSON.stringify(operating_hours || {}),
            JSON.stringify(price || {}),
            JSON.stringify(facilities || []),
            latitude, longitude, photo_url
        ];

        // Execute the query
        const result = await connection.query(sql, values);
        await connection.commit();

        // The result object contains insertId (the new auto-incremented primary key)
        const newPlaceId = result.insertId;
        
        // Return success response with the ID of the newly created resource
        res.status(201).json({ id: newPlaceId, ...req.body });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error creating new place:', err);
        // 400 for bad input data, 500 for server error
        res.status(400).json({ message: 'Failed to create new place.', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// -------------------------------------------------------------------
// PATCH /api/places/:id - Update a place (Replaces place.save() patch logic)
// -------------------------------------------------------------------
router.patch('/:id', async (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    const updates = req.body;

    try {
        // 1. Check if the place exists
        const [existing] = await db.query(`SELECT id FROM ${TABLE_NAME} WHERE id = ?`, [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Place not found' });
        }

        const setClauses = [];
        const updateValues = [];

        // 2. Dynamically build the SQL UPDATE query
        for (const key in updates) {
            const value = updates[key];
            if (value != null) {
                // MySQL JSON fields need to be stringified
                if (['operating_hours', 'price', 'facilities'].includes(key)) {
                    setClauses.push(`${key} = ?`);
                    updateValues.push(JSON.stringify(value));
                } else {
                    setClauses.push(`${key} = ?`);
                    updateValues.push(value);
                }
            }
        }

        if (setClauses.length === 0) {
            return res.status(200).json({ message: 'No fields provided to update' });
        }

        // 3. Execute the update
        const sql = `UPDATE ${TABLE_NAME} SET ${setClauses.join(', ')} WHERE id = ?`;
        updateValues.push(id); // Append ID to the end of values array for the WHERE clause
        
        await db.query(sql, updateValues);

        // 4. Fetch and return the updated row for consistency
        const updatedRow = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [id]);
        res.json(updatedRow[0]);

    } catch (err) {
        console.error(`Error updating place ID ${id}:`, err);
        res.status(400).json({ message: 'Failed to update place.', error: err.message });
    }
});

// -------------------------------------------------------------------
// DELETE /api/places/:id - Delete a place (Replaces place.deleteOne())
// -------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    try {
        const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;
        const result = await db.query(sql, [id]);
        
        // result.affectedRows checks if any row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Place not found or already deleted' });
        }
        res.json({ message: `Place with ID ${id} deleted successfully` });
    } catch (err) {
        console.error(`Error deleting place ID ${id}:`, err);
        res.status(500).json({ message: 'Failed to delete place.' });
    }
});

export default router;