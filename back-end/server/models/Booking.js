const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled'],
        default: 'confirmed',
    },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
