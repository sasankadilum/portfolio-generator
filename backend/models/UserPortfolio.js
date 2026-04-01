const mongoose = require('mongoose');

const UserPortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  fullName: {
    type: String,
    required: true
  },
  title: {
    type: String 
  },
  bio: {
    type: String
  },
  profileImage: {
    type: String 
  },
  contact: {
    email: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  skills: [{
    type: String 
  }],
  projects: [{
    name: { type: String },
    description: { type: String },
    techStack: [{ type: String }],
    githubLink: { type: String },
    liveDemo: { type: String }
  }],
  experience: [{
    company: { type: String },
    role: { type: String },
    duration: { type: String },
    description: { type: String }
  }]
}, {
  timestamps: true 
});

module.exports = mongoose.model('UserPortfolio', UserPortfolioSchema);