import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { LivingFootprint } from '../components/LivingFootprint';
import { Flame, Star, Calendar, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TITLES = ['Seedling', 'Green Explorer', 'Eco Warrior', 'Nature Guardian', 'Forest Keeper', 'Earth Protector', 'Planet Champion'];

export const Profile: React.FC = () => {
  const { user, currentStreak, longestStreak, footprintsRestoredCount, achievements, tasks, dayRecords } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl text-white font-semibold mb-2">Not signed in</h2>
          <p className="text-slate-400 mb-6">Sign in to view and save your profile</p>
          <button id="profile-signin-btn" onClick={() => navigate('/auth')} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-semibold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const taskRatio = totalCount > 0 ? completedCount / totalCount : 0;
  const restorationPct = Math.round(taskRatio * 80);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const ecoTitle = TITLES[Math.min(unlockedCount, TITLES.length - 1)];
  const daysActive = Object.keys(dayRecords).length;

  // Weekly summary (last 7 days)
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split('T')[0];
    return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), record: dayRecords[ds] };
  });

  return (
    <div className="min-h-screen px-4 py-20 max-w-4xl mx-auto">
      {/* Cover and Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {/* Cover */}
        <div className="h-40 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 mb-[-50px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.2),transparent)] pointer-events-none" />
          <div className="absolute bottom-4 right-4 text-slate-700 text-sm">🌿 {ecoTitle}</div>
        </div>

        {/* Avatar */}
        <div className="relative z-10 ml-8 flex items-end gap-4">
          <div className="w-24 h-24 rounded-2xl border-4 border-[#0b130e] bg-emerald-700/40 flex items-center justify-center text-4xl shadow-xl">
            🌍
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>
              {user.username}
              {user.isGuest && <span className="ml-2 text-xs text-slate-500 font-normal">(Guest)</span>}
            </h1>
            <p className="text-emerald-400 text-sm">{ecoTitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Flame, label: 'Current Streak', value: `${currentStreak}d`, color: 'orange' },
          { icon: Star, label: 'Longest Streak', value: `${longestStreak}d`, color: 'amber' },
          { icon: Leaf, label: 'Footprints', value: footprintsRestoredCount, color: 'emerald' },
          { icon: Calendar, label: 'Days Active', value: daysActive, color: 'teal' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-panel rounded-2xl p-4 text-center border border-white/5"
          >
            <stat.icon className={`w-5 h-5 text-${stat.color}-400 mx-auto mb-2`} />
            <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
            <div className="text-slate-600 text-xs">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Footprint */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 border border-white/5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Today's Footprint</h2>
          <LivingFootprint percentage={restorationPct} />
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-panel rounded-3xl p-6 border border-white/5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Activity</h2>
          <div className="flex items-end justify-between gap-2 h-28">
            {weekDays.map((day, i) => {
              const pct = day.record ? day.record.restorationPercentage : 0;
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-1">
                  <motion.div
                    className={`w-full rounded-t-lg ${day.record?.restored ? 'bg-emerald-500/60' : pct > 0 ? 'bg-amber-500/40' : 'bg-white/8'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, pct)}%` }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    style={{ maxHeight: '100%' }}
                  />
                  <span className="text-slate-600 text-[10px]">{day.label}</span>
                </div>
              );
            })}
          </div>

          {/* Achievements preview */}
          <div className="mt-5 pt-5 border-t border-white/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-sm font-medium">Achievements</h3>
              <span className="text-emerald-400 text-xs">{unlockedCount}/{achievements.length}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {achievements.slice(0, 6).map(ach => (
                <div
                  key={ach.id}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${ach.unlocked ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-white/5 grayscale opacity-30'}`}
                >
                  {['👣', '🌱', '🔍', '⚔️', '🌿', '🌲'][achievements.indexOf(ach)] || '🎖️'}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
