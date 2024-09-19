const mongoose = require('mongoose');
const User = require('../models/userSchema');
const FriendRequest = require('../models/friendRequest');
const friends = require('../models/friends')

// Send a friend request
exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.params; // ID of the user you're sending a request to
    const userId = req.user.id;      // Current logged-in user ID

    if (friendId === userId) {
      return res.status(400).json({ error: "You can't send a friend request to yourself" });
    }

    // Check if the friend and user both exist
    const friend = await User.findById(friendId);
    const user = await User.findById(userId);

    if (!friend) {
      return res.status(404).json({ error: 'This user is not found' });
    }

    // Check if a friend request already exists (from either side)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: userId, recipient: friendId, status: 'pending' },
        { sender: friendId, recipient: userId, status: 'pending' }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent or pending' });
    }

    // Create a new friend request
    const newFriendRequest = new FriendRequest({
      sender: userId,
      recipient: friendId,
      status: 'pending',
    });

    const currentFriendRequestStatus = newFriendRequest.status;

    await newFriendRequest.save();
    res.status(200).json({ message: 'Friend request sent successfully', currentFriendRequestStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Get all friend requests for the logged-in user
exports.getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ recipient: req.user.id, status: 'pending' })
      .populate('sender', 'username email');

    res.status(200).json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;  // Friend request ID

    console.log(requestId);
    console.log(req.user.id);

    // Find the friend request by ID and check if it's pending
    const friendRequest = await FriendRequest.findOne({
      sender : new mongoose.Types.ObjectId(requestId),
      recipient : new mongoose.Types.ObjectId(req.user.id),
      status: 'pending'
    });
    
    // console.log(friendRequest);
    
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found or already handled' });
    }

    // Add both users to each other's friends list
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendRequest.sender);

    user.friends.push(friend._id);
    friend.friends.push(user._id);

    // Save both users
    await user.save();
    await friend.save();
    
    // Update the friend request status to 'accepted'
    friendRequest.status = 'accepted';
    await friendRequest.save();
    // console.log("friend req status : "+friendRequest.status);

    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Decline a friend request
exports.declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;  // Friend request ID

    // Find the friend request by ID and check if it's pending
    const friendRequest = await FriendRequest.findOne({
      sender: new mongoose.Types.ObjectId(requestId),
      recipient: new mongoose.Types.ObjectId(req.user.id),
      status: 'pending'
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found or already Declined' });
    }

    // if(friendRequest.status === 'declined'){
    //   return res.status(400).json({ message: 'Friend request is already declined' });
    // }

    // Update the friend request status to 'declined'
    friendRequest.status = 'declined';
    await friendRequest.save();
    console.log(friendRequest.status);

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Unfriend a user
exports.unfriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    // Find the logged-in user and the friend
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove each other from the friends list
    user.friends = user.friends.filter(f => f.toString() !== friendId);
    friend.friends = friend.friends.filter(f => f.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Unfriended successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Get all pending requests sent by the logged-in user
exports.pendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all pending requests where the current user is the sender
    const pendingRequests = await FriendRequest.find({
      sender: mongoose.Types.ObjectId(userId),
      status: 'pending',
    }).populate('recipient', 'username email');

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get friend recommendations based on mutual friends
exports.getFriendRecommendations = async (req, res) => {
  try {
    // Find the user and populate their friends' friends list
    const user = await User.findById(req.user.id).populate({
      path: 'friends',
      populate: {
        path: 'friends', // Populate friends of the user's friends
        select: 'username email' // Optionally select fields for populated friends
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let recommendedFriends = [];

    if (user.friends.length === 0) {
      // If the user has no friends, return all users except the logged-in user
      recommendedFriends = await User.find({ _id: { $ne: user._id } }).select('username email');
    } else {
      // Get a set of all mutual friends (friends of friends) excluding user's current friends and the user themselves
      const mutualFriends = new Set();

      user.friends.forEach(friend => {
        friend.friends.forEach(friendOfFriend => {
          const friendOfFriendId = String(friendOfFriend._id);
          const userId = String(user._id);
          const isAlreadyFriend = user.friends.some(f => String(f._id) === friendOfFriendId);
          
          // Add to mutualFriends if not already a friend and not the user themselves
          if (!isAlreadyFriend && friendOfFriendId !== userId) {
            mutualFriends.add(friendOfFriendId);
          }
        });
      });

      // Convert Set to an array of user objects for recommendations
      recommendedFriends = await User.find({ _id: { $in: Array.from(mutualFriends) } }).select('username email');
    }

    res.status(200).json(recommendedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Get user's friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username email');


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
