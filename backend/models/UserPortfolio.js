const mongoose = require('mongoose');

// Define the schema for the user's public portfolio details
const UserPortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the primary User model (links portfolio to an account)
  },
  username: {
    type: String,
    required: true,
    unique: true,   // Ensures the public URL is unique (e.g., /portfolio/johndoe)
    trim: true,     // Removes leading and trailing spaces automatically
    lowercase: true // Converts to lowercase to enforce URL safety
  },
  fullName: {
    type: String,
    required: true  // Full name displayed on the portfolio
  },
  title: {
    type: String    // Professional title (e.g., "Full Stack Developer")
  },
  bio: {
    type: String    // Short biography or "About Me" section
  },
  profileImage: {
    type: String    // Custom profile picture URL for the portfolio layout
  },
  contact: {
    // Nested object for social media and contact links
    email: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  skills: [{
    type: String    // Array of strings to hold technical skills
  }],
  projects: [{
    // Array of objects representing individual featured projects
    name: { type: String },
    description: { type: String },
    techStack: [{ type: String }], // Array of technologies used in the project
    githubLink: { type: String },
    liveDemo: { type: String }
  }],
  experience: [{
    // Array of objects representing work experience history
    company: { type: String },
    role: { type: String },
    duration: { type: String },
    description: { type: String }
  }]
}, {
  timestamps: true // Automatically track creation and modification times
});

module.exports = mongoose.model('UserPortfolio', UserPortfolioSchema);