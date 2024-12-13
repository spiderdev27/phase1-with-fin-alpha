const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./database/db');
const { getNewsData } = require('./routes/News');
const dashboardRoutes = require('./routes/dashboard');
const marketDataRoutes = require('./routes/marketData');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware before other middlewares
app.use(cors(corsOptions));

// Pre-flight requests
app.options('*', cors(corsOptions));

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Credentials');
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const fundamentalsRoutes = require('./routes/Fundamentals');
const finspectRoutes = require('./routes/Finspect');
const personalFinanceRoutes = require('./routes/personalfinance');
const subscriptionRoutes = require('./routes/subscription');

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/fundamentals', fundamentalsRoutes);
app.use('/api/finspect', finspectRoutes);
app.use('/api/personal-finance', personalFinanceRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/market', marketDataRoutes);
app.use('/api/dashboard', dashboardRoutes);

// News data route
app.get('/api/news', async (req, res) => {
  try {
    const newsData = await getNewsData();
    res.json(newsData);
  } catch (error) {
    console.error('Error in /api/news route:', error);
    res.status(500).json({ error: 'An error occurred while fetching news data' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Fin.AI API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;