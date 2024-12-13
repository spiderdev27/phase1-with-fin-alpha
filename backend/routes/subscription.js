const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware');

// Route to update subscription
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { subscriptionType } = req.body;
    const userId = req.userId;  // Use userId from middleware

    // Validate subscription type
    const validSubscriptions = ['free', 'bronze', 'silver', 'gold', 'diamond'];
    if (!validSubscriptions.includes(subscriptionType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid subscription type' 
      });
    }

    // Set expiry to 30 days from now for paid subscriptions
    const subscriptionExpiry = subscriptionType !== 'free' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

    // Update user subscription
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionType,
        subscriptionExpiry
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({ 
      success: true, 
      data: {
        subscriptionType: updatedUser.subscriptionType,
        subscriptionExpiry: updatedUser.subscriptionExpiry,
        features: updatedUser.features
      }
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message
    });
  }
});

// Route to get current subscription
router.get('/status', authMiddleware, async (req, res) => {
  try {
    // Use the user object already loaded by middleware
    const user = req.user;
    
    // No need to query the database again since middleware already validated the user
    res.json({
      success: true,
      data: {
        subscriptionType: user.subscriptionType,
        subscriptionExpiry: user.subscriptionExpiry,
        features: user.features
      }
    });

  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription status',
      error: error.message
    });
  }
});

module.exports = router;
// Route to get current subscription
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        subscriptionType: user.subscriptionType,
        subscriptionExpiry: user.subscriptionExpiry,
        features: user.features
      }
    });

  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription status',
      error: error.message
    });
  }
});

module.exports = router;