import React, { useState, useEffect } from 'react';
import { mockStockData } from '../services/mockFundamentalData';
import { mockSectorData } from '../services/mockSectorData';

const Fundamentals = () => {
  const [fundamentalData, setFundamentalData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stocks');

  useEffect(() => {
    try {
      setFundamentalData(mockStockData);
      setSectorData(mockSectorData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      {/* Tab buttons */}
      <div className="mb-4 border-b border-white/20">
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'stocks' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setActiveTab('stocks')}
        >
          Stocks
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'sectors' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setActiveTab('sectors')}
        >
          Sector Analysis
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'stocks' ? (
        <table className="min-w-full">
          <thead>
            <tr className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20">
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
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              fundamentalData.map((item, index) => (
                <tr key={index} className="border-b border-white/20 hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.company}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.cmp}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.pe}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.marketCap}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.divYield}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.netProfitQtr}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.qtrProfitVar}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.salesQtr}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.qtrSalesVar}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.roce}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{item.patQtr}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20">
              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900 dark:text-white">Sector</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Market Cap (Cr)</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">P/E Ratio</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Monthly Return %</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Yearly Return %</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Performance Score</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Volatility</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              sectorData.map((sector, index) => (
                <tr key={index} className="border-b border-white/20 hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{sector.sector}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{sector.marketCap}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{sector.peRatio}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{sector.monthlyReturn}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{sector.yearlyReturn}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{sector.performance}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{sector.volatility}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Fundamentals; 