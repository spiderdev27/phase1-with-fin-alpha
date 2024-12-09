import yahooFinance from 'yahoo-finance2';

export const getFundamentalData = async (symbol) => {
  try {
    const quote = await yahooFinance.quote(symbol);
    const fundamentals = await yahooFinance.fundamentals(symbol);
    
    return {
      company: quote.displayName,
      cmp: quote.regularMarketPrice,
      pe: quote.forwardPE,
      marketCap: quote.marketCap,
      divYield: quote.dividendYield,
      // ... map other required fields
    };
  } catch (err) {
    throw new Error('Failed to fetch fundamental data');
  }
}; 