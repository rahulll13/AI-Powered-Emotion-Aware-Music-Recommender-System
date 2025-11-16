import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
// NEW: Import the 'Code' icon
import { Camera, Music, Zap, Smile, Search, Play, Brain, Shield, Sparkles, Code } from 'lucide-react';

// (Animation variants are unchanged)
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, type: 'spring' }
  }
};

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-white">
      
      {/* --- Music Note Animation --- */}
      <div className="music-notes-bg">
        <span className="note">♪</span>
        <span className="note">♫</span>
        <span className="note">♪</span>
        <span className="note">♫</span>
        <span className="note">♪</span>
        <span className="note">♫</span>
        <span className="note">♪</span>
        <span className="note">♫</span>
        <span className="note">♪</span>
      </div>

      {/* --- Main Content --- */}
      <div className="content-on-top">
        <Navbar />
        
        {/* (Hero Section - Unchanged) */}
        <div className="relative pt-32 pb-24 md:pt-48 md:pb-40 flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-gray-900 z-0"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Music that *feels* you.
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our AI analyzes your unique emotion to recommend the perfect playlist, 
              connecting you with music that truly understands your mood.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                to="/login"
                className="px-10 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              >
                Discover Your Vibe
              </Link>
            </motion.div>
          </div>
        </div>

        {/* (Features Section - Unchanged) */}
        <motion.section 
          id="features" 
          className="py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Camera className="w-12 h-12 text-blue-500" />}
                title="Real-time Emotion AI"
                description="Use your webcam or upload a photo. Our advanced AI detects your emotion in real-time with high accuracy."
              />
              <FeatureCard 
                icon={<Music className="w-12 h-12 text-blue-500" />}
                title="Vast Music Library"
                description="Powered by the YouTube API, get instant access to millions of songs, from global hits to hidden gems."
              />
              <FeatureCard 
                icon={<Zap className="w-12 h-12 text-blue-500" />}
                title="Multi-Language Support"
                description="Not just English. Get music recommendations in Hindi and other languages to perfectly match your preference."
              />
            </div>
          </div>
        </motion.section>

        {/* (How It Works Section - Unchanged) */}
        <motion.section 
          id="how-it-works" 
          className="py-24 bg-gray-800"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <HowItWorksStep 
                icon={<Smile className="w-16 h-16 text-blue-500" />}
                step="Step 1: Detect Mood"
                description="Allow webcam access or upload a photo. Our AI instantly analyzes your facial expression."
              />
              <HowItWorksStep 
                icon={<Search className="w-16 h-16 text-blue-500" />}
                step="Step 2: Choose Vibe"
                description="Select your preferred music language—English, Hindi, or let us pick from any."
              />
              <HowItWorksStep 
                icon={<Play className="w-16 h-16 text-blue-500" />}
                step="Step 3: Press Play"
                description="Get a curated playlist of 10 songs. Listen, 'like' your favorites, and discover new music."
              />
            </div>
          </div>
        </motion.section>

        {/* (Why Choose Us Section - Unchanged) */}
        <motion.section 
          id="why-choose-us" 
          className="py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose Our App?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Brain className="w-12 h-12 text-blue-500" />}
                title="Truly Personal Curation"
                description="Go beyond 'genres.' Our app curates music based on your *actual* emotional state, not just your listening history."
              />
              <FeatureCard 
                icon={<Sparkles className="w-12 h-12 text-blue-500" />}
                title="Instant Discovery"
                description="No more endless searching. Get a fresh, relevant playlist in seconds just by showing your face."
              />
              <FeatureCard 
                icon={<Shield className="w-12 h-12 text-blue-500" />}
                title="Privacy Focused"
                description="Your images are processed securely and are never stored. Your emotion data is temporary and private."
              />
            </div>
          </div>
        </motion.section>
        
        {/* --- NEW: Developer Section --- */}
        <motion.section 
          id="developer" 
          className="py-24 bg-gray-800"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Code className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-4xl font-bold text-center mb-6">Developed By</h2>
            <p className="text-3xl font-semibold text-white mb-3">
              Rahul Kumar Sinha
            </p>
            <p className="text-xl text-gray-300">
              A third-year Information Technology student at BIT Sindri, Dhanbad.
            </p>
          </div>
        </motion.section>

        <Footer />
      </div> {/* End of content-on-top div */}
    </div>
  );
}

// (Helper components are unchanged)
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const HowItWorksStep = ({ icon, step, description }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center justify-center w-32 h-32 bg-gray-700 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{step}</h3>
    <p className="text-gray-300 max-w-xs">{description}</p>
  </div>
);