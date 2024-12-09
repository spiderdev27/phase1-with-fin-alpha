import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataManager } from './dataManager';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Add conversation patterns helper
const conversationPatterns = {
  quarterlyResults: {
    positive: [
      "Great news about {company}'s latest quarter! They've seen {growth}% growth, reaching {revenue} in revenue.",
      "Looking at {company}'s Q{quarter} results, they're doing really well! Revenue hit {revenue}, up {growth}% from last year.",
      "{company} has knocked it out of the park this quarter! With {revenue} in revenue, they're up {growth}% year-over-year."
    ],
    negative: [
      "{company}'s had a challenging quarter. Revenue came in at {revenue}, down {growth}% compared to last year.",
      "This quarter's been tough for {company}. They saw a {growth}% decline, with revenue at {revenue}.",
      "The numbers for {company} this quarter show some headwinds. Revenue dropped to {revenue}, a {growth}% decrease."
    ],
    neutral: [
      "{company}'s latest results are mixed. While revenue reached {revenue}, growth was relatively flat at {growth}%.",
      "Looking at {company}'s Q{quarter}, they're holding steady. Revenue is at {revenue}, with {growth}% change year-over-year.",
      "{company}'s quarterly performance shows stability. They reported {revenue} in revenue, with {growth}% movement."
    ]
  },

  trends: {
    improving: [
      "I'm seeing a really interesting trend here - {metric} has been consistently improving over the last {period}.",
      "What catches my eye is the upward trend in {metric}. Over {period}, we've seen steady improvement.",
      "There's a clear positive pattern in {metric}. The numbers have been trending up for {period}."
    ],
    declining: [
      "I notice a concerning trend in {metric}. It's been declining over the past {period}.",
      "One thing to watch is {metric} - it's showing a downward trend over {period}.",
      "The numbers for {metric} have been softening. Over {period}, we've seen a consistent decline."
    ],
    volatile: [
      "{metric} has been quite volatile. We're seeing significant swings over {period}.",
      "There's notable volatility in {metric}. The numbers have been fluctuating throughout {period}.",
      "Looking at {metric}, it's been a bumpy ride over {period} with considerable ups and downs."
    ]
  },

  insights: {
    performance: [
      "What's particularly interesting is {insight}. This suggests {implication}.",
      "A key takeaway here is {insight}, which indicates {implication}.",
      "One thing that stands out is {insight}. This could mean {implication}."
    ],
    comparison: [
      "Compared to {competitor}, {company}'s {metric} is {comparison}. This shows {implication}.",
      "When we look at the industry, {company}'s {metric} {comparison} the sector average, indicating {implication}.",
      "In terms of {metric}, {company} {comparison} their peers, which suggests {implication}."
    ],
    outlook: [
      "Looking ahead, {insight} could mean {implication} for {company}.",
      "Based on these trends, we might expect {implication} in the coming quarters.",
      "These numbers suggest {insight}, which could lead to {implication}."
    ]
  },

  followUp: {
    performance: [
      "Would you like to know more about their {metric} performance?",
      "Shall we dive deeper into the {metric} numbers?",
      "Want to explore how their {metric} compares to competitors?"
    ],
    trends: [
      "Interested in seeing how this trend has developed over the past few quarters?",
      "Should we look at the historical pattern of {metric}?",
      "Would you like to see how this compares to previous periods?"
    ],
    implications: [
      "Want to explore what this means for their future growth?",
      "Shall we discuss how this might affect their market position?",
      "Would you like to understand the implications for their strategy?"
    ]
  }
};

// Add function to generate conversational response
const generateConversationalResponse = (data, type) => {
  const patterns = conversationPatterns[type];
  const sentiment = determineSentiment(data);
  const templates = patterns[sentiment];
  
  // Randomly select a template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Replace placeholders with actual data
  return template.replace(/{(\w+)}/g, (match, key) => data[key] || match);
};

// Add function to determine sentiment
const determineSentiment = (data) => {
  const metrics = {
    growth: parseFloat(data.growth) || 0,
    profitMargin: parseFloat(data.margin) || 0,
    performance: calculateOverallPerformance(data)
  };

  const score = calculateSentimentScore(metrics);
  
  for (const [sentiment, details] of Object.entries(sentimentPatterns)) {
    if (score > details.threshold) {
      return {
        type: sentiment,
        score: score,
        intensifiers: details.intensifiers,
        templates: details.templates
      };
    }
  }
  
  return {
    type: 'neutral',
    score: score,
    intensifiers: sentimentPatterns.neutral.intensifiers,
    templates: sentimentPatterns.neutral.templates
  };
};

// Update the generatePrompt function
const generatePrompt = (query) => {
  const isYoYQuery = /yoy|year.over.year|annual.growth/i.test(query);
  const isQuarterlyQuery = /quarter|q[1-4]|quarterly/i.test(query);
  
  let additionalInstructions = '';
  if (isYoYQuery) {
    additionalInstructions = `
Focus on year-over-year comparisons:
- Provide specific growth percentages
- Compare current numbers with previous year
- Highlight key changes in performance metrics
- Include both absolute values and growth rates`;
  } else if (isQuarterlyQuery) {
    additionalInstructions = `
Focus on quarterly performance:
- Provide specific quarterly numbers
- Compare with previous quarter and same quarter last year
- Break down key performance metrics
- Include quarter-over-quarter and year-over-year changes`;
  }

  return `Act as a friendly financial expert having a conversation. Respond directly to this query:
${query}

${additionalInstructions}

Guidelines:
1. Be conversational and natural
2. Focus on specific numbers and data points
3. Compare relevant time periods
4. Explain trends and changes
5. Provide context for the numbers

Response Format (in valid JSON):
{
  "conversation": {
    "mainResponse": "The friendly, conversational response",
    "metrics": {
      "revenue": "number with unit (e.g., ₹1,000 cr)",
      "growth": "number with % sign",
      "profit": "number with unit",
      "margin": "number with % sign",
      "timeframe": "specific period"
    },
    "trends": [
      {
        "metric": "specific metric name",
        "trend": "up/down/stable",
        "value": "number with unit",
        "period": "specific timeframe"
      }
    ],
    "insights": ["Key observations"],
    "followUpQuestions": ["Relevant follow-up questions"]
  }
}`;
};

// Add function to get context-specific instructions
const getContextSpecificInstructions = (query) => {
  const context = determineQueryContext(query);
  return contextSpecificPrompts[context] || contextSpecificPrompts.default;
};

// Add context determination
const determineQueryContext = (query) => {
  const contexts = {
    quarterlyResults: {
      patterns: [
        /quarter|results|earnings|revenue|profit/i,
        /financial performance|numbers|figures/i,
        /how.*doing|performance|report/i
      ],
      weight: 0
    },
    trends: {
      patterns: [
        /trend|growth|pattern|historical|movement/i,
        /over time|trajectory|direction/i,
        /how.*changed|evolution|development/i
      ],
      weight: 0
    },
    comparison: {
      patterns: [
        /compare|competitor|industry|peer|versus|vs/i,
        /better than|worse than|relative to/i,
        /market share|position|ranking/i,
        /how.*compare|difference|similar/i
      ],
      weight: 0
    },
    forecast: {
      patterns: [
        /future|expect|forecast|outlook|predict/i,
        /next quarter|coming year|projection/i,
        /guidance|target|estimate|potential/i
      ],
      weight: 0
    },
    operational: {
      patterns: [
        /operation|business|segment|division/i,
        /product|service|offering|market/i,
        /how.*work|strategy|approach/i
      ],
      weight: 0
    },
    management: {
      patterns: [
        /management|leadership|executive|ceo/i,
        /decision|strategy|vision|plan/i,
        /who.*lead|director|board/i
      ],
      weight: 0
    }
  };

  // Calculate weights for each context
  Object.entries(contexts).forEach(([context, data]) => {
    data.weight = data.patterns.reduce((weight, pattern) => {
      const matches = (query.match(pattern) || []).length;
      return weight + matches;
    }, 0);
  });

  // Get primary and secondary contexts
  const sortedContexts = Object.entries(contexts)
    .sort((a, b) => b[1].weight - a[1].weight)
    .filter(([_, data]) => data.weight > 0)
    .map(([context]) => context);

  return {
    primary: sortedContexts[0] || 'default',
    secondary: sortedContexts[1],
    all: sortedContexts
  };
};

// Add context-specific prompts
const contextSpecificPrompts = {
  quarterlyResults: `Focus on:
- Recent quarterly performance
- Year-over-year comparisons
- Key performance metrics
- Notable achievements or challenges`,
  
  trends: `Focus on:
- Historical patterns
- Growth trajectory
- Seasonal factors
- Long-term developments`,
  
  comparison: `Focus on:
- Industry benchmarks
- Competitive position
- Market share
- Relative performance`,
  
  forecast: `Focus on:
- Growth indicators
- Market conditions
- Company guidance
- Industry trends`,
  
  default: `Provide a balanced analysis covering relevant aspects of the query.`
};

// Add trend analysis helper
const analyzeTrends = (metrics) => {
  if (!metrics || !Array.isArray(metrics)) return [];
  
  return metrics.map(metric => ({
    metric: metric.name,
    trend: calculateTrend(metric.values),
    significance: assessSignificance(metric.values),
    insight: generateInsight(metric)
  }));
};

const calculateTrend = (values) => {
  if (!values || values.length < 2) return 'insufficient data';
  const changes = values.slice(1).map((val, i) => val - values[i]);
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  return {
    direction: avgChange > 0 ? 'up' : avgChange < 0 ? 'down' : 'stable',
    magnitude: Math.abs(avgChange),
    consistency: calculateConsistency(changes)
  };
};

const assessSignificance = (values) => {
  if (!values || values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const latestValue = values[values.length - 1];
  return ((latestValue - mean) / mean) * 100;
};

const generateInsight = (metric) => {
  const trend = calculateTrend(metric.values);
  const significance = assessSignificance(metric.values);
  
  if (significance > 20) {
    return `Significant ${trend.direction}ward trend in ${metric.name.toLowerCase()}`;
  } else if (significance > 10) {
    return `Moderate ${trend.direction}ward movement in ${metric.name.toLowerCase()}`;
  } else {
    return `Stable ${metric.name.toLowerCase()} with minor fluctuations`;
  }
};

// Add data validation and formatting
const validateAndFormatResponse = (response) => {
  try {
    const parsed = typeof response === 'string' ? JSON.parse(response) : response;
    const conversation = parsed?.conversation;

    if (!conversation) {
      return generateFallbackResponse("Unable to parse response data");
    }

    // Format metrics with proper currency and percentage symbols
    const metrics = conversation.metrics || {};
    const formattedMetrics = {
      revenue: formatMetricValue(metrics.revenue, 'currency'),
      growth: formatMetricValue(metrics.growth, 'percentage'),
      profit: formatMetricValue(metrics.profit, 'currency'),
      margin: formatMetricValue(metrics.margin, 'percentage'),
      timeframe: metrics.timeframe || 'Recent'
    };

    // Ensure trends have all required fields
    const formattedTrends = (conversation.trends || []).map(trend => ({
      metric: trend.metric || 'Unknown Metric',
      trend: trend.trend || 'stable',
      value: formatMetricValue(trend.value, getTrendValueType(trend.metric)),
      period: trend.period || 'Recent'
    }));

    return {
      analysis: {
        summary: conversation.mainResponse || "No analysis available",
        details: {
          mainPoints: conversation.insights || [],
          metrics: formattedMetrics,
          trends: formattedTrends,
          followUp: conversation.followUpQuestions || []
        }
      }
    };
  } catch (error) {
    console.error('Error formatting response:', error);
    return generateFallbackResponse("Error processing financial data");
  }
};

// Helper functions for formatting
const formatMetricValue = (value, type) => {
  if (!value) return null;
  
  const numValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numValue)) return value;

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(numValue);
    
    case 'percentage':
      return `${numValue.toFixed(1)}%`;
    
    case 'number':
      return numValue.toLocaleString();
    
    default:
      return value;
  }
};

const getTrendValueType = (metric) => {
  const metricLower = metric.toLowerCase();
  if (metricLower.includes('margin') || metricLower.includes('growth')) {
    return 'percentage';
  }
  if (metricLower.includes('revenue') || metricLower.includes('profit')) {
    return 'currency';
  }
  return 'number';
};

const generateFallbackResponse = (message) => ({
  analysis: {
    summary: message,
    details: {
      mainPoints: ["Data not available or incomplete"],
      metrics: {
        revenue: null,
        growth: null,
        profit: null,
        margin: null,
        timeframe: 'Unknown'
      },
      trends: [],
      followUp: [
        "Would you like to try a different query?",
        "Would you like to see data for a different time period?",
        "Would you like to analyze a different aspect of the company?"
      ]
    }
  }
});

// Add function to fetch and combine data from different sections
const fetchComprehensiveData = async (companyName) => {
  try {
    // Fetch data from Fundamentals section
    const fundamentalsData = await fetchFundamentalsData(companyName);
    
    // Fetch data from FinInspect section
    const finInspectData = await fetchFinInspectData(companyName);
    
    return {
      fundamentals: fundamentalsData,
      finInspect: finInspectData
    };
  } catch (error) {
    console.error('Error fetching comprehensive data:', error);
    return null;
  }
};

// Add function to fetch fundamentals data
const fetchFundamentalsData = async (companyName) => {
  try {
    // TODO: Replace with actual API endpoint
    const response = await fetch(`/api/fundamentals/${companyName}`);
    const data = await response.json();
    
    return {
      financialRatios: {
        pe: data.pe,
        pb: data.pb,
        roe: data.roe,
        debtToEquity: data.debtToEquity
      },
      keyMetrics: {
        marketCap: data.marketCap,
        bookValue: data.bookValue,
        dividendYield: data.dividendYield
      },
      historicalData: data.historicalData
    };
  } catch (error) {
    console.error('Error fetching fundamentals:', error);
    return null;
  }
};

// Add function to fetch FinInspect data
const fetchFinInspectData = async (companyName) => {
  try {
    // TODO: Replace with actual API endpoint
    const response = await fetch(`/api/finInspect/${companyName}`);
    const data = await response.json();
    
    return {
      technicalIndicators: data.technicalIndicators,
      marketSentiment: data.marketSentiment,
      newsAnalysis: data.newsAnalysis
    };
  } catch (error) {
    console.error('Error fetching FinInspect data:', error);
    return null;
  }
};

// Add the generateEnhancedPrompt function
const generateEnhancedPrompt = (originalPrompt, companyData) => {
  if (!companyData) return generatePrompt(originalPrompt);

  const { fundamentals, finInspect, marketData, newsData } = companyData || {};
  
  const fundamentalsContext = fundamentals ? `
Financial Ratios:
- PE Ratio: ${fundamentals.financialRatios?.pe || 'N/A'}
- ROE: ${fundamentals.financialRatios?.roe || 'N/A'}%
- Debt/Equity: ${fundamentals.financialRatios?.debtToEquity || 'N/A'}
Key Metrics:
- Market Cap: ${fundamentals.keyMetrics?.marketCap || 'N/A'}
- EPS: ${fundamentals.keyMetrics?.eps || 'N/A'}
Latest Quarter Results: ${JSON.stringify(fundamentals.quarterlyResults || {})}` : '';

  const finInspectContext = finInspect ? `
Technical Analysis:
- MACD: ${finInspect.technicalIndicators?.macdSignal || 'N/A'}
- RSI Trend: ${finInspect.technicalIndicators?.rsiTrend || 'N/A'}
Market Sentiment: ${finInspect.marketSentiment?.institutionalActivity || 'N/A'}
News Impact: ${finInspect.newsAnalysis?.sentimentScore || 'N/A'}` : '';

  return `Act as a financial expert having a conversation. Analyze this query with comprehensive data:
${originalPrompt}

Available Company Data:
${fundamentalsContext}
${finInspectContext}
${marketData ? `Market Data: ${JSON.stringify(marketData)}` : ''}
${newsData ? `Recent News: ${JSON.stringify(newsData)}` : ''}

Guidelines:
1. Use the provided data to give accurate insights
2. Compare with industry standards when relevant
3. Highlight significant trends and patterns
4. Explain technical terms in simple language
5. Focus on the most relevant metrics for the query

Response Format (in valid JSON):
{
  "conversation": {
    "mainResponse": "Detailed analysis incorporating all available data",
    "metrics": {
      "revenue": "number with unit",
      "growth": "number with % sign",
      "profit": "number with unit",
      "margin": "number with % sign",
      "timeframe": "specific period",
      "fundamentals": {
        "pe": "number",
        "roe": "percentage",
        "debtToEquity": "number"
      },
      "technical": {
        "trend": "up/down/sideways",
        "sentiment": "positive/negative/neutral"
      }
    },
    "trends": [
      {
        "metric": "name",
        "trend": "up/down/stable",
        "value": "number",
        "period": "timeframe"
      }
    ],
    "insights": ["Key observations based on data"],
    "followUpQuestions": ["Relevant follow-up questions"]
  }
}`;
};

// Add error handling for API responses
const handleApiResponse = async (response, errorMessage) => {
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);
  }
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`${errorMessage}: Invalid JSON response`);
  }
};

// Update the generateFinancialAnalysis function with better error handling
export const generateFinancialAnalysis = async (prompt) => {
  try {
    const companyName = extractCompanyName(prompt);
    if (!companyName) {
      throw new Error('Please specify a company name in your query. For example: "Tell me about Infosys" or "What are TCS\'s quarterly results?"');
    }

    console.log('Extracted company name:', companyName); // Debug log

    let companyData = null;
    try {
      companyData = await DataManager.fetchCompanyData(companyName);
    } catch (dataError) {
      console.warn('Error fetching company data:', dataError);
      // Continue with basic analysis if data fetch fails
    }

    const enhancedPrompt = generateEnhancedPrompt(prompt, companyData);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsedResponse = JSON.parse(text);
        return validateAndFormatResponse(parsedResponse, companyData);
      } catch (parseError) {
        console.warn('Error parsing JSON response:', parseError);
        return extractStructuredData(text, companyData);
      }
    } catch (aiError) {
      throw new Error(`Unable to analyze ${companyName}. Please try rephrasing your question.`);
    }
  } catch (error) {
    console.error('Error in generateFinancialAnalysis:', error);
    throw new Error(error.message || 'Failed to generate analysis. Please try again with a specific company name.');
  }
};

// Update the extractCompanyName function with better patterns
const extractCompanyName = (prompt) => {
  // Remove common stock exchange suffixes
  const cleanPrompt = prompt.replace(/\.NS|\.BO|\.BSE|\.NSE/gi, '').trim();

  // Common patterns for company names
  const patterns = [
    // Direct company name mentions
    /(?:about|analyze|check|tell me about)\s+([A-Z][A-Za-z\s&]+?)(?:\s+(?:stock|share|company|ltd|limited))?\s*(?:['']s)?/i,
    
    // Company name followed by specific terms
    /([A-Z][A-Za-z\s&]+?)(?:\s+(?:stock|share|company|ltd|limited))?\s*(?:performance|analysis|results|financials|growth|revenue)/i,
    
    // Company name with common Indian suffixes
    /([A-Z][A-Za-z\s&]+?)\s*(?:Ltd|Limited|Pvt|Private|Corp|Corporation|Inc|Incorporated)\b/i,
    
    // Simple capitalized sequence as fallback
    /([A-Z][A-Za-z\s&]+?)\b/
  ];

  for (const pattern of patterns) {
    const match = cleanPrompt.match(pattern);
    if (match && match[1]) {
      // Clean and validate the extracted name
      const name = match[1].trim();
      if (name.length > 1 && !/^(about|tell|me|the|a|an)$/i.test(name)) {
        return name;
      }
    }
  }

  // If no pattern matches, look for any capitalized words sequence
  const capitalizedMatch = cleanPrompt.match(/([A-Z][A-Za-z\s&]+?)(?:\s|$)/);
  if (capitalizedMatch && capitalizedMatch[1]) {
    return capitalizedMatch[1].trim();
  }

  // Special cases for common company abbreviations
  const abbreviationMatch = cleanPrompt.match(/\b([A-Z]{2,})\b/);
  if (abbreviationMatch) {
    return abbreviationMatch[1];
  }

  throw new Error('Please specify a company name in your query. For example: "Tell me about Infosys" or "What are TCS\'s quarterly results?"');
};

// Add function to generate enhanced prompt
// Helper functions for text processing
const extractPoints = (text) => text
  .split('\n')
  .filter(line => line.trim().startsWith('•'))
  .map(point => point.replace('•', '').trim());

const extractQuestions = (text) => text
  .split('\n')
  .filter(line => line.trim().includes('?'))
  .map(q => q.trim());

const extractMetrics = (text) => {
  const metrics = {};
  const patterns = {
    revenue: /₹([\d,]+)\s*crores?/i,
    growth: /(\d+\.?\d*)%\s*growth/i,
    profit: /profit\s*of\s*₹([\d,]+)\s*crores?/i,
    margin: /margin\s*of\s*(\d+\.?\d*)%/i
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match) {
      metrics[key] = parseFloat(match[1].replace(/,/g, ''));
    }
  });

  return metrics;
};

// Helper function to process financial documents
export const processFinancialDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    return {
      success: true,
      message: "Document processed successfully",
      summary: "Document analysis will be implemented in the next phase"
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Failed to process document. Please try again.');
  }
};

// Add more comprehensive data extraction patterns
const dataExtractionPatterns = {
  revenue: [
    /(revenue|sales|turnover) of [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i,
    /[\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)\s*(revenue|sales|turnover)/i,
    /reported [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i
  ],
  profit: [
    /(net profit|profit|income|earnings) of [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i,
    /[\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)\s*(net profit|profit|income)/i,
    /EBITDA of [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i
  ],
  growth: [
    /(\-?\d+\.?\d*)%\s*(growth|increase|decrease|decline|jump|drop)/i,
    /(grew|declined|increased|decreased|rose|fell)\s*by\s*(\-?\d+\.?\d*)%/i,
    /growth of (\-?\d+\.?\d*)%/i,
    /yoy\s*(growth|change)\s*of\s*(\-?\d+\.?\d*)%/i
  ],
  margin: [
    /(margin|profitability) of (\-?\d+\.?\d*)%/i,
    /(\-?\d+\.?\d*)%\s*(margin|profitability)/i,
    /(EBITDA|profit)\s*margin\s*of\s*(\-?\d+\.?\d*)%/i
  ]
};

// Enhanced YoY analysis patterns
const yoyPatterns = {
  comparison: [
    {
      pattern: /compared to [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore).*?last year/i,
      type: 'absolute'
    },
    {
      pattern: /(\-?\d+\.?\d*)%\s*(higher|lower).*?than last year/i,
      type: 'percentage'
    },
    {
      pattern: /year-over-year\s*(growth|decline)\s*of\s*(\-?\d+\.?\d*)%/i,
      type: 'percentage'
    }
  ],
  periods: [
    {
      pattern: /Q([1-4])\s*FY(\d{2})/i,
      formatter: (match) => `Q${match[1]} FY20${match[2]}`
    },
    {
      pattern: /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(\d{4})/i,
      formatter: (match) => `${match[1]} ${match[2]}`
    }
  ]
};

// Enhanced quarterly comparison logic
const quarterlyPatterns = {
  sequential: [
    {
      pattern: /compared to (?:the )?previous quarter/i,
      type: 'qoq'
    },
    {
      pattern: /(\-?\d+\.?\d*)%\s*(?:growth|decline)\s*from\s*Q([1-4])/i,
      type: 'specific_quarter'
    }
  ],
  metrics: [
    {
      name: 'Revenue',
      patterns: [
        /quarterly revenue of [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i,
        /Q([1-4]) revenue: [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i
      ]
    },
    {
      name: 'Profit',
      patterns: [
        /quarterly (?:net )?profit of [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i,
        /Q([1-4]) (?:net )?profit: [\$₹]?([\d,\.]+)\s*(billion|million|cr|crore)/i
      ]
    }
  ]
};

// Add trend visualization helpers
const trendVisualizationHelpers = {
  calculateTrendStrength: (values) => {
    if (!values || values.length < 2) return 0;
    const changes = values.slice(1).map((val, i) => ((val - values[i]) / values[i]) * 100);
    return {
      average: changes.reduce((a, b) => a + b, 0) / changes.length,
      volatility: Math.sqrt(changes.reduce((a, b) => a + b * b, 0) / changes.length),
      direction: changes.reduce((a, b) => a + Math.sign(b), 0) / changes.length
    };
  },

  generateTrendDescription: (trend) => {
    const { average, volatility, direction } = trend;
    const strength = Math.abs(average);
    const consistency = direction / Math.abs(direction) || 0;

    if (volatility > 15) return 'Highly volatile';
    if (strength < 5) return 'Stable';
    if (strength > 20 && consistency > 0.8) return 'Strong upward trend';
    if (strength > 20 && consistency < -0.8) return 'Strong downward trend';
    return 'Moderate fluctuation';
  },

  suggestVisualization: (data) => {
    const metrics = Object.keys(data).length;
    const timepoints = data[Object.keys(data)[0]]?.length || 0;

    if (timepoints <= 2) return 'simple_comparison';
    if (metrics === 1) return 'line_chart';
    if (metrics <= 3 && timepoints <= 6) return 'bar_chart';
    if (metrics > 3 && timepoints > 6) return 'area_chart';
    return 'combination_chart';
  }
};

// Add this to the extractStructuredData function
const extractStructuredData = (text) => {
  try {
    // Extract metrics using all patterns
    const metrics = {};
    Object.entries(dataExtractionPatterns).forEach(([key, patterns]) => {
      patterns.some(pattern => {
        const match = text.match(pattern);
        if (match) {
          metrics[key] = extractValue(match, key);
          return true;
        }
        return false;
      });
    });

    // Extract YoY comparisons
    const yoyData = extractYoYData(text);
    
    // Extract quarterly comparisons
    const quarterlyData = extractQuarterlyData(text);

    // Generate trend analysis
    const trends = generateTrendAnalysis(text, { yoyData, quarterlyData });

    return {
      analysis: {
        summary: text.split('\n')[0],
        details: {
          mainPoints: extractInsights(text),
          metrics,
          yoy: yoyData,
          quarterly: quarterlyData,
          trends,
          visualization: trendVisualizationHelpers.suggestVisualization(metrics)
        }
      }
    };
  } catch (error) {
    console.error('Error extracting structured data:', error);
    return generateFallbackResponse("Unable to process the financial data");
  }
};

// Add these helper functions
const extractYoYData = (text) => {
  const yoyData = {
    comparisons: [],
    periods: []
  };

  yoyPatterns.comparison.forEach(({ pattern, type }) => {
    const matches = text.matchAll(new RegExp(pattern, 'gi'));
    for (const match of matches) {
      yoyData.comparisons.push({
        type,
        value: type === 'percentage' ? parseFloat(match[1]) : extractValue(match),
        context: text.substring(match.index - 30, match.index + 30)
      });
    }
  });

  yoyPatterns.periods.forEach(({ pattern, formatter }) => {
    const matches = text.matchAll(new RegExp(pattern, 'gi'));
    for (const match of matches) {
      yoyData.periods.push({
        period: formatter(match),
        original: match[0]
      });
    }
  });

  return yoyData;
};

const extractQuarterlyData = (text) => {
  const quarterlyData = {
    sequential: [],
    metrics: {}
  };

  quarterlyPatterns.sequential.forEach(({ pattern, type }) => {
    const matches = text.matchAll(new RegExp(pattern, 'gi'));
    for (const match of matches) {
      quarterlyData.sequential.push({
        type,
        value: match[1] ? parseFloat(match[1]) : null,
        quarter: match[2] || null
      });
    }
  });

  quarterlyPatterns.metrics.forEach(({ name, patterns }) => {
    patterns.forEach(pattern => {
      const matches = text.matchAll(new RegExp(pattern, 'gi'));
      for (const match of matches) {
        if (!quarterlyData.metrics[name]) {
          quarterlyData.metrics[name] = [];
        }
        quarterlyData.metrics[name].push({
          quarter: match[1] || 'current',
          value: extractValue(match)
        });
      }
    });
  });

  return quarterlyData;
}; 
// Helper function to extract numeric values with units
const extractValue = (text, pattern) => {
  const match = text.match(pattern);
  if (!match) return null;

  let value = parseFloat(match[2].replace(/,/g, ''));
  const unit = match[3]?.toLowerCase();

  // Convert to standard units
  if (unit) {
    switch (unit) {
      case 'billion':
        value *= 1000;
        break;
      case 'million':
        value *= 1;
        break;
      case 'cr':
      case 'crore':
        value *= 10;
        break;
    }
  }

  return value;
};

// Helper function to extract timeframe
const extractTimeframe = (text) => {
  const patterns = [
    /Q[1-4]\s*(?:20\d{2}|FY\d{2})/i,
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*20\d{2}/i,
    /FY\s*20\d{2}/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }

  return 'Recent';
};

// Helper function to extract trends
const extractTrends = (text) => {
  const trendPatterns = [
    {
      pattern: /(increased|decreased|grew|declined|rose|fell) by (\-?\d+\.?\d*)%/i,
      type: 'growth'
    },
    {
      pattern: /(higher|lower) than (\-?\d+\.?\d*)%/i,
      type: 'comparison'
    },
    {
      pattern: /(improved|deteriorated) to (\-?\d+\.?\d*)%/i,
      type: 'performance'
    }
  ];

  const trends = [];
  trendPatterns.forEach(({ pattern, type }) => {
    const matches = text.matchAll(new RegExp(pattern, 'gi'));
    for (const match of matches) {
      trends.push({
        metric: type,
        trend: match[1].toLowerCase().includes('increased') || 
               match[1].toLowerCase().includes('grew') || 
               match[1].toLowerCase().includes('rose') || 
               match[1].toLowerCase().includes('improved') || 
               match[1].toLowerCase().includes('higher') ? 'up' : 'down',
        value: parseFloat(match[2]),
        period: extractTimeframe(text.substring(match.index - 50, match.index + 50))
      });
    }
  });

  return trends;
}; 