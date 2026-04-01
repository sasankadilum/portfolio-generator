const express = require('express');
const router = express.Router();
const { 
  createPortfolio, 
  getPortfolioByUsername, 
  updatePortfolio,
  deletePortfolio,
  getMyPortfolio 
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/portfolio - Create a new portfolio (Protected)
router.post('/', protect, createPortfolio);

// GET /api/portfolio/me - Get current user's portfolio (Protected)
router.get('/me', protect, getMyPortfolio);

// GET /api/portfolio/:username - Fetch a portfolio by username (Public)
router.get('/:username', getPortfolioByUsername);

// PUT /api/portfolio/:username - Update an existing portfolio (Protected)
router.put('/:username', protect, updatePortfolio);

// DELETE /api/portfolio/:username - Delete a portfolio (Protected)
router.delete('/:username', protect, deletePortfolio);

module.exports = router;