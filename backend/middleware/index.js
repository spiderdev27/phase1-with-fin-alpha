const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Please login to continue' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await User.findById(decoded.user_id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Only check authentication, not subscription
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please login again to continue' });
  }
};

module.exports = { authMiddleware }; 