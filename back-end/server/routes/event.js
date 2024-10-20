const express = require('express');
const Event = require('../models/Event'); // Import the Event model
const router = express.Router();
const auth = require('../middleware/auth'); // Ensure you have an auth middleware

// Create a new event
router.post('/', auth, async (req, res) => {
    const { title, date, category, description, price } = req.body;
    const newEvent = new Event({ title, date, category, description, price });

    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).send('Error creating event');
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

// Get a specific event by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).send('Event not found');
        res.json(event);
    } catch (error) {
        res.status(500).send('Error fetching event');
    }
});

// Update an event
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const event = await Event.findByIdAndUpdate(id, updates, { new: true });
        if (!event) return res.status(404).send('Event not found');
        res.json(event);
    } catch (error) {
        res.status(500).send('Error updating event');
    }
});

// Delete an event
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) return res.status(404).send('Event not found');
        res.send('Event deleted');
    } catch (error) {
        res.status(500).send('Error deleting event');
    }
});

module.exports = router;
