const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Adjust the path as needed
const Event = require('./models/Event'); // Adjust the path as needed
const Booking = require('./models/Booking'); // Adjust the path as needed
const userRoutes = require('./userRoutes'); // Import user routes
const itemRoutes = require('./itemRoutes'); // Import item routes
const bookingRoutes = require('./bookingRoutes'); // Import booking routes

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Authentication Middleware
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

// Routes
app.use('/api/users', userRoutes); // Use user routes
app.use('/api/items', itemRoutes); // Use item routes
app.use('/api/bookings', bookingRoutes); // Use booking routes

// Event Routes
app.post('/api/events', auth, async (req, res) => {
    const { title, date, category, description, price } = req.body;
    const newEvent = new Event({ title, date, category, description, price });

    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).send('Error creating event');
    }
});

// More Event CRUD routes go here...

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to Entertain Me API');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
