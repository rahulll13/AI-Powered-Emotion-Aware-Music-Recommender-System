import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from "../api";
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useParams to read the URL

// --- (Animation variants - same as AuthPage) ---
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.5 } },
};

const fieldItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function ResetPasswordPage() {
  const { token } = useParams(); // <-- Reads the token from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Call the backend API we already built
      await api.post('/reset-password', {
        token: token,
        password: password
      });
      
      setSuccess('Password reset successful! You can now log in.');
      
      // After 3 seconds, redirect to the login page
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'An error occurred.');
      } else {
        setError('Could not connect to the server.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <motion.div
        className="w-full max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">Set New Password</h2>

          {error && <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-lg text-center">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-lg text-center">{success}</div>}

          <motion.div variants={fieldItemVariants} className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>
          
          <motion.button
            type="submit"
            className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Update Password
          </motion.button>
        </form>

        {/* Link to go back to Login */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}