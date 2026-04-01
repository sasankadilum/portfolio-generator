const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the new User model

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; 

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists in our MongoDB database
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one in the database
    if (!user) {
      user = await User.create({
        name,
        email,
        picture
      });
    }

    // Now sign the JWT token using the MongoDB _id
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email, picture: user.picture },
      token,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
};

module.exports = { googleLogin };