import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, DollarSign, Target, PieChart, Wallet } from 'lucide-react';
import OnboardingTour from '../components/OnboardingTour';
import { personalFinanceTourSteps } from '../config/tourSteps';
import { ThemeContext } from '../App';

const PersonalFinance = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);

  // Financial Goals State
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', deadline: '' });

  // Budget State
  const [budget, setBudget] = useState({
    income: '',
    expenses: {
      housing: '',
      transportation: '',
      food: '',
      utilities: '',
      entertainment: '',
      other: ''
    }
  });

  // Investment Tracking State
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    type: '',
    amount: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Handle Goals
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setNewGoal({ title: '', targetAmount: '', deadline: '' });
    }
  };

  // Handle Budget
  const handleBudgetChange = (category, value) => {
    if (category === 'income') {
      setBudget({ ...budget, income: value });
    } else {
      setBudget({
        ...budget,
        expenses: { ...budget.expenses, [category]: value }
      });
    }
  };

  // Handle Investments
  const handleAddInvestment = (e) => {
    e.preventDefault();
    if (newInvestment.type && newInvestment.amount) {
      setInvestments([...investments, { ...newInvestment, id: Date.now() }]);
      setNewInvestment({ type: '', amount: '', date: '', notes: '' });
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
        {/* Add OnboardingTour */}
        <OnboardingTour steps={personalFinanceTourSteps} pageName="personalFinance" />

        {/* Goals Section */}
        <div className="goals-section mb-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Target className="mr-2" /> Financial Goals
          </h2>
          <form onSubmit={handleAddGoal} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Goal Title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 flex-grow"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-lg hover:opacity-90"
              >
                <Plus />
              </button>
            </div>
          </form>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{goal.title}</h3>
                  <p className="text-sm text-gray-600">Target: ₹{goal.targetAmount}</p>
                  <p className="text-sm text-gray-600">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Section */}
        <div className="budget-section mb-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Wallet className="mr-2" /> Budget Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Income</h3>
              <input
                type="number"
                placeholder="Monthly Income"
                value={budget.income}
                onChange={(e) => handleBudgetChange('income', e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Expenses</h3>
              <div className="space-y-4">
                {Object.entries(budget.expenses).map(([category, amount]) => (
                  <div key={category} className="flex items-center gap-4">
                    <label className="capitalize w-32">{category}:</label>
                    <input
                      type="number"
                      placeholder={`Monthly ${category}`}
                      value={amount}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                      className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investments Section */}
        <div className="investments-section bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <PieChart className="mr-2" /> Investment Tracking
          </h2>
          <form onSubmit={handleAddInvestment} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={newInvestment.type}
              onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Type</option>
              <option value="stocks">Stocks</option>
              <option value="mutual_funds">Mutual Funds</option>
              <option value="fixed_deposits">Fixed Deposits</option>
              <option value="real_estate">Real Estate</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newInvestment.amount}
              onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              value={newInvestment.date}
              onChange={(e) => setNewInvestment({ ...newInvestment, date: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-lg hover:opacity-90"
            >
              Add Investment
            </button>
          </form>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold capitalize">{investment.type}</h3>
                  <p className="text-sm text-gray-600">Amount: ₹{investment.amount}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(investment.date).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setInvestments(investments.filter(i => i.id !== investment.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalFinance;