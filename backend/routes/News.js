const axios = require('axios');
const cheerio = require('cheerio');

async function getNewsData() {
  const NEWS_URL = 'https://economictimes.indiatimes.com/news/economy/finance';
  try {
    const response = await axios.get(NEWS_URL);
    const $ = cheerio.load(response.data);
    const newsItems = [];

    // Extract news items from the page
    $('.eachStory').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const url = 'https://economictimes.indiatimes.com' + $(element).find('a').attr('href');
      if (title && url) {
        newsItems.push({ name: title, url: url });
      }
    });

    return { newsItems };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

module.exports = { getNewsData };