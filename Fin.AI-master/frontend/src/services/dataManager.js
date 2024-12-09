// Data caching and integration service
import { fetchFundamentalsData, fetchFinInspectData } from './api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration
const dataCache = new Map();

export const DataManager = {
  // Cache management
  cache: {
    get: (key) => {
      const cached = dataCache.get(key);
      if (!cached) return null;
      
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
      if (isExpired) {
        dataCache.delete(key);
        return null;
      }
      
      return cached.data;
    },
    
    set: (key, data) => {
      dataCache.set(key, {
        data,
        timestamp: Date.now()
      });
    },
    
    clear: () => dataCache.clear()
  },

  // Data integration
  fetchCompanyData: async (companyName) => {
    const cacheKey = `company_${companyName.toLowerCase()}`;
    const cachedData = DataManager.cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const [fundamentals, finInspect, marketData, newsData] = await Promise.all([
        fetchFundamentalsData(companyName),
        fetchFinInspectData(companyName),
        DataManager.fetchMarketData(companyName),
        DataManager.fetchNewsData(companyName)
      ]);

      const integratedData = {
        fundamentals,
        finInspect,
        marketData,
        newsData,
        timestamp: Date.now()
      };

      DataManager.cache.set(cacheKey, integratedData);
      return integratedData;
    } catch (error) {
      console.error('Error fetching company data:', error);
      return null;
    }
  },

  // Market data integration
  fetchMarketData: async (companyName) => {
    const cacheKey = `market_${companyName.toLowerCase()}`;
    const cachedData = DataManager.cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      // TODO: Replace with your actual market data API endpoint
      const response = await fetch(`/api/market/${companyName}`);
      const data = await response.json();
      
      DataManager.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  },

  // News data integration
  fetchNewsData: async (companyName) => {
    const cacheKey = `news_${companyName.toLowerCase()}`;
    const cachedData = DataManager.cache.get(cacheKey);
    
    if (cachedData) return cachedData;

    try {
      // TODO: Replace with your actual news API endpoint
      const response = await fetch(`/api/news/${companyName}`);
      const data = await response.json();
      
      DataManager.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching news data:', error);
      return null;
    }
  }
}; 