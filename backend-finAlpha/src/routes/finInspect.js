import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to generate prompt
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

  return `Act as a friendly financial expert having a conversation. Analyze the Indian stock ${query}:

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

// Route to get AI analysis
router.get('/analyze', async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = generatePrompt(symbol);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    try {
      // Try to parse as JSON first
      const jsonResponse = JSON.parse(analysis);
      res.json(jsonResponse);
    } catch (parseError) {
      // If JSON parsing fails, return the raw analysis
      logger.warn('Failed to parse Gemini response as JSON:', parseError);
      res.json({
        conversation: {
          mainResponse: analysis,
          metrics: {},
          trends: [],
          insights: [],
          followUpQuestions: []
        }
      });
    }
  } catch (error) {
    logger.error('Error in finInspect route:', error);
    res.status(500).json({ error: 'Failed to analyze stock' });
  }
});

export default router; 