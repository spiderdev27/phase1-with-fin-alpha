import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    // Check for logged in user
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-[rgb(88,28,135)]'} transition-colors duration-300`}>
      <Navbar 
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        currentPlan={currentPlan}
      />
      {children}
    </div>
  );
};

export default Layout; 