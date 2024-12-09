import React, { useState, useContext, useEffect } from 'react';
import { ArrowRight, Loader, Search, TrendingUp, LineChart, AlertCircle } from 'lucide-react';
import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { ThemeContext, UserContext } from '../App';
import LiveMarketData from '../components/LiveMarketData';

const FinInspect = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { currentUser, setCurrentUser, currentPlan, setCurrentPlan } = useContext(UserContext);
  const [analysisType, setAnalysisType] = useState('sector');
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setCurrentPlan(user.subscriptionType || 'free');
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, setCurrentUser, setCurrentPlan]);
  
  // Check subscription requirements when analysis type changes
  useEffect(() => {
    if (currentUser) {
      const subscription = currentUser.subscriptionType?.toLowerCase() || 'free';
      if (analysisType === 'sector' && !['gold', 'platinum', 'diamond'].includes(subscription)) {
        setError('Sector analysis requires a Gold subscription or higher');
      } else if (analysisType === 'stock' && !['bronze', 'silver', 'gold', 'platinum', 'diamond'].includes(subscription)) {
        setError('Stock analysis requires a Bronze subscription or higher');
      } else {
        setError('');
      }
    }
  }, [analysisType, currentUser]);
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAnalysisTypeChange = (type) => {
    setAnalysisType(type);
    setAnalysis('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to use this feature');
      navigate('/login');
      return;
    }

    // Check subscription requirements
    const subscription = currentUser?.subscriptionType?.toLowerCase() || 'free';
    if (analysisType === 'sector' && !['gold', 'platinum', 'diamond'].includes(subscription)) {
      setError('Sector analysis requires a Gold subscription or higher');
      return;
    }
    if (analysisType === 'stock' && !['bronze', 'silver', 'gold', 'platinum', 'diamond'].includes(subscription)) {
      setError('Stock analysis requires a Bronze subscription or higher');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      // Add retry logic for failed requests
      const maxRetries = 3;
      let retryCount = 0;
      let response;

      while (retryCount < maxRetries) {
        try {
          response = await api.post(`/api/finspect/analyze/${analysisType}`, 
            { input: input.trim() },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              timeout: 30000 // 30 second timeout
            }
          );
          break; // If successful, break the retry loop
        } catch (err) {
          retryCount++;
          if (retryCount === maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
      }

      if (response?.data?.data?.analysis) {
        setAnalysis(response.data.data.analysis);
      } else {
        throw new Error('No analysis data received');
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      const errorMessage = err.response?.data?.error || err.message;
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setCurrentUser(null);
        setCurrentPlan('free');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError(`Subscription required: ${errorMessage}`);
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again in a few moments.');
      } else {
        setError(errorMessage || 'Failed to analyze. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-950">
      <main className="relative pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                FinInspect Analysis
              </span>
            </h1>
            <p className="text-lg text-purple-800/80 dark:text-gray-300 max-w-2xl mx-auto">
              Get detailed insights and analysis for any sector or stock in the market
            </p>
          </div>

          {/* Live Market Data */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-white/10 backdrop-blur-xl shadow-lg rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-purple-900 dark:text-white/80 font-medium">Live Market</span>
              </div>
              <div className="h-4 w-px bg-purple-200 dark:bg-white/20 mx-4"></div>
              <LiveMarketData />
            </div>
          </div>

          {/* Main Analysis Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
              {/* Analysis Type Selection */}
              <div className="flex p-1 bg-purple-50 dark:bg-gray-800 border-b border-purple-100 dark:border-gray-700">
                <button
                  onClick={() => handleAnalysisTypeChange('sector')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    analysisType === 'sector'
                      ? 'bg-white dark:bg-gray-900 text-purple-900 dark:text-white shadow-sm'
                      : 'text-purple-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-900/50'
                  }`}
                >
                  <TrendingUp size={18} />
                  Sector Analysis
                </button>
                <button
                  onClick={() => handleAnalysisTypeChange('stock')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    analysisType === 'stock'
                      ? 'bg-white dark:bg-gray-900 text-purple-900 dark:text-white shadow-sm'
                      : 'text-purple-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-900/50'
                  }`}
                >
                  <LineChart size={18} />
                  Stock Analysis
                </button>
              </div>

              <div className="p-8">
                {/* Input Form */}
                <form onSubmit={handleSubmit} className="mb-8">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder={analysisType === 'sector' ? 'Enter sector name (e.g., Technology, Banking)' : 'Enter stock symbol (e.g., AAPL, GOOGL)'}
                      className="w-full px-5 py-4 pl-12 rounded-xl bg-purple-50 dark:bg-gray-800 border border-purple-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-900 dark:text-white placeholder-purple-400/50 dark:placeholder-gray-500"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 dark:text-gray-500" size={20} />
                    <button
                      type="submit"
                      disabled={loading || !input.trim() || error}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin h-4 w-4" />
                          Analyzing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Analyze
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </button>
                  </div>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                {/* Analysis Results */}
                {analysis && (
                  <div className="prose dark:prose-invert max-w-none bg-purple-50/50 dark:bg-gray-800/50 rounded-xl p-6">
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                      <div dangerouslySetInnerHTML={{ __html: marked(analysis) }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinInspect;