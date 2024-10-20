const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Check if the authorization header exists
    if (!authHeader) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    // Split "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied. Token missing.' });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the user to the request object
        next(); // Proceed to the next middleware/route
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        } else {
            return res.status(500).json({ message: 'Server error during token verification.' });
        }
    }
};

module.exports = auth;
