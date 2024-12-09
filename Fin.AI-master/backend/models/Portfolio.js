const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalValue: {
    type: Number,
    default: 0
  },
  todayChange: {
    type: Number,
    default: 0
  },
  holdings: [{
    symbol: String,
    name: String,
    quantity: Number,
    avgCost: Number,
    currentPrice: Number,
    value: Number,
    change: Number,
    pnl: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema); 