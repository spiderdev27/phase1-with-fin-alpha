// API endpoints and data fetching logic
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Add API error handling
const handleApiError = (error, endpoint) => {
  console.error(`Error fetching ${endpoint}:`, error);
  if (error.response) {
    throw new Error(`API Error (${error.response.status}): ${error.response.statusText}`);
  }
  throw new Error(`Network error while fetching ${endpoint}`);
};

export const fetchFundamentalsData = async (companyName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fundamentals/${encodeURIComponent(companyName)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate required data fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format received from API');
    }

    return {
      financialRatios: {
        pe: data.pe ?? null,
        pb: data.pb ?? null,
        roe: data.roe ?? null,
        debtToEquity: data.debtToEquity ?? null,
        currentRatio: data.currentRatio ?? null,
        quickRatio: data.quickRatio ?? null
      },
      keyMetrics: {
        marketCap: data.marketCap ?? null,
        bookValue: data.bookValue ?? null,
        dividendYield: data.dividendYield ?? null,
        eps: data.eps ?? null,
        freeCashFlow: data.freeCashFlow ?? null
      },
      historicalData: data.historicalData ?? [],
      quarterlyResults: data.quarterlyResults ?? [],
      segmentData: data.segmentData ?? {}
    };
  } catch (error) {
    handleApiError(error, 'fundamentals');
  }
};

export const fetchFinInspectData = async (companyName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/finInspect/${companyName}`);
    const data = await response.json();
    
    return {
      technicalIndicators: {
        ...data.technicalIndicators,
        macdSignal: data.technicalIndicators?.macdSignal,
        rsiTrend: data.technicalIndicators?.rsiTrend,
        volumeProfile: data.technicalIndicators?.volumeProfile
      },
      marketSentiment: {
        ...data.marketSentiment,
        institutionalActivity: data.marketSentiment?.institutionalActivity,
        retailSentiment: data.marketSentiment?.retailSentiment
      },
      newsAnalysis: {
        ...data.newsAnalysis,
        sentimentScore: data.newsAnalysis?.sentimentScore,
        impactAnalysis: data.newsAnalysis?.impactAnalysis
      },
      peerComparison: data.peerComparison,
      industryAnalysis: data.industryAnalysis
    };
  } catch (error) {
    console.error('Error fetching FinInspect data:', error);
    return null;
  }
}; 