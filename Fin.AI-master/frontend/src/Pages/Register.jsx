import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Create an axios instance with a base URL and default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Popup = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <p className="text-lg font-semibold text-purple-700">{message}</p>
    </div>
  </div>
);

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!(firstname && lastname && email && password)) {
      setError("All input is required");
      return;
    }

    try {
      console.log('Sending registration request:', { firstname, lastname, email });
      const response = await api.post('/api/auth/register', {
        firstname,
        lastname,
        email,
        password
      });
      
      console.log('Full registration response:', response);
      console.log('Registration response data:', response.data);

      if (response.data && response.data.user && response.data.user._id) {
        console.log('Registration successful, user data:', response.data.user);
        // Store user data in localStorage (excluding sensitive info like password)
        const { password, ...userDataToStore } = response.data.user;
        localStorage.setItem('userData', JSON.stringify(userDataToStore));
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/login');
        }, 2000);
      } else {
        console.log('Registration failed, no user ID in response');
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Full error object:", err);
      if (err.response) {
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        console.error("Error headers:", err.response.headers);
        
        if (err.response.status === 409) {
          setError("User Already Exists. Please Login");
        } else if (err.response.status === 400) {
          setError(err.response.data.message || "Validation Error");
        } else {
          setError(err.response.data.message || "An error occurred during registration");
        }
      } else if (err.request) {
        console.error("Error request:", err.request);
        setError("No response received from the server. Please try again later.");
      } else {
        console.error('Error message:', err.message);
        setError("An error occurred during registration. Please try again.");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 flex flex-col py-6 px-6 lg:px-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-12 w-auto" />
        <Link to="/" className="text-white hover:text-purple-200 transition-colors duration-300 font-montserrat">
          Back to Home
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-95 py-8 px-4 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
            {error && (
              <div className="mb-4 text-red-500 text-center font-lato">
                {typeof error === 'string' ? error : 'An error occurred'}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-purple-700 font-montserrat">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-purple-300 rounded-md shadow-sm placeholder-purple-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-lato"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-purple-700 font-montserrat">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-purple-300 rounded-md shadow-sm placeholder-purple-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-lato"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-700 font-montserrat">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-purple-300 rounded-md shadow-sm placeholder-purple-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-lato"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-700 font-montserrat">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-purple-300 rounded-md shadow-sm placeholder-purple-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-lato"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 font-montserrat"
                >
                  Register <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-purple-500 font-lato">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 font-montserrat"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && <Popup message="Registration successful! Redirecting to login..." />}
    </div>
  );
};

export default Register;