const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware');

// Apply authentication check middleware to all routes
router.use(authMiddleware);

// Stock evaluation functions
function evaluateStock(stockData) {
    const scores = {
        financial_health: evaluateFinancialHealth(stockData),
        profitability: evaluateProfitability(stockData),
        valuation: evaluateValuation(stockData),
        growth: evaluateGrowth(stockData),
        algorithmic: evaluateAlgorithmic(stockData),
        value_investing: evaluateValueInvesting(stockData),
        growth_investing: evaluateGrowthInvesting(stockData),
        dividend_investing: evaluateDividendInvesting(stockData),
        momentum_investing: evaluateMomentumInvesting(stockData)
    };
    
    const validScores = Object.values(scores).filter(score => score !== null);
    const overallScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : null;
    const evaluation = getEvaluation(overallScore);
    
    return {
        scores,
        overall_score: overallScore,
        evaluation
    };
}

function evaluateFinancialHealth(data) {
    const debtEquity = scoreMetric(data['Debt to equity'] || 0, 1, "lower");
    const currentRatio = scoreMetric(data['Current ratio'] || 0, 1.5, "higher");
    const roce = scoreMetric(data['ROCE'] || 0, 15, "higher");
    return (debtEquity + currentRatio + roce) / 3;
}

function evaluateProfitability(data) {
    const roe = scoreMetric(data['ROE'] || 0, 15, "higher");
    const roce = scoreMetric(data['ROCE'] || 0, 15, "higher");
    return (roe + roce) / 2;
}

function evaluateValuation(data) {
    const pe = scoreMetric(data['Stock P/E'] || 0, 20, "lower");
    const pb = scoreMetric(data['Current Price'] / (data['Book Value'] || 1), 3, "lower");
    return (pe + pb) / 2;
}

function evaluateGrowth(data) {
    const salesGrowth = scoreMetric(data['Sales growth 3Years'] || 0, 10, "higher");
    const profitGrowth = scoreMetric(data['Profit growth 3Years'] || 0, 15, "higher");
    return (salesGrowth + profitGrowth) / 2;
}

function evaluateAlgorithmic(data) {
    const currentPrice = data['Current Price'] || 0;
    const weekHigh = data['52 Week High'] || 0;
    const weekLow = data['52 Week Low'] || 0;
    
    if (weekHigh === null || weekLow === null) return null;
    
    const trendScore = (currentPrice - weekLow) / (weekHigh - weekLow);
    const volatilityScore = 1 - ((weekHigh - weekLow) / currentPrice);
    
    return (trendScore + volatilityScore) / 2;
}

function evaluateValueInvesting(data) {
    const pe = scoreMetric(data['Stock P/E'] || 0, 15, "lower");
    const pb = scoreMetric(data['Current Price'] / (data['Book Value'] || 1), 1.5, "lower");
    const divYield = scoreMetric(data['Dividend Yield'] || 0, 3, "higher");
    const roe = scoreMetric(data['ROE'] || 0, 15, "higher");
    
    return (pe + pb + divYield + roe) / 4;
}

function evaluateGrowthInvesting(data) {
    const salesGrowth = scoreMetric(data['Sales growth 3Years'] || 0, 15, "higher");
    const profitGrowth = scoreMetric(data['Profit growth 3Years'] || 0, 20, "higher");
    const roe = scoreMetric(data['ROE'] || 0, 20, "higher");
    const peToGrowth = scoreMetric((data['Stock P/E'] || 0) / (data['Profit growth 3Years'] || 1), 1, "lower");
    
    return (salesGrowth + profitGrowth + roe + peToGrowth) / 4;
}

function evaluateDividendInvesting(data) {
    const divYield = scoreMetric(data['Dividend Yield'] || 0, 4, "higher");
    const roe = scoreMetric(data['ROE'] || 0, 15, "higher");
    const payoutRatio = scoreMetric(data['Dividend Payout Ratio'] || 0, 60, "lower");
    const debtEquity = scoreMetric(data['Debt to equity'] || 0, 1, "lower");
    
    return (divYield + roe + payoutRatio + debtEquity) / 4;
}

function evaluateMomentumInvesting(data) {
    const currentPrice = data['Current Price'] || 0;
    const weekHigh = data['52 Week High'] || 0;
    const weekLow = data['52 Week Low'] || 0;
    
    if (weekHigh === null || weekLow === null) return null;
    
    const momentum = scoreMetric((currentPrice - weekLow) / (weekHigh - weekLow), 0.8, "higher");
    const volatility = scoreMetric(1 - ((weekHigh - weekLow) / currentPrice), 0.5, "higher");
    
    return (momentum + volatility) / 2;
}

function scoreMetric(value, threshold, direction) {
    if (isNaN(value) || value === null) return null;
    if (direction === "higher") {
        return Math.min(value / threshold, 1);
    } else {  // direction === "lower"
        return Math.min(threshold / value, 1);
    }
}

function getEvaluation(score) {
    if (score === null) return "Insufficient data";
    if (score >= 0.8) return "Excellent";
    if (score >= 0.6) return "Good";
    if (score >= 0.4) return "Average";
    if (score >= 0.2) return "Below Average";
    return "Poor";
}

async function scrapeCompanyData(companyCode) {
  const url = `https://www.screener.in/company/${companyCode}/consolidated/`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const companyData = {};

    // Extract company name
    companyData.name = $('h1').text().trim();
    if (!companyData.name) {
      console.log('Failed to extract company name');
    }

    // Extract ratios
    const ratios = $('.company-ratios #top-ratios li');
    if (ratios.length === 0) {
      console.log('No ratios found');
    }

    ratios.each((index, element) => {
      const name = $(element).find('.name').text().trim();
      let value = $(element).find('.value').text().trim();

      if (!name || !value) {
        console.log(`Failed to extract ratio at index ${index}`);
        return; // Skip this iteration
      }

      value = value.replace('₹', '').replace(',', '').trim();

      if (name === "High / Low") {
        const [high, low] = value.split('/');
        companyData["52 Week High"] = parseFloat(high.trim());
        companyData["52 Week Low"] = parseFloat(low.trim());
      } else if (value.includes('%')) {
        companyData[name] = parseFloat(value.replace('%', ''));
      } else if (value.includes('Cr.')) {
        companyData[name] = parseFloat(value.replace('Cr.', '')) * 10000000;
      } else {
        companyData[name] = isNaN(parseFloat(value)) ? value : parseFloat(value);
      }
    });

    // Extract additional data required for evaluation
    companyData['Sales growth 3Years'] = parseFloat($('td:contains("Sales growth (3Yrs)")').next().text().replace('%', '')) || 0;
    companyData['Profit growth 3Years'] = parseFloat($('td:contains("Profit growth (3Yrs)")').next().text().replace('%', '')) || 0;
    companyData['Dividend Payout Ratio'] = parseFloat($('td:contains("Dividend Payout Ratio")').next().text().replace('%', '')) || 0;

    if (Object.keys(companyData).length === 0) {
      throw new Error('No data could be extracted from the page');
    }

    companyData.balanceSheet = scrapeBalanceSheet($);
    companyData.ratios = scrapeRatios($);
    companyData.quarterlyResults = scrapeQuarterlyResults($);
    

    return companyData;
  } catch (error) {
    console.error('Error scraping company data:', error);
    throw error;
  }
}

function scrapeBalanceSheet($) {
  const balanceSheet = {};
  const table = $('#balance-sheet table.data-table');
  
  table.find('tr').each((index, row) => {
    const cells = $(row).find('td, th');
    const metric = $(cells[0]).text().trim();
    
    if (metric && metric !== 'Particulars') {
      balanceSheet[metric] = {};
      cells.slice(1).each((i, cell) => {
        const year = table.find('th').eq(i + 1).text().trim();
        const value = $(cell).text().trim();
        balanceSheet[metric][year] = parseFloat(value.replace(/,/g, '')) || value;
      });
    }
  });

  return balanceSheet;
}

function scrapeRatios($) {
  const ratios = {};
  const table = $('#ratios table.data-table');
  
  table.find('tr').each((index, row) => {
    const cells = $(row).find('td, th');
    const metric = $(cells[0]).text().trim();
    
    if (metric && metric !== 'Particulars') {
      ratios[metric] = {};
      cells.slice(1).each((i, cell) => {
        const year = table.find('th').eq(i + 1).text().trim();
        const value = $(cell).text().trim();
        ratios[metric][year] = parseFloat(value.replace('%', '')) || value;
      });
    }
  });


  return ratios;
}

function scrapeQuarterlyResults($) {
  const quarterlyResults = {};
  const table = $('#quarters table.data-table');
  
  table.find('tr').each((index, row) => {
    const cells = $(row).find('td, th');
    const metric = $(cells[0]).text().trim();
    
    if (metric && metric !== 'Particulars') {
      quarterlyResults[metric] = {};
      cells.slice(1).each((i, cell) => {
        const quarter = table.find('th').eq(i + 1).text().trim();
        const value = $(cell).text().trim();
        quarterlyResults[metric][quarter] = parseFloat(value.replace(/,/g, '')) || value;
      });
    }
  });

  return quarterlyResults;
}

// Search route - open to all authenticated users
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const ticker = req.query.ticker;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker symbol is required' });
    }

    const data = await scrapeCompanyData(ticker);
    const evaluation = evaluateStock(data);
    res.json({ ...data, evaluation });
  } catch (error) {
    console.error('Error in search route:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

router.get('/stocks', async (req, res) => {
  try {
    const mockStockData = [
      { 'S.No': '1', 'Name': 'HDFC Bank', 'CMP': '1500', 'P/E': '20', 'Mar Cap': '800000', 'Div Yld': '1.2' },
      { 'S.No': '2', 'Name': 'Reliance Industries', 'CMP': '2000', 'P/E': '25', 'Mar Cap': '1200000', 'Div Yld': '0.8' },
    ];

    res.json(mockStockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      details: error.message
    });
  }
});

module.exports = router;