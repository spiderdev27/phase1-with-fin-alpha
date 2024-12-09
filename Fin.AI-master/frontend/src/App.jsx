import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext, useEffect } from 'react';
import Home from './Pages/Home';
import About from './Pages/About';
import Login from './Pages/login';
import Register from './Pages/Register';
import Fundamentals from './Pages/Fundamentals';
import FinInspect from './Pages/FinInspect';
import PersonalFinance from './Pages/PersonalFinance';
import Dashboard from './Pages/Dashboard/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FinAlpha from './Pages/FinAlpha';
import './App.css';

// Create contexts
export const ThemeContext = createContext();
export const UserContext = createContext();

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ currentUser, setCurrentUser, currentPlan, setCurrentPlan }}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className={`App ${theme}`}>
            <Routes>
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
              <Route path="/fundamentals" element={<><Navbar /><Fundamentals /><Footer /></>} />
              <Route path="/fininspect" element={<><Navbar /><FinInspect /><Footer /></>} />
              <Route path="/personal-finance" element={<><Navbar /><PersonalFinance /><Footer /></>} />
              <Route path="/dashboard/*" element={<><Navbar /><Dashboard /><Footer /></>} />
              <Route path="/finalpha" element={<><Navbar /><FinAlpha /><Footer /></>} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;