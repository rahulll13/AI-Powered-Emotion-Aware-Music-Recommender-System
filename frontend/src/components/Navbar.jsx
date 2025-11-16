import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music4 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Music4 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">EmotionMusic</span>
          </Link>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#why-choose-us" className="text-gray-300 hover:text-blue-400 transition-colors">Why Choose Us?</a>
            <a href="#developer" className="text-gray-300 hover:text-blue-400 transition-colors">Developer</a>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-6">
            {/* This is the "Login" button, it links to the default login state */}
            <Link 
              to="/login"
              className="text-gray-300 hover:text-blue-400 font-semibold transition-colors"
            >
              Login
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* --- THIS IS THE CHANGE --- */}
              {/* This "Get Started" button now links to the signup state */}
              <Link 
                to="/login"
                state={{ mode: 'signup' }} 
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}