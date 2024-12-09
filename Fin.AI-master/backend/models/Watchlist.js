const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stocks: [{
    symbol: String,
    name: String,
    price: Number,
    change: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Watchlist', WatchlistSchema); 