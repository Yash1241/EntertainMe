const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js'); // Adjust the path as needed
const Event = require('./models/Event'); // Adjust the path as needed
const Booking = require('./models/Booking'); // Adjust the path as needed

dotenv.config(); // Load environment variables from .env file
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('All environment variables:', process.env);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    if (process.env.NODE_ENV !== 'test') {
        console.log('MongoDB connected');
    }
})
.catch(err => console.error(err));


// Authentication Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(403).send('Access denied.');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the user information to the request
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

// Sample in-memory array for demonstration
let items = [
    { id: 1, name: 'Item 1', description: 'Description of Item 1' },
    { id: 2, name: 'Item 2', description: 'Description of Item 2' }
];

// GET endpoint to retrieve all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// POST endpoint to create a new item
app.post('/api/items', (req, res) => {
    const newItem = req.body;
    newItem.id = items.length + 1;
    items.push(newItem);
    res.status(201).json(newItem);
});

// DELETE endpoint to remove an item
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    items = items.filter(item => item.id !== id);
    res.status(204).send();
});

// PUT endpoint to update an item
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const item = items.find(item => item.id === id);

    if (item) {
        item.name = name;
        item.description = description;
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// User Registration Route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// User Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found.');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials.');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Get All Users
app.get('/api/users', auth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
});

// Update User
app.put('/api/users/:id', auth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send('Error updating user');
    }
});

// Delete User
app.delete('/api/users/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

// Event Creation Route (Admin)
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

// Other routes can be added here...

app.get('/', (req, res) => {
    res.send('Welcome to Entertain Me API');
});

// Export the app for testing
module.exports = app;

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
