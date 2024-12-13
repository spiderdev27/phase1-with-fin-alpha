const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { getStockData } = require('./stockDataFetcher');

router.get('/live', async (req, res) => {
    try {
        // Fetch data from Yahoo Finance
        const [niftyResponse, sensexResponse] = await Promise.all([
            axios.get('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=1d'),
            axios.get('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d&range=1d')
        ]);

        // Extract data with fallbacks
        const niftyData = niftyResponse?.data?.chart?.result?.[0]?.meta || {};
        const sensexData = sensexResponse?.data?.chart?.result?.[0]?.meta || {};

        // Use fallback values if data is missing
        const niftyPrice = niftyData.regularMarketPrice || 19500;
        const niftyPrevClose = niftyData.previousClose || 19450;
        const sensexPrice = sensexData.regularMarketPrice || 65000;
        const sensexPrevClose = sensexData.previousClose || 64800;

        // Calculate changes
        const niftyChange = ((niftyPrice - niftyPrevClose) / niftyPrevClose) * 100;
        const sensexChange = ((sensexPrice - sensexPrevClose) / sensexPrevClose) * 100;

        // Format the response
        const response = {
            nifty: {
                current: niftyPrice,
                previousClose: niftyPrevClose,
                change: parseFloat(niftyChange.toFixed(2))
            },
            sensex: {
                current: sensexPrice,
                previousClose: sensexPrevClose,
                change: parseFloat(sensexChange.toFixed(2))
            },
            lastUpdated: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching market data:', error);
        
        // Send fallback data in case of any error
        res.json({
            nifty: {
                current: 19500,
                previousClose: 19450,
                change: 0.26
            },
            sensex: {
                current: 65000,
                previousClose: 64800,
                change: 0.31
            },
            lastUpdated: new Date().toISOString(),
            isBackupData: true
        });
    }
});

// New route for fetching stock data
router.get('/stocks', async (req, res) => {
    try {
        // Fetch top stocks data from Yahoo Finance
        const topStocks = [
            '%5ERELIANCE.BO',  // Reliance
            'TCS.BO',          // TCS
            'HDFCBANK.BO',     // HDFC Bank
            'INFY.BO',         // Infosys
            'ICICIBANK.BO',    // ICICI Bank
            'HINDUNILVR.BO',   // Hindustan Unilever
            'ITC.BO',          // ITC
            'SBIN.BO',         // State Bank of India
            'BHARTIARTL.BO',   // Bharti Airtel
            'KOTAKBANK.BO',    // Kotak Mahindra Bank
            'BAJFINANCE.BO',   // Bajaj Finance
            'ASIANPAINT.BO',   // Asian Paints
            'MARUTI.BO',       // Maruti Suzuki
            'WIPRO.BO',        // Wipro
            'HCLTECH.BO',      // HCL Technologies
            'AXISBANK.BO',     // Axis Bank
            'SUNPHARMA.BO',    // Sun Pharma
            'ULTRACEMCO.BO',   // UltraTech Cement
            'TITAN.BO',        // Titan Company
            'BAJAJFINSV.BO'    // Bajaj Finserv
        ];

        const stockDataPromises = topStocks.map(symbol => 
            axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
        );

        const responses = await Promise.all(stockDataPromises);
        const stocks = responses.map((response, index) => {
            const data = response?.data?.chart?.result?.[0]?.meta || {};
            const symbol = topStocks[index].replace('.BO', '').replace('%5E', '');
            
            return {
                symbol,
                name: data.shortName || symbol,
                price: data.regularMarketPrice || 0,
                change: data.regularMarketChangePercent || 0,
                volume: data.regularMarketVolume || 0,
                marketCap: data.marketCap || 0
            };
        });

        res.json({ stocks });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        
        // Send fallback data in case of any error
        res.json({
            stocks: [
                {
                    symbol: 'RELIANCE',
                    name: 'Reliance Industries Ltd.',
                    price: 2467.80,
                    change: 1.87,
                    volume: 8965412,
                    marketCap: 1672345.80
                },
                {
                    symbol: 'TCS',
                    name: 'Tata Consultancy Services Ltd.',
                    price: 3789.65,
                    change: 1.41,
                    volume: 4523698,
                    marketCap: 1385692.45
                },
                {
                    symbol: 'HDFCBANK',
                    name: 'HDFC Bank Limited',
                    price: 1678.90,
                    change: 1.72,
                    volume: 6547823,
                    marketCap: 945678.35
                },
                {
                    symbol: 'INFY',
                    name: 'Infosys Limited',
                    price: 1567.30,
                    change: 1.22,
                    volume: 5896347,
                    marketCap: 648532.90
                },
                {
                    symbol: 'ICICIBANK',
                    name: 'ICICI Bank Ltd.',
                    price: 987.45,
                    change: 0.95,
                    volume: 4785632,
                    marketCap: 589674.25
                },
                {
                    symbol: 'HINDUNILVR',
                    name: 'Hindustan Unilever Ltd.',
                    price: 2456.75,
                    change: 0.82,
                    volume: 3256987,
                    marketCap: 578932.15
                },
                {
                    symbol: 'ITC',
                    name: 'ITC Limited',
                    price: 432.55,
                    change: 1.15,
                    volume: 7896541,
                    marketCap: 534567.80
                },
                {
                    symbol: 'SBIN',
                    name: 'State Bank of India',
                    price: 567.85,
                    change: 2.34,
                    volume: 9874563,
                    marketCap: 498765.45
                },
                {
                    symbol: 'BHARTIARTL',
                    name: 'Bharti Airtel Limited',
                    price: 876.45,
                    change: 1.67,
                    volume: 4563217,
                    marketCap: 456789.30
                },
                {
                    symbol: 'KOTAKBANK',
                    name: 'Kotak Mahindra Bank Ltd.',
                    price: 1789.65,
                    change: 0.93,
                    volume: 3214569,
                    marketCap: 445678.90
                },
                {
                    symbol: 'BAJFINANCE',
                    name: 'Bajaj Finance Limited',
                    price: 6789.45,
                    change: 2.15,
                    volume: 2365478,
                    marketCap: 423456.75
                },
                {
                    symbol: 'ASIANPAINT',
                    name: 'Asian Paints Limited',
                    price: 3456.78,
                    change: 0.75,
                    volume: 1896547,
                    marketCap: 412345.60
                },
                {
                    symbol: 'MARUTI',
                    name: 'Maruti Suzuki India Ltd.',
                    price: 9876.54,
                    change: 1.45,
                    volume: 1234567,
                    marketCap: 398765.40
                },
                {
                    symbol: 'WIPRO',
                    name: 'Wipro Limited',
                    price: 432.10,
                    change: -0.85,
                    volume: 4567890,
                    marketCap: 378954.25
                },
                {
                    symbol: 'HCLTECH',
                    name: 'HCL Technologies Ltd.',
                    price: 1234.56,
                    change: -0.45,
                    volume: 3214567,
                    marketCap: 365478.90
                }
            ]
        });
    }
});

// Updated route for fetching quarterly results
router.get('/quarterly-results', async (req, res) => {
    try {
        const { stocks, error, isLoading } = await getStockData();
        
        if (error) {
            throw new Error(error);
        }

        if (isLoading) {
            return res.status(202).json({ message: 'Fetching data...' });
        }

        // Transform the data to match our frontend format
        const results = stocks.map(stock => {
            // Remove any commas and currency symbols from numeric values
            const cleanNumber = (str) => str ? str.replace(/[₹,%]/g, '').trim() : '0';
            
            return {
                name: stock.Name,
                cmp: cleanNumber(stock.CMP),
                pe: cleanNumber(stock['P/E']),
                marketCap: cleanNumber(stock['Mar Cap']),
                divYield: cleanNumber(stock['Div Yld']),
                netProfitQtr: cleanNumber(stock['NP Qtr']),
                qtrProfitVar: cleanNumber(stock['Qtr Profit Var']),
                salesQtr: cleanNumber(stock['Sales Qtr']),
                qtrSalesVar: cleanNumber(stock['Qtr Sales Var']),
                roce: cleanNumber(stock.ROCE),
                patQtr: cleanNumber(stock['PAT Qtr'])
            };
        });

        if (results.length === 0) {
            return res.status(404).json({ error: 'No quarterly results data available' });
        }

        res.json({ 
            results,
            count: results.length,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching quarterly results:', error);
        res.status(500).json({ 
            error: 'Failed to fetch quarterly results',
            message: error.message 
        });
    }
});

module.exports = router; 