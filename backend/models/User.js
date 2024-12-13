const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: {
    type: String,
    enum: ['free', 'bronze', 'silver', 'gold', 'diamond', 'admin'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  features: [{
    type: String,
    enum: [
      'base_plan',
      'stock_analysis',
      'sector_analysis',
      'personal_finance',
      'api_integration_equity',
      'api_integration_fo',
      'api_integration_crypto'
    ]
  }]
}, { timestamps: true });

// Middleware to update features based on subscription
userSchema.pre('save', function(next) {
  switch (this.subscriptionType) {
    case 'bronze':
      this.features = ['base_plan', 'stock_analysis'];
      break;
    case 'silver':
      this.features = ['base_plan', 'stock_analysis', 'personal_finance'];
      break;
    case 'gold':
      this.features = [
        'base_plan', 
        'stock_analysis', 
        'sector_analysis', 
        'personal_finance',
        'api_integration_equity'
      ];
      break;
    case 'diamond':
      this.features = [
        'base_plan',
        'stock_analysis',
        'sector_analysis',
        'personal_finance',
        'api_integration_equity',
        'api_integration_fo',
        'api_integration_crypto'
      ];
      break;
    case 'admin':
      this.features = [
        'base_plan',
        'stock_analysis',
        'sector_analysis',
        'personal_finance',
        'api_integration_equity',
        'api_integration_fo',
        'api_integration_crypto'
      ];
      break;
    default:
      this.features = ['base_plan'];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);