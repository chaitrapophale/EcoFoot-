import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const BADGE_EMOJIS: Record<string, string> = {
  first_step: '👣',
  eco_starter: '🌱',
  green_explorer: '🔍',
  eco_warrior: '⚔️',
  nature_guardian: '🌿',
  forest_keeper: '🌲',
  earth_protector: '🛡️',
  planet_champion: '🌍',
};

export const Achievements: React.FC = () => {
  const { achievements } = useApp();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen px-4 py-20 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Rewards</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
          Achievements
        </h1>
        <p className="text-slate-400">
          {unlockedCount}/{achievements.length} badges unlocked — keep restoring your footprint!
        </p>
      </motion.div>

      {/* Progress ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-10"
      >
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="50" fill="none"
              stroke="#10b981" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - unlockedCount / achievements.length) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{unlockedCount}</span>
            <span className="text-slate-500 text-xs">of {achievements.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`relative glass-panel rounded-2xl p-5 text-center border transition-all duration-300 ${
              ach.unlocked
                ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
                : 'border-white/5 opacity-45 grayscale'
            }`}
          >
            {/* Glow for unlocked */}
            {ach.unlocked && (
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 blur-sm" />
            )}

            <div className="relative">
              <div className={`text-5xl mb-3 ${ach.unlocked ? '' : 'opacity-30'}`}>
                {BADGE_EMOJIS[ach.id] || '🎖️'}
              </div>

              {ach.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: i * 0.07 + 0.3 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <span className="text-white text-[10px]">✓</span>
                </motion.div>
              )}

              <h3 className={`text-sm font-semibold mb-1 ${ach.unlocked ? 'text-white' : 'text-slate-600'}`}>
                {ach.name}
              </h3>
              <p className="text-slate-600 text-xs leading-snug">{ach.description}</p>

              {ach.unlocked && ach.unlockedAt && (
                <p className="text-emerald-500 text-[10px] mt-2">
                  Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                </p>
              )}

              {!ach.unlocked && (
                <div className="mt-2 text-slate-700 text-xs">🔒 Locked</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
