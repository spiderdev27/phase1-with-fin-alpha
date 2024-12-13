import React, { useState } from 'react';
import { PieChart, BarChart, TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioManagement = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState('1M'); // 1D, 1W, 1M, 3M, 1Y, ALL

  const calculateMetrics = () => {
    // Mock calculations
    return {
      totalValue: portfolio?.totalValue || 0,
      totalReturn: 15.5,
      dayChange: 2.3,
      riskLevel: 'Moderate',
      diversificationScore: 8.5
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[rgb(88,28,135)]">Portfolio Management</h2>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-full text-sm ${
                timeframe === period
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-[rgb(88,28,135)]">
            ₹{metrics.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Return</p>
          <p className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics.totalReturn}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Today's Change</p>
          <div className="flex items-center">
            {metrics.dayChange >= 0 ? (
              <TrendingUp className="text-green-500 mr-2" size={20} />
            ) : (
              <TrendingDown className="text-red-500 mr-2" size={20} />
            )}
            <p className={`text-2xl font-bold ${metrics.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.dayChange}%
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Risk Level</p>
          <p className="text-2xl font-bold text-[rgb(88,28,135)]">{metrics.riskLevel}</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolio?.holdings?.map((holding, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[rgb(88,28,135)]">{holding.symbol}</div>
                      <div className="text-sm text-gray-500">{holding.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {holding.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{holding.avgCost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{holding.currentPrice}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {holding.pnl}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Buy</button>
                  <button className="text-red-600 hover:text-red-900">Sell</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioManagement; 