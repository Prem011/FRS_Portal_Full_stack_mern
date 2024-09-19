const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
  sender: {
     type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true
     },
  recipient: {
     type: Schema.Types.ObjectId, 
     ref: 'User',
      required: true
     },
  status: {
     type: String,
      enum: ['pending', 'accepted', 'declined'],
       default: 'pending'
       },
  sentAt: { 
    type: Date,
     default: Date.now
     },
});

module.exports = mongoose.model('FriendRequest', friendRequestSchema);
 

