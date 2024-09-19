const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexing username and email for search results
userSchema.index({ username: 'text', email: 'text' });

userSchema.plugin(plm);

const User = mongoose.model('User', userSchema);

module.exports = User;
