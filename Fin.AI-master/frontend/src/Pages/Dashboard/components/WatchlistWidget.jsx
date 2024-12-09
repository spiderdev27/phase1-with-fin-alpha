import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const WatchlistWidget = ({ watchlist }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[rgb(88,28,135)]">Watchlist</h3>
      <div className="space-y-4">
        {watchlist?.length > 0 ? (
          watchlist.map((stock, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div>
                <h4 className="font-semibold text-[rgb(88,28,135)]">{stock.symbol}</h4>
                <p className="text-sm text-gray-600">{stock.name}</p>
              </div>
              <div className={`flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1">{stock.change}%</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No stocks in watchlist</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistWidget; 