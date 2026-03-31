const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; 

    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    
    const token = jwt.sign({ email, name }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      message: 'Login successful',
      user: { name, email, picture },
      token,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
};

module.exports = { googleLogin };