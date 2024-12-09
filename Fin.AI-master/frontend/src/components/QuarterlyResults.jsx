import React, { useState, useEffect } from 'react';
import api from '../config/api';

const QuarterlyResults = () => {
  const [quarterlyResults, setQuarterlyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuarterlyResults = async () => {
      try {
        const response = await api.get('/api/market/quarterly-results');
        if (response.data && response.data.results) {
          setQuarterlyResults(response.data.results);
        } else {
          setQuarterlyResults([]);
        }
      } catch (error) {
        console.error('Error fetching quarterly results:', error);
        setError('Failed to load quarterly results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuarterlyResults();
  }, []);

  return (
    <section className="py-20 backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-purple-900 dark:text-white mb-4">
            Latest Quarterly Results
          </h2>
          <p className="text-xl text-purple-800/80 dark:text-gray-300">
            Stay updated with the latest company earnings and performance
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-100/50 dark:border-purple-800/20">
              <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-100">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-purple-100/50 dark:bg-purple-900/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900 dark:text-white">Company</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">CMP (₹)</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">P/E</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Market Cap (Cr)</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Div Yield %</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Net Profit Qtr (Cr)</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Qtr Profit Var %</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Sales Qtr (Cr)</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Qtr Sales Var %</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">ROCE %</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">PAT Qtr (Cr)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100 dark:divide-purple-800/20">
                      {quarterlyResults.map((result, index) => (
                        <tr 
                          key={index}
                          className="hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-900 dark:text-white">
                                  {result.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-purple-900 dark:text-white">
                                  {result.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.cmp}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.pe}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.marketCap}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.divYield}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.netProfitQtr}</div>
                          </td>
                          <td className={`px-6 py-4 text-right ${parseFloat(result.qtrProfitVar) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <div className={`w-1.5 h-1.5 rounded-full ${parseFloat(result.qtrProfitVar) >= 0 ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'} animate-pulse`}></div>
                              <span className="text-sm font-medium">{result.qtrProfitVar}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.salesQtr}</div>
                          </td>
                          <td className={`px-6 py-4 text-right ${parseFloat(result.qtrSalesVar || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <div className="text-sm font-medium">{result.qtrSalesVar}</div>
                          </td>
                          <td className={`px-6 py-4 text-right ${parseFloat(result.roce || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <div className="text-sm font-medium">{result.roce}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-white">{result.patQtr}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuarterlyResults; 