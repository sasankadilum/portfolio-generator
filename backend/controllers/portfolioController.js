const UserPortfolio = require('../models/UserPortfolio');

// Create a new portfolio
const createPortfolio = async (req, res) => {
  try {
    const { username, fullName, title, bio, profileImage, contact, skills, projects, experience } = req.body;

    // 1. Enforce URL-Safe Usernames (Lowercase, numbers, and hyphens only)
    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        message: 'Username can only contain lowercase letters, numbers, and hyphens without spaces.' 
      });
    }

    const newPortfolio = new UserPortfolio({
      user: req.user._id, // Now req.user will have the _id from the Database
      username: username.toLowerCase(), // Force lowercase for consistency
      fullName,
      title,
      bio,
      profileImage, 
      contact,
      skills,
      projects,
      experience
    });

    const savedPortfolio = await newPortfolio.save();
    
    res.status(201).json(savedPortfolio);
    
  } catch (error) {
    // 2. Handle Duplicate Usernames properly (MongoDB Error Code: 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
    }
    console.error("Error creating portfolio:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Fetch a portfolio by username
const getPortfolioByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    
    // Find the portfolio in the database
    const portfolio = await UserPortfolio.findOne({ username: username.toLowerCase() });
    
    // If no portfolio is found, return a 404 error
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found.' });
    }
    
    // Return the found portfolio
    res.status(200).json(portfolio);
    
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ message: 'Server Error. Could not fetch portfolio.', error: error.message });
  }
};

// Update an existing portfolio
const updatePortfolio = async (req, res) => {
  try {
    const username = req.params.username;
    const updateData = req.body;
    
    // First, find the portfolio to check ownership
    const portfolio = await UserPortfolio.findOne({ username: username.toLowerCase() });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found to update.' });
    }

    // 3. SECURITY FIX (IDOR): Check if the logged-in user owns this portfolio
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own portfolio.' });
    }
    
    // Find the portfolio by username and update it with new data
    // { new: true } ensures we get the updated document back
    const updatedPortfolio = await UserPortfolio.findOneAndUpdate(
      { username: username.toLowerCase() },
      updateData,
      { new: true, runValidators: true } 
    );
    
    res.status(200).json(updatedPortfolio);
    
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({ message: 'Server Error. Could not update portfolio.', error: error.message });
  }
};

// Delete a portfolio
const deletePortfolio = async (req, res) => {
  try {
    const username = req.params.username;
    
    // Find the portfolio first to check ownership
    const portfolio = await UserPortfolio.findOne({ username: username.toLowerCase() });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found to delete.' });
    }

    // 3. SECURITY FIX (IDOR): Check if the logged-in user owns this portfolio
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own portfolio.' });
    }
    
    // If authorized, proceed with deletion
    await UserPortfolio.findOneAndDelete({ username: username.toLowerCase() });
    
    res.status(200).json({ message: 'Portfolio deleted successfully.' });
    
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({ message: 'Server Error. Could not delete portfolio.', error: error.message });
  }
};

// Get all portfolios for the currently logged-in user
const getMyPortfolio = async (req, res) => {
  try {
    const portfolios = await UserPortfolio.find({ user: req.user._id });
    
    if (portfolios && portfolios.length > 0) {
      res.status(200).json(portfolios);
    } else {
      res.status(404).json({ message: 'No portfolios found for this user.' });
    }
  } catch (error) {
    console.error("Error fetching user portfolios:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Check if username already exists
const checkUsernameExists = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Check database for existing username
    const existingPortfolio = await UserPortfolio.findOne({ username: username.toLowerCase() });
    
    if (existingPortfolio) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPortfolio,
  getPortfolioByUsername,
  updatePortfolio,
  deletePortfolio,
  getMyPortfolio,
  checkUsernameExists
};