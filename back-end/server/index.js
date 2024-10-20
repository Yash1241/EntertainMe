const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const User = require('./models/User'); // User model
const Event = require('./models/Event'); // Event model
const Booking = require('./models/Booking'); // Booking model

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Login Route
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials.');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

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

// Protected Event Creation Route
app.post('/api/events', auth, async (req, res) => {
    const { title, date, category, description, price } = req.body;
    const newEvent = new Event({ title, date, category, description, price });

    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).send('Error creating event: ' + error.message);
    }
});

// Import Routes
const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct
const itemRoutes = require('./routes/itemRoutes'); // Ensure this path is correct
const bookingRoutes = require('./routes/bookingRoutes'); // Ensure this path is correct
const eventRoutes = require('./routes/event'); // Ensure this path is correct

// Use Routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/items', itemRoutes); // Item routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/events', eventRoutes); // Event routes

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to Entertain Me API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
