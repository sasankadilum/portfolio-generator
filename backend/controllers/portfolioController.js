const UserPortfolio = require('../models/UserPortfolio');

// Create a new portfolio
const createPortfolio = async (req, res) => {
  try {
    // Extract data from the request body
    const { username, fullName, title, bio, contact, skills, projects, experience } = req.body;

    // Check if a portfolio with this username already exists
    const existingPortfolio = await UserPortfolio.findOne({ username });
    if (existingPortfolio) {
      return res.status(400).json({ message: 'Username is already taken. Please choose another one.' });
    }

    // Create a new portfolio document
    const newPortfolio = new UserPortfolio({
      username,
      fullName,
      title,
      bio,
      contact,
      skills,
      projects,
      experience
    });

    // Save to MongoDB
    const savedPortfolio = await newPortfolio.save();
    
    // Send success response
    res.status(201).json(savedPortfolio);

  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({ message: 'Server Error. Could not create portfolio.', error: error.message });
  }
};
// Fetch a portfolio by username
const getPortfolioByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    
    // Find the portfolio in the database
    const portfolio = await UserPortfolio.findOne({ username });
    
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
    
    // Find the portfolio by username and update it with new data
    // { new: true } ensures we get the updated document back
    const updatedPortfolio = await UserPortfolio.findOneAndUpdate(
      { username },
      updateData,
      { new: true, runValidators: true } 
    );
    
    if (!updatedPortfolio) {
      return res.status(404).json({ message: 'Portfolio not found to update.' });
    }
    
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
    
    // Find the portfolio by username and delete it
    const deletedPortfolio = await UserPortfolio.findOneAndDelete({ username });
    
    if (!deletedPortfolio) {
      return res.status(404).json({ message: 'Portfolio not found to delete.' });
    }
    
    res.status(200).json({ message: 'Portfolio deleted successfully.' });
    
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({ message: 'Server Error. Could not delete portfolio.', error: error.message });
  }
};
module.exports = {
  createPortfolio,
  getPortfolioByUsername,
  updatePortfolio,
  deletePortfolio
};