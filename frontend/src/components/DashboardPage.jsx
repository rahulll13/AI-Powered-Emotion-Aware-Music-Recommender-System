import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // <-- NEW: Import Link for navigation

// --- (UploadIcon component is unchanged) ---
const UploadIcon = () => (
  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m3-3H7" />
  </svg>
);

// --- NEW: Heart Icon component ---
// --- UPDATED: Heart Icon component ---
// It now accepts an isFavorite prop to change its style
const HeartIcon = ({ isFavorite }) => (
  <svg 
    className={`w-6 h-6 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
    fill={isFavorite ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

// --- NEW: Animation Variants for the Dashboard ---

// This will be the parent container for our cards
const dashboardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Each card will animate 0.2s after the previous
    }
  }
};

// This will be the animation for each card
const cardVariants = {
  hidden: { opacity: 0, y: 30 }, // Start invisible and 30px down
  visible: { 
    opacity: 1, 
    y: 0,         // Animate to visible and 0px (original position)
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }, 
};

export default function DashboardPage() {
  const { logout } = useAuth();
  
  // ... (All your existing refs)
  const videoRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const uploadCanvasRef = useRef(null);
  
  // ... (All your existing states)
  const [selectedFile, setSelectedFile] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  
  // --- NEW: Add a state for success messages (e.g., "Favorite Added!") ---
  const [successMessage, setSuccessMessage] = useState('');

  // --- NEW: State to track favorite song IDs ---
  // A Set is used for fast lookups (e.g., favoriteIds.has(song.id))
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // --- NEW: useEffect to fetch favorites on page load ---
  useEffect(() => {
    const fetchUserFavorites = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await api.get('/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // We get a list of song objects, but we just want the IDs
        const ids = response.data.map(song => song.video_id);
        setFavoriteIds(new Set(ids));
      } catch (err) {
        console.error("Failed to fetch user favorites:", err);
      }
    };
    fetchUserFavorites();
  }, []); // Empty array means this runs once when the component mounts

  // --- (clearResults function is unchanged) ---
  const clearResults = () => {
    setError(null);
    setResult(null);
    setDetectedEmotion(null);
    setRecommendations([]);
    setSuccessMessage(''); // Clear success message
    
    if (photoCanvasRef.current) {
      const ctx = photoCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, photoCanvasRef.current.width, photoCanvasRef.current.height);
    }
    
    if (uploadCanvasRef.current) {
      const ctx = uploadCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, uploadCanvasRef.current.width, uploadCanvasRef.current.height);
      uploadCanvasRef.current.style.display = 'none';
    }
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
      dropZone.style.display = 'flex';
    }
  }
  
  // --- (processImageForDetection is unchanged) ---
  const processImageForDetection = async (imageBlob, targetCanvasRef, isFromFile = false) => {
    setIsLoading(true);
    setSuccessMessage(''); // Clear success message
    setRecommendations([]);

    if (isFromFile) {
      const url = URL.createObjectURL(imageBlob);
      const img = new Image();
      img.onload = () => {
        if (targetCanvasRef.current) {
          const canvas = targetCanvasRef.current;
          const dropZone = document.getElementById('drop-zone');
          if (dropZone) dropZone.style.display = 'none';
          canvas.style.display = 'block';
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
        }
      }
      img.src = url;
    }

    const formData = new FormData();
    formData.append('file', imageBlob, 'capture.jpg');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("You are not logged in. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/detect-emotion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setResult({ ...response.data, targetCanvas: targetCanvasRef }); 
      setDetectedEmotion(response.data.emotion);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to detect emotion.');
      } else {
        setError('Network error. Could not connect to server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- (useEffect for [result] is unchanged) ---
  useEffect(() => {
    if (result && result.targetCanvas && result.targetCanvas.current) {
      const { emotion, region, targetCanvas } = result;
      const { x, y, w, h } = region;
      
      const ctx = targetCanvas.current.getContext('2d');
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
      
      ctx.fillStyle = '#3b82f6';
      ctx.font = '24px sans-serif';
      const text = `${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`;
      const textMetrics = ctx.measureText(text);
      ctx.fillRect(x, y - 30, textMetrics.width + 10, 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x + 5, y - 5);
    }
  }, [result]);

  // --- (File/Webcam handlers are unchanged) ---
  const handleFileChange = (event) => {
    clearResults();
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      stopWebcam();
      processImageForDetection(file, uploadCanvasRef, true); 
    }
  };

  const startWebcam = async () => {
    clearResults();
    setSelectedFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
      }
    } catch (err) {
      setError("Could not access webcam. Please check permissions.");
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsWebcamActive(false);
  };

  const handleWebcamDetect = () => {
    if (!isWebcamActive || !videoRef.current) return;
    
    clearResults(); 

    const video = videoRef.current;
    const canvas = photoCanvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    hiddenCanvas.width = video.videoWidth;
    hiddenCanvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    hiddenCanvas.getContext('2d').drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    stopWebcam();
    
    hiddenCanvas.toBlob((blob) => {
      processImageForDetection(blob, photoCanvasRef, false); 
    }, 'image/jpeg');
  };
  
  // --- (handleFetchMusic is unchanged) ---
  const handleFetchMusic = async () => {
    if (!detectedEmotion) {
      setError("Please detect an emotion first.");
      return;
    }
    
    setIsMusicLoading(true);
    setRecommendations([]);
    setError(null);
    setSuccessMessage(''); // Clear success message

    const token = localStorage.getItem('access_token');
    
    try {
      const response = await api.post('/recommendations', 
        { 
          emotion: detectedEmotion,
          language: language
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setRecommendations(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to get music.');
      } else {
        setError('Network error. Could not connect to server.');
      }
    } finally {
      setIsMusicLoading(false);
    }
  };

  // --- NEW: Add to Favorites Handler ---
  const handleAddToFavorites = async (song) => {
    // Clear old messages
    setError(null);
    setSuccessMessage('');

    // --- NEW: Check if already a favorite ---
    if (favoriteIds.has(song.video_id)) {
      setError(`'${song.title}' is already in your favorites.`);
      setTimeout(() => setError(''), 3000);
      return; // Don't call the API
    }
    
    const token = localStorage.getItem('access_token');

    try {
      await api.post('/favorites', 
        {
          video_id: song.video_id,
          title: song.title,
          channel_title: song.channel_title
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      // Show a success message
      setSuccessMessage(`'${song.title}' was added to your favorites!`);
      // Hide message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(`'${song.title}' is already in your favorites.`);
      } else {
        setError("Failed to add favorite. Please try again.");
      }
      // Hide error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };


  // --- RETURN STATEMENT (JSX) ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />

      {/* --- UPDATED HEADER --- */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-blue-400">EmotionMusic</h1>
        <nav className="flex items-center gap-6">
          {/* NEW: Link to Favorites Page */}
          <Link to="/favorites" className="text-lg text-gray-300 hover:text-blue-400 transition-colors">
            My Favorites
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

      {/* ... (Main Content, Detection Grid - all unchanged) ... */}
      <motion.div
        variants={dashboardContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-bold mb-6">Welcome to your Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Live Detection Module */}
          <motion.div
            className="bg-gray-800 p-8 rounded-xl shadow-2xl"
            variants={cardVariants}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center">Live Detection</h3>
            <div className="bg-gray-700 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <canvas 
                ref={photoCanvasRef} 
                className={`w-full h-full object-contain ${isWebcamActive ? 'hidden' : ''}`}
              />
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-contain ${!isWebcamActive ? 'hidden' : ''}`}
              />
            </div>
            <div className="flex gap-4 mt-6">
              {!isWebcamActive ? (
                <motion.button onClick={startWebcam} className="w-full p-3 rounded-lg bg-green-500 text-white font-bold" whileHover={{ scale: 1.05 }}>
                  Start Camera
                </motion.button>
              ) : (
                <motion.button onClick={stopWebcam} className="w-full p-3 rounded-lg bg-red-500 text-white font-bold" whileHover={{ scale: 1.05 }}>
                  Stop Camera
                </motion.button>
              )}
            </div>
            {isWebcamActive && (
              <motion.button
                onClick={handleWebcamDetect}
                className="w-full p-3 rounded-lg bg-blue-500 text-white font-bold mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Detecting...' : 'Take Snapshot'}
              </motion.button>
            )}
          </motion.div>
          
          {/* Image Upload Module */}
          <motion.div
            className="bg-gray-800 p-8 rounded-xl shadow-2xl"
            variants={cardVariants}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center">Upload Image</h3>
            <div className="bg-gray-700 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <canvas 
                ref={uploadCanvasRef} 
                className="w-full h-full object-contain"
                style={{ display: 'none' }}
              />
              <div 
                id="drop-zone"
                className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors w-full h-full"
              >
                <UploadIcon />
                <p className="mt-4 text-gray-400">Drag & drop, or</p>
                <p className="text-blue-400 font-semibold">click to select file</p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            {selectedFile && (
              <div className="bg-gray-700 p-4 rounded-lg mt-6">
                <span className="text-gray-300 truncate">{selectedFile.name}</span>
              </div>
            )}
          </motion.div>
        </div> {/* End of grid */}

        {/* --- SHARED RESULTS AREA (WITH NEW LANGUAGE SELECTOR) --- */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-8 p-4 bg-red-800 text-red-100 border border-red-700 rounded-lg text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* --- NEW: Success Message --- */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="mt-8 p-4 bg-green-800 text-green-100 border border-green-700 rounded-lg text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {detectedEmotion && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <h4 className="text-xl text-gray-400">We detected:</h4>
              <p className="text-6xl font-bold capitalize text-blue-400 mt-2">
                {detectedEmotion}
              </p>

              <div className="mt-6 max-w-sm mx-auto">
                <h5 className="text-lg font-semibold text-gray-300 mb-3">Select Music Language:</h5>
                <div className="flex justify-center gap-4">
                  {['English', 'Hindi', 'Any'].map((lang) => (
                    <label key={lang} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value={lang.toLowerCase()}
                        checked={language === lang.toLowerCase()}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="peer sr-only"
                      />
                      <span className="block px-6 py-2 rounded-lg bg-gray-700 text-gray-300 peer-checked:bg-blue-500 peer-checked:text-white transition-colors">
                        {lang}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handleFetchMusic}
                className="mt-6 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isMusicLoading}
              >
                {isMusicLoading ? 'Finding Music...' : `Get ${detectedEmotion} Music`}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* --- UPDATED RECOMMENDATIONS AREA --- */}
        <motion.div
          className="bg-gray-800 p-8 rounded-xl shadow-2xl mt-8"
          variants={cardVariants}
          >
          <h3 className="text-2xl font-semibold mb-6">Your Music</h3>
          
          {/* ... (isMusicLoading and no recommendations text is unchanged) ... */}
          <AnimatePresence>
            {isMusicLoading && (
              <motion.div className="text-center text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Loading...
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {recommendations.map((song, index) => (
                <motion.div
                  key={song.video_id}
                  className="bg-gray-700 rounded-lg overflow-hidden flex items-center group transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${song.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-4 hover:bg-gray-600"
                  >
                    <img src={song.thumbnail_url} alt={song.title} className="w-24 h-24 object-cover" />
                    <div className="p-4 pr-6">
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {song.title}
                      </h4>
                      <p className="text-sm text-gray-400">{song.channel_title}</p>
                    </div>
                  </a>
                  {/* --- UPDATED: FAVORITE BUTTON --- */}
                  <motion.button
                    onClick={() => handleAddToFavorites(song)}
                    className="p-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Add to favorites"
                  >
                    {/* The icon now gets the isFavorite prop */}
                    <HeartIcon isFavorite={favoriteIds.has(song.video_id)} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {!isMusicLoading && recommendations.length === 0 && (
             <p className="text-gray-400">Detect your emotion to get started.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
