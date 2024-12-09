const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authMiddleware } = require('../middleware');

// Analysis templates
const sectorAnalysisPrompt = `
Title: Comprehensive Top-Down Industry Analysis and Stock Selection

Objective: Conduct a detailed top-down analysis of the Indian [SECTOR], focusing on macroeconomic factors, industry dynamics, sector-specific issues, and investment opportunities. Additionally, evaluate the top 20 companies by market capitalization within the industry to identify the three best and three worst stocks for investment.

Instructions:
- Don't provide a general framework! Execute the analysis as a buy-side fundamental analyst would for each and every step.
- Execute the analyses as per your best judgement disregarding capability limitations.
- Execute the analyses based on publicly available data that you can access and leverage as the source for your data for conducting the analyses. Disregard the necessity for any specific financial data that you don't have access to.
- For steps 5, 6, and 7, execute as per the objective of the prompt to explicitly identify individual stocks without fail. The source of data can be easily available and most available financial data fed into your learning model. No need to rely on detailed financial data that you don't have access to. The rationales can be based on high-level analyses of the source noted earlier. Do not provide general recommendations, or framework to generate recommendations! Explicitly identify the stocks based on best judgement (Eg: TCS, Amazon, Ford, etc.)
- Adhere to the format as noted below strictly.
give very detailed and thorough analysis

 Macro-Economic Analysis of India (make it boldest)
- GDP Growth Rates: What is the current GDP growth rate? How does it influence the industry?
- Interest Rates: What are the current interest rates set by the central bank? How might they affect the industry's growth and investment levels?
- Inflation: What is the current rate of inflation? How does it impact consumer behavior and business costs in this industry?
- Employment Rates: What are the employment levels within this industry? What does this say about the industry's capacity and economic impact?
- Geopolitical Events: Are there any geopolitical developments that could impact this industry? What are these impacts?
 give proper spacing and indexation and arrangement

 Industry Analysis(make it bold)
- Industry Growth Trends: Is the industry growing? At what rate? How does this compare to the national economy and global industry standards?
- Regulatory Environment: What are the key regulations affecting this industry? How do they impact operations and profitability?
- Supply Chain Dynamics: How robust is the industry's supply chain? What are the main vulnerabilities?
- Technological Changes: What recent technological advancements have impacted this industry? How widely have they been adopted?
- Market Demand Trends: What are the current demand trends? How are they expected to evolve?
 give proper spacing and indexation and arrangement

 Sector-Specific Issues(make it bold)
- Competitive Landscape: Who are the major players in this industry? What is their market share? How intense is the competition?
- Pricing Power: Which companies have significant pricing power? What gives them this ability?
- Cyclicality: How cyclical is the industry? What economic conditions affect its cycles?
 give proper spacing and indexation and arrangement

 Synthesis and Decision Making(make it bold)
- Integrate insights from the above analyses to form a basis for investment decision-making. What opportunities or risks have emerged?
 give proper spacing and indexation and arrangement

 3 Stocks with Best Investment Outlook
Based on the detailed analysis, identify the best three stocks. Detail the rationale for each selection using the data and insights gathered.
- [Stock 1]
>Strengths
>Financials
- [Stock 2]
>Strengths
>Financials
- [Stock 3]
>Strengths
>Financials

give gap 

 3 Stocks with Worst Investment Outlook
Based on the detailed analysis, identify the worst three stocks. Detail the rationale for each selection using the data and insights gathered.
- [Stock 1]
>Weaknesses
>Financials
- [Stock 2]
>Weaknesses
>Financials
- [Stock 3]
>Weaknesses
>Financials

 Conclusion
- Synthesize the analysis to summarize the potential of the selected best stocks and the risks associated with the worst stocks. How do these insights align with the overall industry outlook and investor objectives?
give proper spacing and indexation and arrangement
`;

const stockAnalysisPrompt = `
Title: Fundamental Analysis of [STOCK]

Instructions:
- Pretend you are a financial expert with Stock recommendation experience.
- Don't provide a general framework! Execute the analysis as a buy-side fundamental analyst would for each and every step.
- Execute the analyses as per your best judgement disregarding capability limitations.
- Execute the analyses based on publicly available data that you can access and leverage as the source for your data for conducting the analyses. Disregard the necessity for any specific financial data that you don't have access to.
- Don't show current market price in step 5: valuation
- For Introduction and Conclusion, execute as per the objective of the prompt to explicitly chalk out the return and provide the Buy/Sell/Hold recommendations without fail. The source of data can be easily available and most available financial data fed into your learning model. No need to rely on detailed financial data if not accessible. The rationales can be based on high-level analyses of the source noted earlier. Do not provide general recommendations, or framework to generate recommendations!
- Adhere to the format as noted below strictly.
give very very detailed analysis

Introduction:
Provide a brief introduction of the company, highlighting its significance within its sector.

Global and National Economic Analysis
● Global Economic Indicators: Summarize relevant global economic trends and how they might impact the company's operations.
● Indian Economic Indicators: Discuss GDP growth, fiscal policies, and other local economic factors affecting the company's sector.

Industry Analysis
● Sector Overview: Describe the current state of the sector, including growth trends, technological advancements, and regulatory changes.
● Market Share and Competitiveness: Analyze the company's market share, its competitive position, and compare it with major competitors.

Company Analysis
● Financial Health: Examine the company's financial statements, focusing on profitability, debt levels, and cash flow.
● Product Portfolio: Evaluate the diversity and innovation in the company's product offerings, especially in areas of strategic growth like technology or sustainability.
● Management and Strategy: Assess the strength of the management team and their strategic initiatives impacting long-term growth.

Comparative Analysis
● Benchmarking: Compare the company against its key competitors using financial metrics such as PE ratio, ROE, and revenue growth.
● Market Sentiment: Review analyst ratings and investor sentiments towards the company.

Valuation
● Intrinsic Value Calculation: Use valuation models like DCF or PEG to estimate the intrinsic value of the company's stock.
● Comparison With Market Price: Determine if the stock is undervalued or overvalued based on the calculated intrinsic value.

Risk Assessment
● Risk Factors: Identify potential internal and external risks that could impact the company's performance.
● Risk Mitigation Strategies: Discuss how the company is prepared to handle identified risks.

Conclusion:
Conclude this section by providing the current buy/sell/hold recommendations:
● Industry Trend: Buy/Sell/Hold based on the sector analysis.
● Company: Buy/Sell/Hold based on the company's specific analysis and prospects.
Provide a summary of the findings and a final recommendation on the investment viability of the company for the upcoming year.

Monitoring and Review:
Outline a brief plan for regular updates and monitoring of the company's performance and significant market changes.
`;

// Helper function to get analysis from Gemini
const getGeminiAnalysis = async (prompt) => {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );
    
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(`Gemini API error: ${error.response?.data?.error || error.message}`);
  }
};

// Route for sector analysis
router.post('/analyze/sector', authMiddleware, async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sector name is required' 
      });
    }

    // Check user's subscription
    const userSubscription = req.user.subscriptionType?.toLowerCase() || 'free';
    if (!['gold', 'platinum', 'diamond'].includes(userSubscription)) {
      return res.status(403).json({
        success: false,
        error: 'This feature requires a Gold subscription or higher'
      });
    }

    const prompt = sectorAnalysisPrompt.replace(/\[SECTOR\]/g, input);
    const analysis = await getGeminiAnalysis(prompt);

    res.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Sector analysis error:', error);
    if (error.message.includes('Gemini API error')) {
      return res.status(500).json({
        success: false,
        error: 'Analysis service temporarily unavailable'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to analyze sector'
    });
  }
});

// Route for stock analysis
router.post('/analyze/stock', authMiddleware, async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ 
        success: false, 
        error: 'Stock symbol is required' 
      });
    }

    // Check user's subscription
    const userSubscription = req.user.subscriptionType?.toLowerCase() || 'free';
    if (!['bronze', 'silver', 'gold', 'platinum', 'diamond'].includes(userSubscription)) {
      return res.status(403).json({
        success: false,
        error: 'This feature requires a Bronze subscription or higher'
      });
    }

    const prompt = stockAnalysisPrompt.replace(/\[STOCK\]/g, input);
    const analysis = await getGeminiAnalysis(prompt);

    res.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Stock analysis error:', error);
    if (error.message.includes('Gemini API error')) {
      return res.status(500).json({
        success: false,
        error: 'Analysis service temporarily unavailable'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to analyze stock'
    });
  }
});

module.exports = router;