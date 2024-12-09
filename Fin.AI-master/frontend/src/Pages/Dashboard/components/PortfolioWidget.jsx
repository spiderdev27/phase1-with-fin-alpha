import React from 'react';
import { PieChart, DollarSign } from 'lucide-react';

const PortfolioWidget = ({ portfolio }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[rgb(88,28,135)]">Portfolio Overview</h3>
      <div className="space-y-4">
        {portfolio?.holdings?.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-lg font-bold text-[rgb(88,28,135)]">₹{portfolio.totalValue?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Today's Change</p>
                <p className={`text-lg font-bold ${portfolio.todayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolio.todayChange}%
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {portfolio.holdings.map((holding, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <h4 className="font-semibold text-[rgb(88,28,135)]">{holding.symbol}</h4>
                    <p className="text-sm text-gray-600">{holding.quantity} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[rgb(88,28,135)]">₹{holding.value.toLocaleString()}</p>
                    <p className={`text-sm ${holding.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">No holdings in portfolio</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioWidget; 