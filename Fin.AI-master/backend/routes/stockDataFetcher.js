const axios = require('axios');
const cheerio = require('cheerio');

async function fetchStockData(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`An error occurred while fetching the data: ${error}`);
    throw error;
  }
}

function extractStockData(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const stocksData = [];

  $('tr[data-row-company-id]').each((index, element) => {
    const cols = $(element).find('td');
    if (cols.length >= 12) {
      const stock = {
        'S.No': $(cols[0]).text().trim(),
        'Name': $(cols[1]).find('a').text().trim() || $(cols[1]).text().trim(),
        'CMP': $(cols[2]).text().trim(),
        'P/E': $(cols[3]).text().trim(),
        'Mar Cap': $(cols[4]).text().trim(),
        'Div Yld': $(cols[5]).text().trim(),
        'NP Qtr': $(cols[6]).text().trim(),
        'Qtr Profit Var': $(cols[7]).text().trim(),
        'Sales Qtr': $(cols[8]).text().trim(),
        'Qtr Sales Var': $(cols[9]).text().trim(),
        'ROCE': $(cols[10]).text().trim(),
        'PAT Qtr': $(cols[11]).text().trim()
      };
      stocksData.push(stock);
    }
  });

  return stocksData;
}

async function getStockData() {
  const url = "https://www.screener.in/screens/325075/all-latest-quarterly-results-date-wise/";
  console.log("Fetching data from the website...");

  let isLoading = true;
  let error = null;
  let stocks = [];

  try {
    const htmlContent = await fetchStockData(url);
    if (!htmlContent) {
      throw new Error("Failed to fetch data from the website.");
    }

    stocks = extractStockData(htmlContent);
    if (stocks.length === 0) {
      throw new Error("No stock data could be extracted. The HTML structure might have changed.");
    }

    console.log(`\nExtracted ${stocks.length} stocks`);
  } catch (err) {
    console.error('Error in getStockData:', err);
    error = err.message;
  } finally {
    isLoading = false;
  }

  return { isLoading, error, stocks };
}

module.exports = { getStockData };