const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./database/db');
const { getStockData } = require('./routes/stockDataFetcher');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const fundamentalsRoutes = require('./routes/Fundamentals');

app.use('/api/auth', authRoutes);
app.use('/api/fundamentals', fundamentalsRoutes);

// Stock data route
app.get('/api/stocks', async (req, res) => {
    try {
        const stocks = await getStockData();
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: error.message, stocks: [] });
    }
});

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Fin.AI API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;