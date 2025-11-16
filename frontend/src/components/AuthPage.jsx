import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from "../api";
import { useNavigate } from 'react-router-dom';

// --- ANIMATION VARIANTS ---
// This will animate the form container
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.5 } },
};

// This will stagger the children (form fields)
const fieldsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Each child will animate 0.1s after the previous
    }
  }
};

// This is the animation for each individual form field
const fieldItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};


export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // We now have 3 modes: 'login', 'signup', 'forgot'
  const [formMode, setFormMode] = useState('login'); 
  
  // Fields for all forms
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States for messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Main Login/Signup Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (formMode === 'login') {
        const response = await api.post('/login', { email, password });
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        login(response.data.access_token);
        navigate('/dashboard'); 

      } else if (formMode === 'signup') {
        await api.post('/signup', { username, email, password });
        setSuccess('Signup successful! Please log in.');
        setFormMode('login'); // Flip to login form
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'An error occurred.');
      } else {
        setError('Could not connect to the server.');
      }
    }
  };

  // --- NEW: Forgot Password Handler ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/forgot-password', { email });
      setSuccess('Reset link sent! Check your email.');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'An error occurred.');
      } else {
        setError('Could not connect to the server.');
      }
    }
  };
  
  // --- This function renders the main form (Login or Signup) ---
  const renderMainForm = () => (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8">
        {formMode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>

      {/* --- Message Banners --- */}
      {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-lg text-center">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-lg text-center">{success}</div>}

      {/* --- Staggered Fields Container --- */}
      <motion.div
        variants={fieldsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Signup-only field */}
        {formMode === 'signup' && (
          <motion.div className="mb-4" variants={fieldItemVariants}>
            <label className="block text-gray-400 mb-2" htmlFor="username">Username</label>
            <input
              type="text" id="username" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>
        )}

        {/* Email Field */}
        <motion.div className="mb-4" variants={fieldItemVariants}>
          <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </motion.div>

        {/* Password Field */}
        <motion.div className="mb-6" variants={fieldItemVariants}>
          <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </motion.div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {formMode === 'login' ? 'Login' : 'Sign Up'}
      </motion.button>
      
      {/* --- NEW: Forgot Password Button --- */}
      {formMode === 'login' && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => { setFormMode('forgot'); setError(''); setSuccess(''); }}
            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      )}
    </form>
  );
  
  // --- NEW: This function renders the Forgot Password form ---
  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="bg-gray-800 p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8">Reset Password</h2>

      {/* --- Message Banners --- */}
      {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-lg text-center">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-lg text-center">{success}</div>}

      <p className="text-gray-400 text-center mb-6">Enter your email and we'll send you a link to reset your password.</p>
      
      <motion.div
        variants={fieldsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-6" variants={fieldItemVariants}>
          <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </motion.div>
      </motion.div>
      
      <motion.button
        type="submit"
        className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Send Reset Link
      </motion.button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <motion.div
        className="w-full max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        key={formMode} // This tells Framer Motion to re-animate when the mode changes
      >
        {/* Show the correct form based on the 'formMode' state */}
        {formMode === 'forgot' ? renderForgotPasswordForm() : renderMainForm()}

        {/* Toggle buttons at the bottom */}
        <div className="text-center mt-6">
          <button 
            onClick={() => {
              setFormMode(formMode === 'login' ? 'signup' : 'login');
              setError('');
              setSuccess('');
            }}
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            {formMode === 'login' && "Don't have an account? Sign Up"}
            {formMode === 'signup' && "Already have an account? Login"}
            {formMode === 'forgot' && "Back to Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}