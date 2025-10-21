import express from 'express';
import { Place } from '../models/dbSchemas.js';

const router = express.Router();

// Get all places
router.get('/', async (req, res) => {
    try {
        const places = await Place.find()
            .select('name category description kecamatan photo_url address latitude longitude')
            .exec();
        res.json(places);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/rand', async (req, res) => {
    try {
        const places = await Place.aggregate([
            { $sample: { size: 10 } }, // Adjust size as needed
        ]).exec();
        res.json(places);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific place by ID
router.get('/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json(place);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new place
router.post('/', async (req, res) => {
    const place = new Place({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        address: req.body.address,
        kecamatan: req.body.kecamatan,
        operating_hours: req.body.operating_hours,
        price: req.body.price,
        facilities: req.body.facilities,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        photo_url: req.body.photo_url
    });

    try {
        const newPlace = await place.save();
        res.status(201).json(newPlace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a place
router.patch('/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] != null) {
                place[key] = req.body[key];
            }
        });

        const updatedPlace = await place.save();
        res.json(updatedPlace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a place
router.delete('/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        await place.deleteOne();
        res.json({ message: 'Place deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;