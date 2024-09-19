const express = require('express');
const router = express.Router();
const { addFriend, getFriends, getFriendRecommendations, declineFriendRequest, acceptFriendRequest, unfriend, getFriendRequests, pendingRequests } = require('../controllers/friendController');
const isLoggedIn  = require('../middlewares/isLoggedIn');





router.get('/friends/getFriendRequests', isLoggedIn, getFriendRequests) 

router.post('/add/:friendId', isLoggedIn, addFriend); 

router.post('/declineFriendReq/:requestId', isLoggedIn, declineFriendRequest); 

router.post('/acceptFriendREq/:requestId', isLoggedIn, acceptFriendRequest);  

router.get('/friends', isLoggedIn, getFriends);

// Route to get friend recommendations
router.get('/friends/recommendations', isLoggedIn, getFriendRecommendations);

router.delete('/friends/unfriend/:friendId', isLoggedIn, unfriend); 


// Example route to get pending friend requests for a user
router.get('/pendingRequests', isLoggedIn, pendingRequests);
  

module.exports = router;

