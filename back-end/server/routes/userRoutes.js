const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Middleware for authentication
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

// User Registration Route
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        
        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            // Hash password and create user
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword });

            await user.save();

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ token, msg: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
);

// User Login Route
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
);

// Get Logged-In User (Profile Route)
router.get('/me', auth, async (req, res) => {
    try {
        // Find user by ID, exclude password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update User Profile
router.put('/me', auth, async (req, res) => {
    const { name, email } = req.body;

    try {
        // Find user by ID and update the profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ msg: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get All Users (Admin access only in the future)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Delete User (Admin access)
router.delete('/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Don't send the password
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).send('Error fetching user profile');
    }
});


module.exports = router;
