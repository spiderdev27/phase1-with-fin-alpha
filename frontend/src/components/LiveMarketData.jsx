import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import api from '../config/api';

const LiveMarketData = () => {
  const [marketData, setMarketData] = useState({
    nifty: { value: '19,425.35', change: 0 },
    sensex: { value: '64,363.78', change: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await api.get('/api/market/live');
        const { nifty, sensex } = response.data;

        if (!nifty?.current || !sensex?.current) {
          throw new Error('Invalid market data received');
        }

        setMarketData({
          nifty: {
            value: nifty.current.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
            change: nifty.change || 0
          },
          sensex: {
            value: sensex.current.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
            change: sensex.change || 0
          }
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Unable to fetch market data');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Update every 10 seconds
    const interval = setInterval(fetchMarketData, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-spin h-4 w-4 border-2 border-purple-600 rounded-full border-t-transparent"></div>
        <span className="text-purple-900 dark:text-white/80">Loading market data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-red-600 dark:text-red-400">{error}</span>
      </div>
    );
  }

  const renderMarketValue = (data, label, Icon) => {
    const change = data?.change || 0;
    const value = data?.value || '0.00';
    
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <span className={`font-medium ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {label}: {change >= 0 ? '▲' : '▼'} {value}
          <span className="text-sm ml-1">
            ({change >= 0 ? '+' : ''}{change.toFixed(2)}%)
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4">
      {renderMarketValue(marketData.nifty, 'NIFTY 50', TrendingUp)}
      <div className="h-4 w-px bg-purple-200 dark:bg-white/20"></div>
      {renderMarketValue(marketData.sensex, 'SENSEX', BarChart2)}
    </div>
  );
};

export default LiveMarketData; 