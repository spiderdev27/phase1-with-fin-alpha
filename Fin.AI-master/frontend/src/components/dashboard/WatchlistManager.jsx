import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Settings, Bell, Eye, EyeOff } from 'lucide-react';

const WatchlistManager = ({ watchlist, onAddStock, onRemoveStock, onUpdatePreferences }) => {
  const [viewMode, setViewMode] = useState('compact'); // compact, detailed
  const [sortBy, setSortBy] = useState('name'); // name, price, change
  const [showNotifications, setShowNotifications] = useState({});

  const handleNotificationToggle = (symbol) => {
    const newNotifications = {
      ...showNotifications,
      [symbol]: !showNotifications[symbol]
    };
    setShowNotifications(newNotifications);
    onUpdatePreferences({ notifications: newNotifications });
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'change':
        return b.change - a.change;
      default:
        return a.symbol.localeCompare(b.symbol);
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[rgb(88,28,135)]">Watchlist</h3>
        <div className="flex space-x-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
          >
            <option value="compact">Compact</option>
            <option value="detailed">Detailed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="change">Change</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedWatchlist.map((stock) => (
          <div key={stock.symbol} 
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
          >
            {viewMode === 'compact' ? (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-[rgb(88,28,135)]">{stock.symbol}</h4>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1">{stock.change}%</span>
                  </span>
                  <button
                    onClick={() => handleNotificationToggle(stock.symbol)}
                    className={`p-1 rounded-full ${showNotifications[stock.symbol] ? 'text-purple-600' : 'text-gray-400'}`}
                  >
                    <Bell size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[rgb(88,28,135)]">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleNotificationToggle(stock.symbol)}
                      className={`p-1 rounded-full ${showNotifications[stock.symbol] ? 'text-purple-600' : 'text-gray-400'}`}
                    >
                      <Bell size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveStock(stock.symbol)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <EyeOff size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">₹{stock.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Change</p>
                    <p className={`font-semibold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="font-semibold">{stock.volume}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistManager; 