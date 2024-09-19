const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId,    
    ref: 'User',
    required: true 
},
  friends: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  friendsSince: {
    type: Date,
    default: Date.now
},
});

module.exports = mongoose.model('Friend', friendSchema);





// exports.acceptFriendRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     // Log the requestId and user id for debugging
//     console.log("Request ID:", requestId);
//     console.log("Recipient ID (User ID):", req.user.id);

//     // Convert requestId and recipient (userId) to ObjectId for proper querying
//     // const friendRequest = await FriendRequest.findOne({
//     //   _id: new mongoose.Types.ObjectId(requestId),       // Make sure requestId is an ObjectId
//     //   recipient: new mongoose.Types.ObjectId(req.user.id) // Make sure recipient is an ObjectId
//     // });

//     const friendRequest = await FriendRequest.findOne({
//       sender : new mongoose.Types.ObjectId(req.user.id),
//       recipient : new mongoose.Types.ObjectId(requestId),
//       status: 'pending'
//     })

//     if (!friendRequest) {
//       return res.status(404).json({ message: 'Friend request not found or already handled' });
//     }

//     const user = await User.findById(req.user.id);
//     const friend = await User.findById(friendRequest.sender);

//     user.friends.push(friend._id);
//     friend.friends.push(user._id);

//     await user.save();
//     await friend.save();

//     res.status(200).json({ message: 'Friend request accepted successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };