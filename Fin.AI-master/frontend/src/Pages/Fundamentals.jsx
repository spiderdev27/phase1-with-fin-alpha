import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Search, Sun, Moon, X, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ThemeContext } from '../App';

const FundamentalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isIndian, setIsIndian] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFundamentals = () => {
    navigate('/fundamentals');
  };

  const handleFinInspect = () => {
    navigate('/fininspect');
  };

  const handlePersonalFinance = () => {
    navigate('/personal-finance');
  };

  const loadTradingViewWidget = useCallback((symbol, isIndian) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    script.onload = () => {
      try {
        const widgetContainer = document.getElementById('tradingview-widget');
        if (widgetContainer) {
          widgetContainer.innerHTML = '';
          
          new window.TradingView.widget({
            width: "100%",
            height: 500,
            symbol: `${isIndian ? 'NSE:' : ''}${symbol.toUpperCase()}`,
            interval: 'D',
            timezone: 'Asia/Kolkata',
            theme: theme,
            style: '1',
            locale: 'en',
            toolbar_bg: theme === 'dark' ? '#1E2124' : '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'tradingview-widget',
            studies: [],
            loading_screen: { backgroundColor: theme === 'dark' ? '#1E2124' : '#ffffff' },
            enabled_features: ['side_toolbar_in_fullscreen_mode'],
            allow_websocket: false,
            client_id: 'tradingview.com',
          });
        }
      } catch (error) {
        console.error('TradingView widget error:', error);
        const widgetContainer = document.getElementById('tradingview-widget');
        if (widgetContainer) {
          widgetContainer.innerHTML = `
            <div class="flex items-center justify-center h-[500px] bg-purple-50/50 dark:bg-gray-800/50 rounded-xl">
              <div class="text-center">
                <p class="text-purple-900 dark:text-white mb-2">Unable to load chart. Please try again.</p>
                <button 
                  onclick="location.reload()"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          `;
        }
      }
    };
    
    document.body.appendChild(script);
  }, [theme]);

  useEffect(() => {
    if (searchTerm) {
      const isIndian = searchTerm.toUpperCase().startsWith('NSE:') || searchTerm.toUpperCase().startsWith('BSE:');
      setIsIndian(isIndian);
      loadTradingViewWidget(isIndian ? searchTerm.slice(4) : searchTerm, isIndian);
    }
  }, [searchTerm, loadTradingViewWidget]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to access this feature');
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/api/fundamentals/search?ticker=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: token
          }
        }
      );
      
      setStockData(response.data);
    } catch (err) {
      console.error('Search error:', err);
      // More specific error handling
      if (err.response?.status === 401) {
        setError('Please log in again to continue');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error fetching data. Please try again.');
      }
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderFinancialTable = (data, title) => {
    if (!data || Object.keys(data).length === 0) return null;

    const metrics = Object.keys(data);
    const periods = Object.keys(data[metrics[0]]);

    return (
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-6 text-purple-900 dark:text-white">{title}</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900/70 dark:text-white/70">
                Metric
              </th>
              {periods.map((period) => (
                <th key={period} className="px-6 py-4 text-left text-sm font-medium text-purple-900/70 dark:text-white/70">
                  {period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {metrics.map((metric) => (
              <tr key={metric} className="hover:bg-white/5 transition-colors duration-200">
                <td className="px-6 py-4 text-sm font-medium text-purple-900 dark:text-white">
                  {metric}
                </td>
                {periods.map((period) => (
                  <td key={`${period}-${metric}`} className="px-6 py-4 text-sm text-purple-800/90 dark:text-white/90">
                    {typeof data[metric][period] === 'number' 
                      ? data[metric][period].toLocaleString() 
                      : data[metric][period] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStockData = (data) => {
    const excludeKeys = ['name', 'quarterlyResults', 'balanceSheet', 'ratios', 'evaluation'];
    const stockInfo = Object.entries(data).filter(([key]) => !excludeKeys.includes(key));

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900/70 dark:text-white/70">
                Metric
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900/70 dark:text-white/70">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {stockInfo.map(([key, value]) => (
              <tr key={key} className="hover:bg-white/5 transition-colors duration-200">
                <td className="px-6 py-4 text-sm font-medium text-purple-900 dark:text-white">
                  {key}
                </td>
                <td className="px-6 py-4 text-sm text-purple-800/90 dark:text-white/90">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEvaluationResults = () => {
    if (!stockData || !stockData.evaluation) return null;

    const { scores, overall_score, evaluation } = stockData.evaluation;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(scores).map(([key, value]) => (
            <div key={key} className="backdrop-blur-sm bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-white/20">
              <p className="text-sm text-purple-900/70 dark:text-white/70">{key.replace(/_/g, ' ')}</p>
              <p className="text-xl font-semibold text-purple-900 dark:text-white mt-1">
                {value !== null ? value.toFixed(2) : 'N/A'}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="backdrop-blur-sm bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-white/20">
            <p className="text-sm text-purple-900/70 dark:text-white/70">Overall Score</p>
            <p className="text-2xl font-semibold text-purple-900 dark:text-white mt-1">
              {overall_score !== null ? overall_score.toFixed(2) : 'N/A'}
            </p>
          </div>
          <div className="backdrop-blur-sm bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-white/20">
            <p className="text-sm text-purple-900/70 dark:text-white/70">Evaluation</p>
            <p className="text-2xl font-semibold text-purple-900 dark:text-white mt-1">
              {evaluation}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
       <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/fin.ai.logo.png" alt="Fin.AI logo" className="h-8" />
            </Link>
            <ul className="flex items-center gap-8">
              <li>
                <Link to="/" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">About</Link>
              </li>
              <li>
                <Link to="/fundamentals" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">Fundamentals</Link>
              </li>
              <li>
                <Link to="/fininspect" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">FinInspect</Link>
              </li>
              <li>
                <Link to="/personal-finance" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">Personal Finance</Link>
              </li>
              {currentUser ? (
                <li className="flex items-center gap-4">
                  <Link 
                    to="/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-duration-300"
                  >
                    Dashboard
                  </Link>
                  <span className="px-3 py-1 backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/20 rounded-xl text-xs text-purple-900 dark:text-white">
                    {currentPlan.toUpperCase()}
                  </span>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('userData');
                      navigate('/');
                    }}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-duration-300"
                  >
                    Login
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={toggleTheme} 
                  className="p-2.5 rounded-xl bg-white/30 dark:bg-white/10 text-purple-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-300"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main className="relative z-10 container mx-auto pt-32 pb-20 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Stock Fundamentals Analysis
          </h1>
          <p className="text-xl text-purple-800/70 dark:text-white/70 mb-12 max-w-2xl mx-auto">
            Analyze stocks with comprehensive fundamental data and real-time charts
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter stock symbol (e.g., AAPL, NSE:RELIANCE)"
                    className="w-full px-5 py-4 rounded-xl bg-purple-50 dark:bg-gray-800 border border-purple-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-900 dark:text-white placeholder-purple-400/50 dark:placeholder-gray-500 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={loading || !searchTerm.trim()}
                    className={`px-6 py-4 rounded-2xl flex items-center gap-2 transition-all duration-300 ${
                      loading || !searchTerm.trim()
                        ? 'bg-purple-400/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90'
                    } text-white min-w-[120px] justify-center`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {error && (
            <div className="backdrop-blur-xl bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-3xl p-6 mb-8 animate-fade-in">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <div>{error}</div>
              </div>
            </div>
          )}
          {searchTerm && (
            <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl p-6 mb-8">
              <div id="tradingview-widget" className="w-full h-[500px]"></div>
            </div>
          )}
          {stockData && (
            <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-900 dark:text-white">{stockData.name} Fundamentals</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-duration-300"
                >
                  View FinSpect Analysis
                </button>
              </div>
              {renderStockData(stockData)}
              {stockData.quarterlyResults && (
                <div className="mt-8 backdrop-blur-sm bg-white/50 dark:bg-white/5 rounded-2xl p-6 border border-white/20">
                  {renderFinancialTable(stockData.quarterlyResults, 'Quarterly Results')}
                </div>
              )}
              {stockData.balanceSheet && (
                <div className="mt-8 backdrop-blur-sm bg-white/50 dark:bg-white/5 rounded-2xl p-6 border border-white/20">
                  {renderFinancialTable(stockData.balanceSheet, 'Balance Sheet')}
                </div>
              )}
              {stockData.ratios && (
                <div className="mt-8 backdrop-blur-sm bg-white/50 dark:bg-white/5 rounded-2xl p-6 border border-white/20">
                  {renderFinancialTable(stockData.ratios, 'Ratios')}
                </div>
              )}
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-900 dark:text-white">FinSpect Analysis</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl bg-white/30 dark:bg-white/10 text-purple-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-300"
                >
                  ✕
                </button>
              </div>
              {renderEvaluationResults()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FundamentalsPage;