import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-purple-100/20 dark:border-purple-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-purple-900 dark:text-white">
                Fin.AI
              </span>
            </Link>
            <p className="text-purple-800/80 dark:text-gray-400 text-sm mb-6">
              Your AI-powered financial companion for smarter investment decisions.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-purple-800/20 transition-colors">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-purple-800/20 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-purple-800/20 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-purple-900 dark:text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/fundamentals" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Fundamentals
                </Link>
              </li>
              <li>
                <Link to="/fininspect" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  FinInspect
                </Link>
              </li>
              <li>
                <Link to="/personal-finance" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Personal Finance
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-purple-900 dark:text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-purple-900 dark:text-white font-semibold mb-4">Contact & Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@finai.com" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors flex items-center gap-2">
                  <Mail size={14} />
                  support@finai.com
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-purple-100/20 dark:border-purple-900/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <span className="text-xs text-purple-900 dark:text-gray-300">❤️</span>
              </div>
              <span className="text-sm text-purple-800/80 dark:text-gray-400">
                Made with love in India
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-purple-800/80 dark:text-gray-400 hover:text-purple-900 dark:hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <span className="text-purple-800/60 dark:text-gray-500 text-sm">
                © 2024 Fin.AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 