import React, { useState, useContext } from 'react';
import { Shield, Clock, Crown, Diamond } from 'lucide-react';
import api from '../config/api';
import { UserContext } from '../App';

const plans = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: '₹599',
    period: '/month',
    icon: Shield,
    features: [
      'Base plan',
      'FinInspect (Only stock analysis)'
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '₹999',
    period: '/month',
    icon: Clock,
    features: [
      'Base plan',
      'FinInspect (Stock)',
      'Personal Finance Navigator'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₹2499',
    period: '/month',
    icon: Crown,
    features: [
      'Base plan',
      'FinInspect (Stock + Sector)',
      'Personal Finance',
      'API integration (For equity trading)'
    ],
    popular: true
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '₹6999',
    period: '/month',
    icon: Diamond,
    features: [
      'Base plan',
      'FinInspect (Stock + Sector)',
      'Personal Finance',
      'API Integration (Equity, F&O, Crypto)'
    ]
  }
];

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, setCurrentUser, currentPlan, setCurrentPlan } = useContext(UserContext);

  const handlePlanChange = async (planId) => {
    if (loading) return;
    if (!currentUser) {
      setError('Please login to change subscription');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/subscription/update', {
        subscriptionType: planId
      });

      if (response.data.success) {
        // Update user context with new subscription
        const updatedUser = {
          ...currentUser,
          subscriptionType: planId,
          subscriptionExpiry: response.data.data.subscriptionExpiry
        };
        setCurrentUser(updatedUser);
        setCurrentPlan(planId);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      } else {
        setError(response.data.message || 'Failed to update subscription');
      }
    } catch (err) {
      console.error('Subscription update error:', err);
      setError(err.response?.data?.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-purple-900 dark:text-white sm:text-4xl font-montserrat">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-purple-600 dark:text-purple-300 font-lato">
            Select the perfect plan that suits your investment needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800 flex flex-col
                  ${plan.popular ? 'ring-2 ring-purple-500' : 'border border-purple-100 dark:border-purple-800'}
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transition-shadow duration-300'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-purple-900 dark:text-white text-center font-montserrat">
                  {plan.name}
                </h3>

                <div className="mt-4 text-center">
                  <span className="text-3xl font-extrabold text-purple-900 dark:text-white font-montserrat">
                    {plan.price}
                  </span>
                  <span className="text-base font-medium text-purple-500 dark:text-purple-300 font-lato">
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-6 space-y-4 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300 font-lato">{feature}</p>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={loading || isCurrentPlan}
                  className={`mt-8 w-full px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300
                    ${isCurrentPlan 
                      ? 'bg-purple-100 text-purple-800 cursor-not-allowed'
                      : loading
                        ? 'bg-purple-400 text-white cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                    }`}
                >
                  {isCurrentPlan ? (
                    <span className="flex items-center justify-center">
                      <Crown className="h-4 w-4 mr-2" />
                      Current Plan
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Choose Plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 text-center text-red-600 dark:text-red-400 font-lato">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription; 