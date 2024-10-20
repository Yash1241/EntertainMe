const express = require('express');
const Booking = require('../models/Booking'); // Adjust the path as needed
const router = express.Router();

// Middleware for authentication (if needed)
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(403).send('Access denied.');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user information to the request
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

// Create a new booking
router.post('/', auth, async (req, res) => {
    const { userId, eventId, date } = req.body;
    const newBooking = new Booking({ userId, eventId, date });

    try {
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).send('Error creating booking');
    }
});

// Get all bookings
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).send('Error retrieving bookings');
    }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting booking');
    }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) return res.status(404).send('Booking not found');
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).send('Error updating booking');
    }
});

module.exports = router;

