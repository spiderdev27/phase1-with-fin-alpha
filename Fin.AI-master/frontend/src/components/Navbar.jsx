import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { ThemeContext, UserContext } from '../App';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { currentUser, setCurrentUser, currentPlan, setCurrentPlan } = useContext(UserContext);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Fundamentals', path: '/fundamentals' },
    { name: 'FinInspect', path: '/fininspect' },
    { name: 'News', path: '/news' },
    { name: 'Personal Finance', path: '/personal-finance' },
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { name: 'Subscription', path: '/subscription', requiresAuth: true },
    { name: 'FinAlpha', path: '/finalpha' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.subscriptionType) {
          setCurrentPlan(parsedData.subscriptionType);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [setCurrentPlan]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setCurrentPlan('free');
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Get the plan display text
  const getPlanDisplay = () => {
    if (!currentUser) return 'FREE';
    
    // Try to get the plan from localStorage first
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.subscriptionType) {
          return parsedData.subscriptionType.toUpperCase();
        }
      }
    } catch (error) {
      console.error('Error reading subscription from localStorage:', error);
    }
    
    // Fallback to context plan
    return (currentUser.subscriptionType || currentPlan || 'FREE').toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/fin.ai.logo.png" alt="Fin.AI logo" className="h-8" />
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link to="/" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/fundamentals" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                Fundamentals
              </Link>
            </li>
            <li>
              <Link to="/fininspect" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                FinInspect
              </Link>
            </li>
            <li>
              <Link to="/personal-finance" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                Personal Finance
              </Link>
            </li>
            <li>
              <Link to="/finalpha" className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                FinAlpha
              </Link>
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
                  {getPlanDisplay()}
                </span>
                <button 
                  onClick={handleLogout}
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

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/30 dark:bg-white/10 text-purple-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 px-4">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 rounded-3xl p-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link 
                    to="/"
                    className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about"
                    className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/fundamentals"
                    className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Fundamentals
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/fininspect"
                    className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    FinInspect
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/personal-finance"
                    className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Personal Finance
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/finalpha"
                    className="text-purple-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    FinAlpha
                  </Link>
                </li>
                {currentUser ? (
                  <>
                    <li>
                      <Link 
                        to="/dashboard"
                        className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-duration-300 text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <span className="block px-3 py-1 backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/20 rounded-xl text-xs text-purple-900 dark:text-white text-center">
                        {getPlanDisplay()}
                      </span>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button 
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-duration-300"
                    >
                      Login
                    </button>
                  </li>
                )}
                <li>
                  <button 
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white/30 dark:bg-white/10 text-purple-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;