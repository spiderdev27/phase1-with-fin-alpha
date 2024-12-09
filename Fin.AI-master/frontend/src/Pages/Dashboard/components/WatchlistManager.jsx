import React, { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Search } from 'lucide-react';
import axios from 'axios';

const WatchlistManager = ({ watchlist, onAddStock, onRemoveStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Debounced search function
  useEffect(() => {
    const searchStocks = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError('');

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/dashboard/search/stocks?query=${searchQuery}`,
          {
            headers: { Authorization: token }
          }
        );

        if (response.data.success) {
          setSearchResults(response.data.data);
        }
      } catch (error) {
        console.error('Stock search error:', error);
        setSearchError('Failed to search stocks');
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchStocks, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAddStock = async (stock) => {
    try {
      await onAddStock(stock);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[rgb(88,28,135)]">Watchlist Manager</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchError ? (
              <div className="p-4 text-center text-red-500">{searchError}</div>
            ) : searchResults.length > 0 ? (
              <ul className="max-h-60 overflow-auto">
                {searchResults.map((stock) => (
                  <li
                    key={stock.symbol}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => handleAddStock(stock)}
                  >
                    <div>
                      <p className="font-semibold text-[rgb(88,28,135)]">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <Plus className="text-green-500" size={20} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div className="space-y-4">
        {watchlist.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div>
              <h3 className="font-semibold text-[rgb(88,28,135)]">{stock.symbol}</h3>
              <p className="text-sm text-gray-600">{stock.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1">{stock.change}%</span>
              </div>
              <button
                onClick={() => onRemoveStock(stock.symbol)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistManager; 