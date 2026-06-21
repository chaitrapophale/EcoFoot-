import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, PenLine, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChooseJourney: React.FC = () => {
  const { setJourney } = useApp();
  const navigate = useNavigate();

  const handleChoose = (type: 'ai' | 'custom') => {
    setJourney(type);
    navigate(type === 'ai' ? '/journey/ai' : '/journey/custom');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.07)_0%,_transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Your Eco Journey</p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: 'Lora, serif' }}>
          How would you like to <span className="text-gradient-emerald">start?</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Choose how you want to build your daily sustainability habits.
          You can always switch later.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* AI Journey Card */}
        <motion.button
          id="choose-ai-journey-btn"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoose('ai')}
          className="relative text-left glass-panel rounded-3xl p-8 border border-emerald-500/15 hover:border-emerald-500/35 transition-all duration-300 group shadow-xl shadow-black/20"
        >
          {/* Glow on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-6">
            <Bot className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
            AI Creates My Journey
          </h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Answer a quick questionnaire about your lifestyle and our AI will craft a personalized daily eco-checklist — optimized for maximum positive impact.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Personalized', 'Smart', 'Effortless', 'Adaptive'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
            <span>Get started</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.button>

        {/* Custom Journey Card */}
        <motion.button
          id="choose-custom-journey-btn"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoose('custom')}
          className="relative text-left glass-panel rounded-3xl p-8 border border-teal-500/15 hover:border-teal-500/35 transition-all duration-300 group shadow-xl shadow-black/20"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center mb-6">
            <PenLine className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Create My Own Journey
          </h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Full creative control. Build your own custom eco-checklist with tasks across 8 categories — set your own pace, priorities and goals.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Flexible', 'Custom', 'In Control', 'Creative'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs rounded-full border border-teal-500/20">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold group-hover:gap-3 transition-all">
            <span>Start building</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-slate-600 text-sm"
      >
        <Link to="/" id="back-home-from-journey-link" className="hover:text-slate-400 transition-colors">
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
};
