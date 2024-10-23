const mongoose = require('mongoose');

// Define the event schema
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number, // Ensure price is a number
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

// Create the model
const Event = mongoose.model('Event', eventSchema);

// Export the model
module.exports = Event;
