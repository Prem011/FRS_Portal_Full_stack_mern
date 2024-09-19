const User = require('../models/userSchema');


// Search users by name or email
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Perform case-insensitive search for both name and email
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },   // Case-insensitive match for name
                { email: { $regex: query, $options: 'i' } }   // Case-insensitive match for email
            ]
        }).select('name email'); // Return only name and email

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // const 

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
