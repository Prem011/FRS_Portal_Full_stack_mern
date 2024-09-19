const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")
const {registerUser, login, logout, getAllUsers} = require("../controllers/userController");


router.post('/register',registerUser )

router.post("/login", login  );

router.post("/logout", logout );

router.get('/users', isLoggedIn, getAllUsers);


module.exports = router;