import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, TrendingUp, Shield } from 'lucide-react';
import api from '../config/api';
import { UserContext } from '../App';

const Popup = ({ message, type = 'success' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className={`bg-white p-6 rounded-lg shadow-xl ${
      type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
    }`}>
      <p className={`text-lg font-semibold ${
        type === 'success' ? 'text-green-700' : 'text-red-700'
      }`}>{message}</p>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const navigate = useNavigate();
  const { setCurrentUser, setCurrentPlan } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        setCurrentPlan(response.data.user.subscriptionType || 'free');
        
        setPopupMessage('Login successful! Redirecting...');
        setPopupType('success');
        setShowPopup(true);
        
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 1500);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col pt-16">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Login Form Card */}
          <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  Welcome Back
                </span>
              </h2>
              <p className="text-purple-800/80 dark:text-gray-300">
                Log in to access your Fin.AI dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/20 rounded-xl text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-900 dark:text-white mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-purple-50/50 dark:bg-gray-800/50 border border-purple-100/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-900 dark:text-white placeholder-purple-400/50 dark:placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-900 dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-purple-50/50 dark:bg-gray-800/50 border border-purple-100/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-900 dark:text-white placeholder-purple-400/50 dark:placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in <LogIn className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-200/30 dark:border-gray-700/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-purple-800/60 dark:text-gray-400">
                    New to Fin.AI?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-6 py-3 bg-purple-50/50 dark:bg-gray-800/50 border border-purple-100/50 dark:border-gray-700/50 text-purple-900 dark:text-white rounded-xl hover:bg-purple-100/50 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                Create an account
              </Link>
            </form>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="backdrop-blur-sm bg-white/20 dark:bg-white/5 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 text-purple-900 dark:text-white">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Real-time Analysis</span>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/20 dark:bg-white/5 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 text-purple-900 dark:text-white">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPopup && <Popup message={popupMessage} type={popupType} />}
    </div>
  );
};

export default Login;