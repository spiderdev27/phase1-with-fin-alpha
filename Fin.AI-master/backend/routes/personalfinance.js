const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const User = require('../models/User');

// Get all financial data
router.get('/data', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('financialData');
    
    if (!user.financialData) {
      user.financialData = {
        goals: [],
        budget: {
          income: 0,
          expenses: {
            housing: 0,
            transportation: 0,
            food: 0,
            utilities: 0,
            entertainment: 0,
            other: 0
          }
        },
        investments: []
      };
      await user.save();
    }

    res.json({
      success: true,
      data: user.financialData
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial data'
    });
  }
});

// Add financial goal
router.post('/goals', authMiddleware, async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user.financialData) {
      user.financialData = { goals: [] };
    }

    const newGoal = {
      id: Date.now(),
      title,
      targetAmount,
      deadline,
      progress: 0,
      createdAt: new Date()
    };

    user.financialData.goals.push(newGoal);
    await user.save();

    res.json({
      success: true,
      data: newGoal
    });
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add goal'
    });
  }
});

// Update budget
router.post('/budget', authMiddleware, async (req, res) => {
  try {
    const { income, expenses } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user.financialData) {
      user.financialData = {};
    }

    user.financialData.budget = {
      income,
      expenses,
      lastUpdated: new Date()
    };

    await user.save();

    res.json({
      success: true,
      data: user.financialData.budget
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update budget'
    });
  }
});

// Add investment
router.post('/investments', authMiddleware, async (req, res) => {
  try {
    const { type, amount, date, notes } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user.financialData) {
      user.financialData = { investments: [] };
    }

    const newInvestment = {
      id: Date.now(),
      type,
      amount,
      date,
      notes,
      createdAt: new Date()
    };

    user.financialData.investments.push(newInvestment);
    await user.save();

    res.json({
      success: true,
      data: newInvestment
    });
  } catch (error) {
    console.error('Error adding investment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add investment'
    });
  }
});

// Delete goal
router.delete('/goals/:goalId', authMiddleware, async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user.financialData || !user.financialData.goals) {
      return res.status(404).json({
        success: false,
        message: 'No goals found'
      });
    }

    user.financialData.goals = user.financialData.goals.filter(
      goal => goal.id !== parseInt(goalId)
    );
    await user.save();

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete goal'
    });
  }
});

// Delete investment
router.delete('/investments/:investmentId', authMiddleware, async (req, res) => {
  try {
    const { investmentId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user.financialData || !user.financialData.investments) {
      return res.status(404).json({
        success: false,
        message: 'No investments found'
      });
    }

    user.financialData.investments = user.financialData.investments.filter(
      investment => investment.id !== parseInt(investmentId)
    );
    await user.save();

    res.json({
      success: true,
      message: 'Investment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete investment'
    });
  }
});

module.exports = router;