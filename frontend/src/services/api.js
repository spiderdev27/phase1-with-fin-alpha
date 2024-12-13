// API endpoints and data fetching logic
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Mock data for FinInspect
const mockFinInspectData = {
  TCS: {
    technicalIndicators: {
      macdSignal: "Bullish",
      rsiTrend: "Neutral",
      volumeProfile: "Above Average",
      movingAverages: {
        sma20: 3580.45,
        sma50: 3495.20,
        sma200: 3320.75,
        trend: "Upward"
      },
      momentum: {
        rsi: 62.5,
        stochastic: 75.8,
        williamsR: -25.4
      }
    },
    marketSentiment: {
      institutionalActivity: {
        fiiHolding: "35.2%",
        diiHolding: "28.4%",
        recentActivity: "Net Buyers"
      },
      retailSentiment: {
        retailHolding: "8.5%",
        tradingVolume: "Above Average",
        deliveryPercentage: "65.2%"
      }
    },
    stockData: {
      priceAction: {
        currentPrice: 3575.40,
        dayChange: 45.60,
        dayChangePercent: 1.29,
        weeklyRange: {
          high: 3650.75,
          low: 3480.25
        }
      },
      volumeAnalysis: {
        averageVolume: "2.5M",
        volumeTrend: "Increasing",
        deliveryData: {
          average: "65%",
          trend: "Stable"
        }
      },
      technicalLevels: {
        support: [3450, 3380, 3320],
        resistance: [3620, 3680, 3750],
        pivotPoint: 3550
      }
    },
    newsAnalysis: {
      sentimentScore: 75,
      impactAnalysis: "Positive",
      recentNews: [
        {
          headline: "TCS Wins Major Cloud Deal",
          sentiment: "Positive",
          impact: "High"
        },
        {
          headline: "Q4 Results Beat Estimates",
          sentiment: "Positive",
          impact: "Medium"
        }
      ]
    },
    peerComparison: {
      peRatio: {
        company: 28.5,
        industryAvg: 25.8,
        analysis: "Premium valuation justified by market leadership"
      },
      marketShare: {
        company: "32%",
        nextCompetitor: "24%",
        analysis: "Market leader with strong moat"
      }
    },
    industryAnalysis: {
      sectorOutlook: "Positive",
      growthPotential: "High",
      challenges: ["Global economic slowdown", "Margin pressure"],
      opportunities: ["Digital transformation", "Cloud adoption"]
    }
  }
};

// Mock data for fundamentals
const mockFundamentalsData = {
  TCS: {
    financialRatios: {
      pe: 28.5,
      pb: 3.8,
      roe: 25.4,
      debtToEquity: 0.12,
      currentRatio: 2.1,
      quickRatio: 1.8
    },
    keyMetrics: {
      marketCap: "₹13,45,678 Cr",
      bookValue: "₹245.6",
      dividendYield: 3.2,
      eps: "₹95.2",
      freeCashFlow: "₹42,500 Cr"
    },
    historicalData: [
      {
        period: "Q4 2023",
        revenue: "₹59,162 Cr",
        profit: "₹11,392 Cr",
        growth: "14.8%"
      },
      {
        period: "Q3 2023",
        revenue: "₹58,229 Cr",
        profit: "₹11,058 Cr",
        growth: "13.5%"
      }
    ],
    quarterlyResults: [
      {
        quarter: "Q4 2023",
        highlights: "Strong growth in North America, robust deal pipeline, digital transformation initiatives"
      }
    ],
    segmentData: {
      geographic: {
        "North America": "51%",
        "Europe": "28%",
        "India": "12%",
        "Others": "9%"
      },
      vertical: {
        "BFSI": "35%",
        "Retail": "25%",
        "Manufacturing": "20%",
        "Others": "20%"
      }
    }
  }
};

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
    // For now, use mock data instead of actual API call
    const mockData = mockFundamentalsData[companyName.toUpperCase()];
    if (!mockData) {
      // If no mock data exists for the company, generate some random data
      return {
        financialRatios: {
          pe: (Math.random() * 30 + 15).toFixed(1),
          pb: (Math.random() * 5 + 1).toFixed(1),
          roe: (Math.random() * 25 + 10).toFixed(1),
          debtToEquity: (Math.random() * 1).toFixed(2),
          currentRatio: (Math.random() * 2 + 1).toFixed(1),
          quickRatio: (Math.random() * 1.5 + 0.5).toFixed(1)
        },
        keyMetrics: {
          marketCap: `₹${(Math.random() * 1000000 + 100000).toFixed(0)} Cr`,
          bookValue: `₹${(Math.random() * 500 + 100).toFixed(1)}`,
          dividendYield: (Math.random() * 5 + 1).toFixed(1),
          eps: `₹${(Math.random() * 100 + 20).toFixed(1)}`,
          freeCashFlow: `₹${(Math.random() * 50000 + 10000).toFixed(0)} Cr`
        },
        historicalData: [
          {
            period: "Latest Quarter",
            revenue: `₹${(Math.random() * 50000 + 10000).toFixed(0)} Cr`,
            profit: `₹${(Math.random() * 10000 + 1000).toFixed(0)} Cr`,
            growth: `${(Math.random() * 20 + 5).toFixed(1)}%`
          }
        ],
        quarterlyResults: [
          {
            quarter: "Latest Quarter",
            highlights: "Steady performance with focus on operational efficiency and market expansion"
          }
        ],
        segmentData: {
          geographic: {
            "Domestic": "60%",
            "International": "40%"
          },
          vertical: {
            "Core Business": "70%",
            "New Initiatives": "30%"
          }
        }
      };
    }
    return mockData;
  } catch (error) {
    handleApiError(error, 'fundamentals');
  }
};

export const fetchFinInspectData = async (companyName) => {
  try {
    // For now, use mock data instead of actual API call
    const mockData = mockFinInspectData[companyName.toUpperCase()];
    if (!mockData) {
      // If no mock data exists for the company, generate some random data
      return {
        technicalIndicators: {
          macdSignal: Math.random() > 0.5 ? "Bullish" : "Bearish",
          rsiTrend: ["Overbought", "Neutral", "Oversold"][Math.floor(Math.random() * 3)],
          volumeProfile: ["High", "Average", "Low"][Math.floor(Math.random() * 3)],
          movingAverages: {
            sma20: (Math.random() * 1000 + 2000).toFixed(2),
            sma50: (Math.random() * 1000 + 2000).toFixed(2),
            sma200: (Math.random() * 1000 + 2000).toFixed(2),
            trend: Math.random() > 0.5 ? "Upward" : "Downward"
          },
          momentum: {
            rsi: (Math.random() * 100).toFixed(1),
            stochastic: (Math.random() * 100).toFixed(1),
            williamsR: (-Math.random() * 100).toFixed(1)
          }
        },
        marketSentiment: {
          institutionalActivity: {
            fiiHolding: `${(Math.random() * 40 + 10).toFixed(1)}%`,
            diiHolding: `${(Math.random() * 30 + 10).toFixed(1)}%`,
            recentActivity: Math.random() > 0.5 ? "Net Buyers" : "Net Sellers"
          },
          retailSentiment: {
            retailHolding: `${(Math.random() * 15 + 5).toFixed(1)}%`,
            tradingVolume: ["High", "Average", "Low"][Math.floor(Math.random() * 3)],
            deliveryPercentage: `${(Math.random() * 40 + 40).toFixed(1)}%`
          }
        },
        stockData: {
          priceAction: {
            currentPrice: (Math.random() * 2000 + 1000).toFixed(2),
            dayChange: (Math.random() * 40 - 20).toFixed(2),
            dayChangePercent: (Math.random() * 4 - 2).toFixed(2),
            weeklyRange: {
              high: (Math.random() * 2000 + 1200).toFixed(2),
              low: (Math.random() * 1000 + 800).toFixed(2)
            }
          },
          volumeAnalysis: {
            averageVolume: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
            volumeTrend: Math.random() > 0.5 ? "Increasing" : "Decreasing",
            deliveryData: {
              average: `${(Math.random() * 30 + 50).toFixed(1)}%`,
              trend: ["Increasing", "Stable", "Decreasing"][Math.floor(Math.random() * 3)]
            }
          }
        },
        newsAnalysis: {
          sentimentScore: Math.floor(Math.random() * 100),
          impactAnalysis: ["Positive", "Neutral", "Negative"][Math.floor(Math.random() * 3)]
        },
        peerComparison: {
          peRatio: {
            company: (Math.random() * 30 + 15).toFixed(1),
            industryAvg: (Math.random() * 30 + 15).toFixed(1)
          },
          marketShare: {
            company: `${(Math.random() * 30 + 10).toFixed(1)}%`,
            nextCompetitor: `${(Math.random() * 20 + 5).toFixed(1)}%`
          }
        },
        industryAnalysis: {
          sectorOutlook: Math.random() > 0.5 ? "Positive" : "Neutral",
          growthPotential: Math.random() > 0.5 ? "High" : "Moderate"
        }
      };
    }
    return mockData;
  } catch (error) {
    console.error('Error fetching FinInspect data:', error);
    return null;
  }
}; 