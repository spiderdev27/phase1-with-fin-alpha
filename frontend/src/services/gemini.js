import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataManager } from './dataManager';
import { fetchFundamentalsData, fetchFinInspectData } from './api';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Function to extract company name using Gemini
async function extractCompanyName(query) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Extract the company name from this query: "${query}". 
    Return ONLY the company name, nothing else. If no company name is found, return null.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const companyName = response.text().trim();
    
    console.log('Extracted company name:', companyName);
    return companyName === 'null' ? null : companyName;
  } catch (error) {
    console.error('Error extracting company name:', error);
    return null;
  }
}

// Function to analyze financial data
async function analyzeFinancialData(query, fundamentalsData, screenerData, yahooData, finInspectData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Prepare data summary for analysis
    const dataSummary = {
      fundamentals: {
        financialRatios: fundamentalsData.financialRatios || {},
        keyMetrics: fundamentalsData.keyMetrics || {},
        historicalData: fundamentalsData.historicalData || [],
        quarterlyResults: fundamentalsData.quarterlyResults || [],
        segmentData: fundamentalsData.segmentData || {}
      },
      screener: screenerData || {},
      market: yahooData || {},
      technical: {
        indicators: finInspectData?.technicalIndicators || {},
        sentiment: finInspectData?.marketSentiment || {},
        stockData: finInspectData?.stockData || {},
        news: finInspectData?.newsAnalysis || {},
        peerComparison: finInspectData?.peerComparison || {},
        industryAnalysis: finInspectData?.industryAnalysis || {}
      }
    };

    const analysisPrompt = `As a financial analyst, analyze this data in the context of: "${query}"

    Available Data:
    ${JSON.stringify(dataSummary, null, 2)}

    Provide a comprehensive analysis focusing on:
    1. Direct answer to the user's query
    2. Supporting data points
    3. Key insights from both fundamental and technical analysis
    4. Market sentiment and institutional activity
    5. Technical indicators and price action
    6. News impact and peer comparison
    7. Risks and opportunities
    8. Forward-looking statements

    Return the analysis in this exact JSON format:
    {
      "analysis": {
        "summary": "Brief but comprehensive answer to the query",
        "company": "${dataSummary.fundamentals.keyMetrics.companyName || 'Company'}",
        "confidence": 85,
        "details": {
          "mainPoints": [
            "Point about financial performance with specific metrics",
            "Point about technical analysis and price action",
            "Point about market sentiment and institutional activity",
            "Point about peer comparison and industry position",
            "Point about risks and opportunities"
          ],
          "sections": {
            "performance": "Detailed performance analysis with numbers",
            "technical": "Technical analysis including indicators and price action",
            "sentiment": "Market sentiment and institutional activity analysis",
            "developments": "Recent developments and news impact",
            "outlook": "Future outlook considering both fundamental and technical factors"
          },
          "metrics": {
            "fundamental": {
              "revenue": "${dataSummary.fundamentals.quarterlyResults[0]?.revenue || 'N/A'}",
              "profit": "${dataSummary.fundamentals.quarterlyResults[0]?.profit || 'N/A'}",
              "growth": "${dataSummary.fundamentals.quarterlyResults[0]?.growth || 'N/A'}",
              "pe_ratio": "${dataSummary.fundamentals.financialRatios.pe || 'N/A'}",
              "market_cap": "${dataSummary.fundamentals.keyMetrics.marketCap || 'N/A'}"
            },
            "technical": {
              "macd": "${dataSummary.technical.indicators.macdSignal || 'N/A'}",
              "rsi": "${dataSummary.technical.indicators.momentum?.rsi || 'N/A'}",
              "volume_trend": "${dataSummary.technical.stockData.volumeAnalysis?.volumeTrend || 'N/A'}",
              "delivery_percentage": "${dataSummary.technical.stockData.volumeAnalysis?.deliveryData?.average || 'N/A'}"
            },
            "sentiment": {
              "institutional_activity": "${dataSummary.technical.sentiment.institutionalActivity?.recentActivity || 'N/A'}",
              "fii_holding": "${dataSummary.technical.sentiment.institutionalActivity?.fiiHolding || 'N/A'}",
              "sentiment_score": "${dataSummary.technical.news.sentimentScore || 'N/A'}"
            }
          }
        }
      }
    }`;

    const result = await model.generateContent(analysisPrompt);
    const response = result.response.text();
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('JSON parsing error:', error);
      // Return a structured error response instead of throwing
      return {
        analysis: {
          summary: "Unable to process the analysis due to technical issues.",
          company: query,
          confidence: 0,
          details: {
            mainPoints: ["Technical error occurred while processing the data"],
            sections: {
              performance: "Data processing error",
              technical: "Data processing error",
              sentiment: "Data processing error",
              developments: "Data processing error",
              outlook: "Data processing error"
            },
            metrics: {
              fundamental: {},
              technical: {},
              sentiment: {}
            }
          }
        }
      };
    }
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    throw error;
  }
}

// Main function to generate financial analysis
export const generateFinancialAnalysis = async (query) => {
  try {
    // Step 1: Extract company name
    const companyName = await extractCompanyName(query);
    if (!companyName) {
      throw new Error('Company name not found in query');
    }

    // Step 2: Collect data from all sources in parallel
    const [
      fundamentalsData,
      { screenerData, yahooData },
      finInspectData
    ] = await Promise.all([
      fetchFundamentalsData(companyName),
      collectData(companyName),
      fetchFinInspectData(companyName)
    ]);

    // Step 3: Analyze the collected data
    const analysis = await analyzeFinancialData(
      query,
      fundamentalsData || {},
      screenerData || {},
      yahooData || {},
      finInspectData || {}
    );

    // Add disclaimer for investment advice
    if (query.toLowerCase().includes('invest')) {
      if (!analysis.analysis.details.mainPoints) {
        analysis.analysis.details.mainPoints = [];
      }
      analysis.analysis.details.mainPoints.push(
        "Disclaimer: This analysis is for informational purposes only and should not be considered as financial advice. Please consult with a qualified financial advisor before making investment decisions."
      );
    }

    return analysis;
  } catch (error) {
    console.error('Error in generateFinancialAnalysis:', error);
    // Return a structured error response
    return {
      analysis: {
        summary: "An error occurred while analyzing the data.",
        company: query,
        confidence: 0,
        details: {
          mainPoints: [
            "Error: " + error.message,
            "Please try again or contact support if the issue persists."
          ],
          sections: {
            performance: "Error occurred",
            technical: "Error occurred",
            sentiment: "Error occurred",
            developments: "Error occurred",
            outlook: "Error occurred"
          },
          metrics: {
            fundamental: {},
            technical: {},
            sentiment: {}
          }
        }
      }
    };
  }
};

// Function to collect data
async function collectData(symbol) {
  try {
    const [screenerData, yahooData] = await Promise.all([
      DataManager.fetchScreenerData(symbol),
      DataManager.fetchYahooFinanceData(symbol)
    ]);

    return {
      screenerData: screenerData || {},
      yahooData: yahooData || {}
    };
  } catch (error) {
    console.error('Error collecting data:', error);
    return {
      screenerData: {},
      yahooData: {}
    };
  }
}

export const generateAIResponse = generateFinancialAnalysis;
  