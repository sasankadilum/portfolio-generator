const mongoose = require('mongoose');

// Define the schema for authenticated users (e.g., Google login data)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
  },
  email: {
    type: String,
    required: true, // Email is mandatory
    unique: true,   // Ensure no duplicate emails exist in the database
  },
  picture: {
    type: String,   // URL for the user's authentication profile picture
  }
}, {
  timestamps: true  // Automatically add createdAt and updatedAt timestamp fields
});

module.exports = mongoose.model('User', UserSchema);