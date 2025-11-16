import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // To link back to dashboard

export default function FavoritesPage() {
  const { logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorites when the component loads
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');

      try {
        const response = await api.get('/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavorites(response.data);
      } catch (err) {
        setError("Failed to fetch your favorites.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-blue-400">EmotionMusic</h1>
        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="text-lg text-gray-300 hover:text-blue-400 transition-colors">
            Dashboard
          </Link>
          <motion.button
            onClick={logout}
            className="px-4 py-2 bg-red-500 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </nav>
      </header>

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold mb-8">My Favorite Songs</h2>
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          {isLoading && (
            <p className="text-center text-gray-400">Loading your favorites...</p>
          )}
          
          {error && (
            <p className="text-center text-red-400">{error}</p>
          )}

          {!isLoading && !error && favorites.length === 0 && (
            <p className="text-center text-gray-400">You haven't added any favorites yet. Go back to the dashboard to find some!</p>
          )}

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {favorites.map((song, index) => (
                <motion.a
                  key={song.video_id}
                  href={`https://www.youtube.com/watch?v=${song.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 rounded-lg overflow-hidden flex items-center gap-4 group hover:bg-gray-600 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {song.song_title}
                    </h4>
                    <p className="text-sm text-gray-400">{song.channel_title}</p>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}