import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400">
          © {new Date().getFullYear()} EmotionMusic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}