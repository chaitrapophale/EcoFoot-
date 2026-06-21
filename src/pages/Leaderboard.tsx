import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'NatureNomad_Priya', avatar: '🧕', ecoTitle: 'Planet Champion', currentStreak: 87, footprintsRestored: 87, tasksCompleted: 624, level: 42, badge: '🌏' },
  { rank: 2, username: 'GreenWanderer_Kai', avatar: '🧑', ecoTitle: 'Earth Protector', currentStreak: 64, footprintsRestored: 64, tasksCompleted: 458, level: 38, badge: '🛡️' },
  { rank: 3, username: 'EcoFernanda', avatar: '👩', ecoTitle: 'Forest Keeper', currentStreak: 51, footprintsRestored: 51, tasksCompleted: 380, level: 31, badge: '🌲' },
  { rank: 4, username: 'SustainableSam', avatar: '👨', ecoTitle: 'Nature Guardian', currentStreak: 38, footprintsRestored: 38, tasksCompleted: 272, level: 24, badge: '🌿' },
  { rank: 5, username: 'EcoWarrior_Aiko', avatar: '🧒', ecoTitle: 'Eco Warrior', currentStreak: 27, footprintsRestored: 27, tasksCompleted: 187, level: 18, badge: '⚔️' },
  { rank: 6, username: 'LeafSteppers', avatar: '🧑‍🦰', ecoTitle: 'Green Explorer', currentStreak: 18, footprintsRestored: 18, tasksCompleted: 128, level: 12, badge: '🔍' },
  { rank: 7, username: 'PlantedSoil_Lena', avatar: '👩‍🦳', ecoTitle: 'Eco Starter', currentStreak: 11, footprintsRestored: 11, tasksCompleted: 72, level: 7, badge: '🌱' },
  { rank: 8, username: 'GlobeWalker_Raj', avatar: '👨‍🦱', ecoTitle: 'Seedling', currentStreak: 5, footprintsRestored: 5, tasksCompleted: 34, level: 3, badge: '🌾' },
];

export const Leaderboard: React.FC = () => {
  const { user, footprintsRestoredCount } = useApp();

  const rankColors: Record<number, string> = {
    1: 'text-amber-400',
    2: 'text-slate-300',
    3: 'text-amber-600'
  };

  return (
    <div className="min-h-screen px-4 py-20 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Community</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
          Eco Leaderboard
        </h1>
        <p className="text-slate-400">See how your ecological impact compares with the global eco-community.</p>
      </motion.div>

      {/* Your Rank (if logged in) */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-5 mb-6 border border-emerald-500/20"
        >
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Your Ranking</p>
          <div className="flex items-center gap-4">
            <div className="text-3xl">🌍</div>
            <div className="flex-1">
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-slate-500 text-sm">Seedling • Rank #9+</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-bold">{footprintsRestoredCount}</p>
              <p className="text-slate-600 text-xs">footprints</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((entry, i) => {
          const heights = ['h-28', 'h-36', 'h-24'];
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl mb-1">{entry.avatar}</div>
              <p className="text-xs text-white font-medium text-center mb-1 max-w-[80px] truncate">{entry.username}</p>
              <p className="text-xs text-emerald-400 mb-2">{entry.footprintsRestored} 🌿</p>
              <div className={`${heights[i]} w-20 rounded-t-xl flex items-center justify-center ${i === 1 ? 'bg-amber-500/25 border border-amber-500/30' : 'bg-white/5 border border-white/8'}`}>
                <span className={`text-2xl font-bold ${rankColors[entry.rank]}`}>
                  {i === 1 ? '🥇' : i === 0 ? '🥈' : '🥉'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="space-y-3">
        {MOCK_LEADERBOARD.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glass-panel rounded-2xl px-5 py-4 flex items-center gap-4 border transition-all ${entry.rank <= 3 ? 'border-amber-500/20' : 'border-white/5'}`}
          >
            {/* Rank */}
            <div className={`w-8 text-center font-bold text-lg ${rankColors[entry.rank] || 'text-slate-500'}`}>
              {entry.rank}
            </div>

            {/* Avatar */}
            <div className="text-2xl">{entry.avatar}</div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{entry.username}</p>
              <p className="text-slate-500 text-xs">{entry.badge} {entry.ecoTitle}</p>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-right">
              <div>
                <p className="text-orange-400 text-sm font-bold">{entry.currentStreak}</p>
                <p className="text-slate-600 text-xs">streak</p>
              </div>
              <div>
                <p className="text-emerald-400 text-sm font-bold">{entry.footprintsRestored}</p>
                <p className="text-slate-600 text-xs">restored</p>
              </div>
              <div>
                <p className="text-slate-300 text-sm font-bold">Lv.{entry.level}</p>
                <p className="text-slate-600 text-xs">level</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
