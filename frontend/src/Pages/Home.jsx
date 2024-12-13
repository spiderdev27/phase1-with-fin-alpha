import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Gem, Briefcase, Crown, Cloud, TrendingUp, ArrowRight, Users, BarChart2, Brain, CheckCircle, Shield, ChevronDown } from 'lucide-react';
import api from '../config/api';
import { ThemeContext, UserContext } from '../App';
import LiveMarketData from '../components/LiveMarketData';
import QuarterlyResults from '../components/QuarterlyResults';

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { currentUser, currentPlan, setCurrentPlan, setCurrentUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [visibleStocks, setVisibleStocks] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [quarterlyResults, setQuarterlyResults] = useState([]);
  const [quarterlyLoading, setQuarterlyLoading] = useState(true);
  const [quarterlyError, setQuarterlyError] = useState(null);
  const [visibleResults, setVisibleResults] = useState(10);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');

  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  const onSubscribe = async (plan) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (subscriptionLoading) return;
    setSubscriptionLoading(true);
    setSubscriptionError('');

    try {
      const response = await api.post('/api/subscription/update', {
        subscriptionType: plan
      });

      if (response.data.success) {
        // Update user context with new subscription
        const updatedUser = {
          ...currentUser,
          subscriptionType: plan,
          subscriptionExpiry: response.data.data.subscriptionExpiry
        };
        setCurrentUser(updatedUser);
        setCurrentPlan(plan);
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        // Show success message
        alert('Subscription updated successfully!');
      } else {
        setSubscriptionError(response.data.message || 'Failed to update subscription');
      }
    } catch (err) {
      console.error('Subscription update error:', err);
      setSubscriptionError(err.response?.data?.message || 'Failed to update subscription');
      alert(err.response?.data?.message || 'Failed to update subscription');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await api.get('/api/market/stocks');
      if (response.data && response.data.stocks) {
        setStocks(response.data.stocks);
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await api.get('/api/news');
      if (response.data && response.data.newsItems) {
        setNewsItems(response.data.newsItems);
      } else {
        setNewsItems([]);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsError('Failed to fetch news. Please try again later.');
    } finally {
      setNewsLoading(false);
    }
  };

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
      setQuarterlyError('Failed to load quarterly results. Please try again.');
    } finally {
      setQuarterlyLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchStockData(), fetchNews(), fetchQuarterlyResults()]);
    };
    initializeData();
  }, []);

  const handleFundamentals = () => {
    navigate('/fundamentals');
  };

  const handleFinInspect = () => {
    navigate('/fininspect');
  };

  const loadMoreStocks = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleStocks(prev => prev + 10);
      setIsLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  if (isLoading && newsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-purple-600 dark:border-purple-400 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <main className="relative pt-16">
        <section className="relative min-h-[90vh] flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              {/* Live Market Badge */}
              <div className="inline-flex items-center mb-8 px-6 py-3 bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-full animate-fade-in-down">
                <div className="flex items-center gap-3">
                  <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-purple-900 dark:text-white/80 font-medium">Live Market</span>
                </div>
                <div className="h-4 w-px bg-purple-200 dark:bg-white/20 mx-4"></div>
                <LiveMarketData />
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-7xl font-bold mb-6 font-poppins leading-tight animate-fade-in-up">
                <span className="text-purple-900 dark:text-white block text-4xl md:text-5xl">Unlock Financial Intelligence</span>
                <span className="text-purple-900 dark:text-white block mt-2 text-2xl md:text-3xl">with</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Fin.AI</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-purple-800/80 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                Your AI-powered financial companion for smarter investment decisions
                <span className="block mt-2 text-purple-600 dark:text-purple-400 font-medium">Make data-driven decisions in real-time</span>
              </p>

              {/* CTA Button */}
              <div className="flex justify-center mb-16 animate-fade-in-up delay-300">
                <button 
                  onClick={() => navigate('/login')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <span className="relative flex items-center justify-center">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { label: 'Active Users', value: '10K+', icon: Users },
                  { label: 'Daily Volume', value: '₹50M+', icon: BarChart2 },
                  { label: 'Success Rate', value: '94%', icon: TrendingUp },
                  { label: 'AI Accuracy', value: '99.9%', icon: Brain }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="group backdrop-blur-sm bg-white/30 dark:bg-white/5 border border-white/20 rounded-full p-4 transform hover:scale-105 transition-all duration-500 animate-fade-in-up hover:shadow-lg"
                    style={{ animationDelay: `${index * 100 + 900}ms` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mb-2 transform group-hover:scale-110 transition-transform duration-500">
                        {stat.icon && <stat.icon className="h-6 w-6 text-purple-900 dark:text-white" />}
                      </div>
                      <div className="text-2xl font-bold text-purple-900 dark:text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-purple-800/80 dark:text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-purple-800/80 dark:text-gray-300">
                Everything you need to make informed investment decisions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div 
                onClick={handleFundamentals}
                className="group relative p-8 bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-purple-100 dark:border-white/10 rounded-3xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-white">Advanced Analytics</h3>
                </div>
                <p className="text-purple-800/80 dark:text-gray-300">
                  Get detailed fundamental analysis of stocks with AI-powered insights
                </p>
              </div>

              <div 
                onClick={() => navigate('/dashboard')}
                className="group relative p-8 bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-purple-100 dark:border-white/10 rounded-3xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mr-4">
                    <Briefcase className="h-6 w-6 text-purple-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-white">Portfolio Management</h3>
                </div>
                <p className="text-purple-800/80 dark:text-gray-300">
                  Track and manage your investments in one place with real-time updates
                </p>
              </div>

              <div 
                onClick={handleFinInspect}
                className="group relative p-8 bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-purple-100 dark:border-white/10 rounded-3xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mr-4">
                    <Cloud className="h-6 w-6 text-purple-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-white">Market Intelligence</h3>
                </div>
                <p className="text-purple-800/80 dark:text-gray-300">
                  Access real-time market data and news with predictive analytics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview Section */}
        <section className="py-20 backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 dark:text-white mb-4">
                Market Overview
              </h2>
              <p className="text-xl text-purple-800/80 dark:text-gray-300">
                Real-time insights into market performance and trends
              </p>
            </div>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {/* Market Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { 
                      label: 'Total Market Cap', 
                      value: `₹${(stocks.reduce((acc, stock) => acc + stock.marketCap, 0) / 1000).toFixed(2)}T`,
                      change: '+2.5%',
                      icon: BarChart2
                    },
                    { 
                      label: 'Total Volume', 
                      value: `₹${(stocks.reduce((acc, stock) => acc + stock.volume, 0) / 1e6).toFixed(2)}M`,
                      change: '+15.3%',
                      icon: TrendingUp
                    },
                    { 
                      label: 'Active Stocks', 
                      value: stocks.length.toString(),
                      change: 'Live',
                      icon: Briefcase
                    },
                    { 
                      label: 'Market Trend', 
                      value: stocks.filter(s => s.change > 0).length > stocks.length / 2 ? 'Bullish' : 'Bearish',
                      change: `${stocks.filter(s => s.change > 0).length}/${stocks.length} ↑`,
                      icon: TrendingUp
                    }
                  ].map((metric, index) => (
                    <div key={index} className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 dark:border-purple-800/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          {React.createElement(metric.icon, { className: "h-5 w-5 text-purple-900 dark:text-white" })}
                        </div>
                        <h3 className="text-sm font-medium text-purple-800/60 dark:text-gray-400">{metric.label}</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-purple-900 dark:text-white">{metric.value}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{metric.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Market Data Table */}
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-100/50 dark:border-purple-800/20">
                  <div className="overflow-x-auto">
                    <div className="max-h-[600px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-purple-100/50 dark:bg-purple-900/50">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900 dark:text-white">Company</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Market Cap</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Current Price</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">24h Change</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Volume</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-100 dark:divide-purple-800/20">
                          {stocks.slice(0, visibleStocks).map((stock, index) => (
                            <tr 
                              key={index}
                              className="hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-colors duration-200"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-900 dark:text-white">
                                      {stock.symbol.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-purple-900 dark:text-white">
                                      {stock.name}
                                    </div>
                                    <div className="text-xs text-purple-800/60 dark:text-gray-400">
                                      {stock.symbol}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="text-sm font-medium text-purple-900 dark:text-white">
                                  ₹{(stock.marketCap / 1000).toFixed(2)}B
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="text-sm font-medium text-purple-900 dark:text-white">
                                  ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </div>
                              </td>
                              <td className={`px-6 py-4 text-right ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                <div className="inline-flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${stock.change >= 0 ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'} animate-pulse`}></div>
                                  <span className="text-sm font-medium">
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="text-sm font-medium text-purple-900 dark:text-white">
                                  {stock.volume.toLocaleString('en-IN')}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Load More Button */}
                  {visibleStocks < stocks.length && (
                    <div className="p-4 text-center border-t border-purple-100 dark:border-purple-800/20">
                      <button
                        onClick={() => setVisibleStocks(prev => prev + 10)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                      >
                        {isLoadingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quarterly Results Section */}
        <QuarterlyResults />

        {/* News Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 dark:text-white mb-4">
                Latest Market News
              </h2>
              <p className="text-xl text-purple-800/80 dark:text-gray-300">
                Stay informed with real-time market updates and expert analysis
              </p>
            </div>
            {newsLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : newsError ? (
              <div className="text-center text-red-500">{newsError}</div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {/* Featured News - First Item */}
                {newsItems.length > 0 && (
                  <div className="mb-12">
                    <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="p-8 md:p-10">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <span className="px-4 py-1.5 bg-purple-600/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-full">
                            Breaking News
                          </span>
                          <div className="flex items-center gap-2 text-purple-800/60 dark:text-gray-400">
                            <span className="text-sm">
                              {new Date(newsItems[0].publishedAt || new Date()).toLocaleDateString('en-US', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-white mb-4 leading-tight">
                          {newsItems[0].name}
                        </h3>
                        <p className="text-lg text-purple-800/80 dark:text-gray-300 mb-6 line-clamp-3">
                          {newsItems[0].description || 'Click to read more...'}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <a
                            href={newsItems[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                          >
                            Read Full Article
                            <ArrowRight className="w-4 h-4" />
                          </a>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                              <span className="text-sm text-purple-800/60 dark:text-gray-400">
                                Live Coverage
                              </span>
                            </div>
                            <div className="h-4 w-px bg-purple-200 dark:bg-white/20"></div>
                            <span className="text-sm text-purple-800/60 dark:text-gray-400">
                              Source: {newsItems[0].source?.name || 'Financial News'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* News Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* Market Updates */}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-purple-900 dark:text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Market Updates
                    </h3>
                    <div className="grid gap-6">
                      {newsItems.slice(1, 4).map((news, index) => (
                        <div 
                          key={index}
                          className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-purple-100/50 dark:border-purple-800/20"
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-purple-100/50 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 text-xs font-medium rounded-full">
                                Market
                              </span>
                              <span className="text-sm text-purple-800/60 dark:text-gray-400">
                                {new Date(news.publishedAt || new Date()).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold text-purple-900 dark:text-white mb-3 line-clamp-2">
                              {news.name}
                            </h4>
                            <p className="text-purple-800/80 dark:text-gray-300 mb-4 line-clamp-2">
                              {news.description || 'Click to read more...'}
                            </p>
                            <div className="flex items-center justify-between">
                              <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200"
                              >
                                Read More
                                <ArrowRight className="w-4 h-4" />
                              </a>
                              <span className="text-sm text-purple-800/60 dark:text-gray-400">
                                {news.source?.name || 'Financial News'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reads */}
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 dark:text-white mb-6 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5" />
                      Quick Reads
                    </h3>
                    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-100/50 dark:border-purple-800/20">
                      <div className="divide-y divide-purple-100 dark:divide-purple-800/20">
                        {newsItems.slice(4, 8).map((news, index) => (
                          <div key={index} className="p-4 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-purple-800/60 dark:text-gray-400">
                                {new Date(news.publishedAt || new Date()).toLocaleDateString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              •
                              <span className="text-xs text-purple-800/60 dark:text-gray-400">
                                {news.source?.name || 'Financial News'}
                              </span>
                            </div>
                            <a
                              href={news.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group"
                            >
                              <h4 className="text-sm font-medium text-purple-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                                {news.name}
                              </h4>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* View All News Button */}
                <div className="text-center">
                  <button
                    onClick={() => navigate('/news')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    View All Market News
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Subscription Section */}
        <section className="py-20 bg-purple-50/50 dark:bg-purple-900/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 dark:text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-purple-800/80 dark:text-gray-300">
                Select the perfect plan that suits your investment needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Bronze",
                  price: 599,
                  features: ["Base plan", "FinInspect (Only stock analysis)"],
                  icon: Shield
                },
                {
                  title: "Silver",
                  price: 999,
                  features: ["Base plan", "FinInspect (Stock)", "Personal Finance Navigator"],
                  icon: Coins
                },
                {
                  title: "Gold",
                  price: 2499,
                  features: ["Base plan", "FinInspect (Stock + Sector)", "Personal Finance", "API integration (For equity trading)"],
                  icon: Crown,
                  isPopular: true
                },
                {
                  title: "Diamond",
                  price: 6999,
                  features: ["Base plan", "FinInspect (Stock + Sector)", "Personal Finance", "API Integration (Equity, F&O, Crypto)"],
                  icon: Gem
                }
              ].map((plan, index) => (
                <div
                  key={plan.title}
                  className={`relative bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:scale-105 transition-all duration-300 ${
                    plan.isPopular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-8">
                    <plan.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-2xl font-bold text-purple-900 dark:text-white">{plan.title}</h3>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-purple-900 dark:text-white">₹{plan.price}</span>
                      <span className="text-purple-800/60 dark:text-gray-400 ml-2">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-purple-800/80 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onSubscribe(plan.title.toLowerCase())}
                    disabled={!isLoggedIn || currentPlan === plan.title.toLowerCase() || subscriptionLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      !isLoggedIn
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : currentPlan === plan.title.toLowerCase()
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : subscriptionLoading
                        ? 'bg-purple-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    }`}
                  >
                    {!isLoggedIn
                      ? 'Login to Subscribe'
                      : currentPlan === plan.title.toLowerCase()
                      ? '✨ Current Plan'
                      : subscriptionLoading
                      ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      )
                      : 'Choose Plan'}
                  </button>
                  {subscriptionError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{subscriptionError}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;