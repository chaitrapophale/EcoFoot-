import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 150 }}
    >
      <div className="text-9xl mb-6 animate-float-slow">🌿</div>
      <h1 className="text-8xl font-bold text-gradient-emerald mb-4" style={{ fontFamily: 'Lora, serif' }}>404</h1>
      <h2 className="text-2xl font-semibold text-white mb-3">Lost in the Forest</h2>
      <p className="text-slate-400 mb-8 max-w-sm">
        Looks like you wandered off the eco trail! This path doesn't lead anywhere. Let's get you back to the forest.
      </p>
      <Link to="/" id="notfound-home-btn">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
        >
          Return to Home 🌱
        </motion.button>
      </Link>
    </motion.div>
  </div>
);
