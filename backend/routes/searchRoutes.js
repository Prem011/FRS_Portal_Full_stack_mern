const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/searchController');
const isLoggedIn  = require('../middlewares/isLoggedIn');


// Route for searching users
router.get('/', isLoggedIn, searchUsers); // Search users by name or email

module.exports = router;
