const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRecommendationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedFriend: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Who recommended this friend
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FriendRecommendation', friendRecommendationSchema);
