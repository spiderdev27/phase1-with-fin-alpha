import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Download, 
  Settings, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Import components
import WatchlistWidget from './components/WatchlistWidget';
import PortfolioWidget from './components/PortfolioWidget';
import AlertsWidget from './components/AlertsWidget';
import ActivityWidget from './components/ActivityWidget';
import ReportGenerator from './components/ReportGenerator';
import WatchlistManager from './components/WatchlistManager';
import OnboardingTour from '../../components/OnboardingTour';

// Add import
import { dashboardTourSteps } from '../../config/tourSteps';
import api from '../../utils/api';

const UserInfoCard = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg p-1">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          {/* User Info Section */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[rgb(88,28,135)] mb-1">
                  {user?.firstname} {user?.lastname}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="text-right">
            <div className="mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-sm font-semibold">
                {user?.subscriptionType?.toUpperCase() || 'FREE'} PLAN
              </span>
            </div>
            {user?.subscriptionExpiry && (
              <p className="text-sm text-gray-600">
                Valid until: {new Date(user.subscriptionExpiry).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Portfolio Value</p>
            <p className="text-2xl font-bold text-[rgb(88,28,135)]">₹150,000</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Today's Change</p>
            <p className="text-2xl font-bold text-green-500">+2.5%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Watchlist Items</p>
            <p className="text-2xl font-bold text-[rgb(88,28,135)]">12</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Active Alerts</p>
            <p className="text-2xl font-bold text-[rgb(88,28,135)]">5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 flex flex-col items-center">
        <TrendingUp className="text-purple-600 mb-2" size={24} />
        <span className="text-sm font-semibold">Add Investment</span>
      </button>
      <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 flex flex-col items-center">
        <Bell className="text-purple-600 mb-2" size={24} />
        <span className="text-sm font-semibold">Set Alert</span>
      </button>
      <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 flex flex-col items-center">
        <Download className="text-purple-600 mb-2" size={24} />
        <span className="text-sm font-semibold">Download Report</span>
      </button>
      <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 flex flex-col items-center">
        <Settings className="text-purple-600 mb-2" size={24} />
        <span className="text-sm font-semibold">Settings</span>
      </button>
    </div>
  );
};

// Portfolio Performance Chart Component
const PortfolioPerformanceChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [150000, 155000, 158000, 162000, 160000, 165000, 170000, 168000, 172000, 175000, 178000, 180000],
        borderColor: 'rgb(88,28,135)',
        backgroundColor: 'rgba(88,28,135,0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

// Recent Transactions Component
const RecentTransactions = ({ transactions }) => {
  const mockTransactions = [
    {
      id: 1,
      type: 'BUY',
      symbol: 'TATAMOTORS',
      quantity: 100,
      price: 500,
      date: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'SELL',
      symbol: 'RELIANCE',
      quantity: 50,
      price: 2400,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    // Add more mock transactions
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockTransactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  transaction.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.symbol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{transaction.price}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  const mockActivities = [
    {
      id: 1,
      type: 'PURCHASE',
      description: 'Bought 100 shares of TATAMOTORS at ₹500',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'SALE',
      description: 'Sold 50 shares of RELIANCE at ₹2400',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      type: 'ALERT',
      description: 'Price alert triggered for INFY at ₹1500',
      timestamp: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  return (
    <div className="space-y-4">
      {mockActivities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className={`p-2 rounded-full ${
            activity.type === 'PURCHASE' ? 'bg-green-100' :
            activity.type === 'SALE' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            {activity.type === 'PURCHASE' ? <TrendingUp className="text-green-600" size={20} /> :
             activity.type === 'SALE' ? <TrendingDown className="text-red-600" size={20} /> :
             <Bell className="text-blue-600" size={20} />}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userData);
    setCurrentUser(user);
    setCurrentPlan(user.subscriptionType || 'free');
    // Fetch user data
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    // Check if user has completed the tour
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (!tourCompleted) {
      setIsNewUser(true);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/dashboard/portfolio');
      setPortfolio(response.data.data);

      // Fetch watchlist
      const watchlistResponse = await axios.get('http://localhost:5000/api/dashboard/watchlist', {
        headers: { Authorization: token }
      });
      setWatchlist(watchlistResponse.data.data);

      // Fetch alerts
      const alertsResponse = await axios.get('http://localhost:5000/api/dashboard/alerts', {
        headers: { Authorization: token }
      });
      setAlerts(alertsResponse.data.data);

      // Fetch activities
      const activitiesResponse = await axios.get('http://localhost:5000/api/dashboard/activities', {
        headers: { Authorization: token }
      });
      setActivities(activitiesResponse.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAddStock = async (newStock) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/dashboard/watchlist/add',
        newStock,
        {
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setWatchlist([...watchlist, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock to watchlist');
    }
  };

  const handleRemoveStock = async (symbol) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/dashboard/watchlist/${symbol}`, {
        headers: { Authorization: token }
      });

      setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
    } catch (error) {
      console.error('Error removing stock:', error);
      alert('Failed to remove stock from watchlist');
    }
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
        <OnboardingTour steps={dashboardTourSteps} pageName="dashboard" />

        {/* User Info Card */}
        {currentUser && <UserInfoCard user={currentUser} />}

        {/* Quick Actions */}
        <div className="mt-8">
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio and Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Performance Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[rgb(88,28,135)]">Portfolio Performance</h3>
                <select className="px-3 py-1 border rounded-lg text-sm">
                  <option value="1M">1M</option>
                  <option value="3M">3M</option>
                  <option value="6M">6M</option>
                  <option value="1Y">1Y</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <PortfolioPerformanceChart />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-[rgb(88,28,135)]">Recent Transactions</h3>
              <RecentTransactions />
            </div>
          </div>

          {/* Right Column - Watchlist and Activity */}
          <div className="space-y-8">
            {/* Watchlist */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <WatchlistManager 
                watchlist={watchlist}
                onAddStock={handleAddStock}
                onRemoveStock={handleRemoveStock}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-[rgb(88,28,135)]">Recent Activity</h3>
              <RecentActivity activities={activities} />
            </div>
          </div>
        </div>

        {/* Report Generator */}
        <div className="mt-8">
          <ReportGenerator 
            portfolio={portfolio}
            watchlist={watchlist}
            activities={activities}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;