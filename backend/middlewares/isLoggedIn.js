const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Import your User model

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token or user does not exist' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = isLoggedIn;
