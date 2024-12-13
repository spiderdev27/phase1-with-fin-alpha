const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const Activity = require('../models/Activity');
const Transaction = require('../models/Transaction');
const axios = require('axios');

// Get dashboard overview
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch all required data
    const [portfolio, watchlist, activities, transactions] = await Promise.all([
      Portfolio.findOne({ userId }),
      Watchlist.findOne({ userId }),
      Activity.find({ userId }).sort({ timestamp: -1 }).limit(5),
      Transaction.find({ userId }).sort({ date: -1 }).limit(5)
    ]);

    // Calculate portfolio metrics
    const portfolioValue = portfolio?.totalValue || 0;
    const watchlistCount = watchlist?.stocks?.length || 0;
    const alertsCount = 0; // You can add alerts functionality later

    res.json({
      success: true,
      data: {
        portfolioValue,
        watchlistCount,
        alertsCount,
        recentActivities: activities,
        recentTransactions: transactions
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard overview'
    });
  }
});

// Get portfolio performance data
router.get('/portfolio/performance', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { timeframe = '1M' } = req.query;

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.json({
        success: true,
        data: {
          labels: [],
          values: []
        }
      });
    }

    // Generate mock performance data based on timeframe
    const data = generatePerformanceData(timeframe);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Portfolio performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio performance'
    });
  }
});

// Add transaction
router.post('/transactions', authMiddleware, async (req, res) => {
  try {
    const { type, symbol, quantity, price } = req.body;
    const userId = req.userId;

    const transaction = await Transaction.create({
      userId,
      type,
      symbol,
      quantity,
      price,
      total: quantity * price
    });

    // Update portfolio
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({
        userId,
        totalValue: 0,
        holdings: []
      });
    }

    // Update holdings
    const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
    if (type === 'BUY') {
      if (holdingIndex === -1) {
        portfolio.holdings.push({
          symbol,
          quantity,
          avgCost: price,
          currentPrice: price,
          value: quantity * price
        });
      } else {
        const holding = portfolio.holdings[holdingIndex];
        const newQuantity = holding.quantity + quantity;
        const newAvgCost = ((holding.avgCost * holding.quantity) + (price * quantity)) / newQuantity;
        holding.quantity = newQuantity;
        holding.avgCost = newAvgCost;
        holding.currentPrice = price;
        holding.value = newQuantity * price;
      }
    } else {
      if (holdingIndex !== -1) {
        const holding = portfolio.holdings[holdingIndex];
        holding.quantity -= quantity;
        if (holding.quantity <= 0) {
          portfolio.holdings.splice(holdingIndex, 1);
        } else {
          holding.currentPrice = price;
          holding.value = holding.quantity * price;
        }
      }
    }

    // Update total value
    portfolio.totalValue = portfolio.holdings.reduce((total, holding) => total + holding.value, 0);
    await portfolio.save();

    // Log activity
    await Activity.create({
      userId,
      type: type === 'BUY' ? 'PURCHASE' : 'SALE',
      description: `${type === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${symbol} at ₹${price}`
    });

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add transaction'
    });
  }
});

// Helper function to generate mock performance data
function generatePerformanceData(timeframe) {
  const labels = [];
  const values = [];
  let points = 0;

  switch (timeframe) {
    case '1D':
      points = 24;
      for (let i = 0; i < points; i++) {
        labels.push(`${i}:00`);
        values.push(150000 + Math.random() * 5000);
      }
      break;
    case '1W':
      points = 7;
      for (let i = 0; i < points; i++) {
        labels.push(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]);
        values.push(150000 + Math.random() * 10000);
      }
      break;
    case '1M':
      points = 30;
      for (let i = 0; i < points; i++) {
        labels.push(`Day ${i + 1}`);
        values.push(150000 + Math.random() * 15000);
      }
      break;
    case '3M':
      points = 12;
      for (let i = 0; i < points; i++) {
        labels.push(`Week ${i + 1}`);
        values.push(150000 + Math.random() * 20000);
      }
      break;
    case '1Y':
      points = 12;
      for (let i = 0; i < points; i++) {
        labels.push(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]);
        values.push(150000 + Math.random() * 30000);
      }
      break;
    default:
      points = 12;
      for (let i = 0; i < points; i++) {
        labels.push(`Month ${i + 1}`);
        values.push(150000 + Math.random() * 30000);
      }
  }

  return { labels, values };
}

module.exports = router; 