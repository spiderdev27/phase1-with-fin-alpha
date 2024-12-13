const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Feature to subscription level mapping
const FEATURE_REQUIREMENTS = {
  'fundamentals': 'free',
  'stock_analysis': 'bronze',
  'sector_analysis': 'gold',
  'fininspect': 'silver',
  // Add more features and their required subscription levels here
};

// Subscription levels and their hierarchy
const SUBSCRIPTION_LEVELS = {
  'free': 0,
  'bronze': 1,
  'silver': 2,
  'gold': 3,
  'platinum': 4
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required - No Authorization header' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('No token found after Bearer prefix');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required - No token provided' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully, user ID:', decoded.user_id);

      const user = await User.findById(decoded.user_id);
      if (!user) {
        console.log('User not found for ID:', decoded.user_id);
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      if (user.subscriptionExpiry && user.subscriptionExpiry < new Date()) {
        console.log('Subscription expired for user:', decoded.user_id);
        return res.status(403).json({ 
          success: false,
          message: 'Subscription expired' 
        });
      }

      // Store both the full user object and the ID for convenience
      req.user = user;
      req.userId = decoded.user_id;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token - JWT verification failed',
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication failed - Internal server error',
      error: error.message 
    });
  }
};

const requireFeature = (featureName) => {
  return (req, res, next) => {
    try {
      // If it's the fundamentals feature, allow access for all authenticated users
      if (featureName === 'fundamentals') {
        return next();
      }

      const requiredSubscription = FEATURE_REQUIREMENTS[featureName];
      
      if (!requiredSubscription) {
        console.error(`Feature ${featureName} not found in feature requirements`);
        return res.status(400).json({
          success: false,
          message: 'Invalid feature requested'
        });
      }

      const userSubscription = req.user.subscriptionType?.toLowerCase() || 'free';
      
      if (!SUBSCRIPTION_LEVELS.hasOwnProperty(userSubscription)) {
        console.error(`Invalid subscription type: ${userSubscription}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription type'
        });
      }

      if (SUBSCRIPTION_LEVELS[userSubscription] < SUBSCRIPTION_LEVELS[requiredSubscription]) {
        return res.status(403).json({
          success: false,
          message: `This feature requires a ${requiredSubscription} subscription or higher`
        });
      }

      next();
    } catch (error) {
      console.error('Feature check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Feature check failed',
        error: error.message
      });
    }
  };
};

const requireSubscription = (minimumLevel) => {
  return (req, res, next) => {
    try {
      const userSubscription = req.user.subscriptionType || 'free';
      
      if (!SUBSCRIPTION_LEVELS.hasOwnProperty(userSubscription) || 
          !SUBSCRIPTION_LEVELS.hasOwnProperty(minimumLevel)) {
        console.error(`Invalid subscription type: ${userSubscription} or ${minimumLevel}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription type'
        });
      }

      if (SUBSCRIPTION_LEVELS[userSubscription] < SUBSCRIPTION_LEVELS[minimumLevel]) {
        return res.status(403).json({
          success: false,
          message: `This feature requires a ${minimumLevel} subscription or higher`
        });
      }

      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Subscription check failed',
        error: error.message
      });
    }
  };
};

module.exports = { 
  authMiddleware,
  requireFeature,
  requireSubscription
};