import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { LivingFootprint } from '../components/LivingFootprint';

interface Milestone {
  days: number;
  name: string;
  description: string;
  emoji: string;
}

const MILESTONES: Milestone[] = [
  { days: 1,   name: 'First Step',       description: 'Your journey begins', emoji: '👣' },
  { days: 7,   name: 'Seedling',         description: 'One week of restoration', emoji: '🌱' },
  { days: 10,  name: 'Forest Entrance',  description: 'Enter the Forest!', emoji: '🌲' },
  { days: 25,  name: 'River Crossing',   description: 'Cross the River', emoji: '🏞️' },
  { days: 50,  name: 'Flower Valley',    description: 'The valley blooms!', emoji: '🌸' },
  { days: 75,  name: 'Ancient Forest',   description: 'Ancient trees call you', emoji: '🌳' },
  { days: 100, name: 'Nature Sanctuary', description: 'The ultimate sanctuary', emoji: '✨' },
];

// Generate mock trail from day records
const generateTrailFootprints = (dayRecords: Record<string, any>, totalDays: number) => {
  // Create an array of completed days + simulated past days for visual richness
  const days = Object.values(dayRecords).map((record: any) => ({
    date: record.dateString,
    restorationPct: record.restorationPercentage,
    restored: record.restored
  }));

  // Add simulated days for demo purposes
  const simulatedCount = Math.min(10, totalDays);
  for (let i = 1; i <= simulatedCount; i++) {
    if (days.length < 20) {
      const d = new Date();
      d.setDate(d.getDate() - i - 1);
      days.push({ date: d.toISOString().split('T')[0], restorationPct: 60 + Math.random() * 40, restored: Math.random() > 0.3 });
    }
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
};

export const ForestTrail: React.FC = () => {
  const { dayRecords, footprintsRestoredCount } = useApp();
  const [selectedDay, setSelectedDay] = useState<null | { date: string; restorationPct: number; restored: boolean }>(null);

  const trailFootprints = generateTrailFootprints(dayRecords, footprintsRestoredCount);
  const totalDays = trailFootprints.length;

  const unlockedMilestones = MILESTONES.filter(m => totalDays >= m.days);
  const nextMilestone = MILESTONES.find(m => totalDays < m.days);

  return (
    <div className="min-h-screen px-4 py-20 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Your Trail</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
          Forest Trail
        </h1>
        <p className="text-slate-400">Every completed day becomes a footprint on your trail. Watch your forest grow.</p>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Days on Trail', value: totalDays, emoji: '📅' },
          { label: 'Footprints Restored', value: footprintsRestoredCount, emoji: '👣' },
          { label: 'Milestones Unlocked', value: unlockedMilestones.length, emoji: '🏆' },
          { label: 'Days to Next Milestone', value: nextMilestone ? nextMilestone.days - totalDays : 0, emoji: '🎯' },
        ].map(stat => (
          <div key={stat.label} className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Next Milestone Progress */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl p-5 mb-8 border border-emerald-500/15"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-white font-medium">Next: </span>
              <span className="text-emerald-400">{nextMilestone.emoji} {nextMilestone.name}</span>
            </div>
            <span className="text-slate-500 text-sm">{totalDays}/{nextMilestone.days} days</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
              animate={{ width: `${Math.min(100, (totalDays / nextMilestone.days) * 100)}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>
      )}

      {/* Forest Trail Visualization */}
      <div className="glass-panel rounded-3xl p-6 mb-8 overflow-hidden relative" style={{ minHeight: 400 }}>
        {/* Ambient forest background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/15 via-transparent to-emerald-900/20 pointer-events-none" />
        
        {/* Winding path SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path
            d="M 50,350 Q 150,300 200,200 Q 250,100 350,150 Q 450,200 500,100 Q 550,0 650,50 Q 750,100 750,200"
            stroke="#10b981" strokeWidth="40" strokeLinecap="round" fill="none"
          />
        </svg>

        {trailFootprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600">
            <div className="text-6xl mb-4">🌳</div>
            <p className="text-lg font-medium">Your forest trail awaits</p>
            <p className="text-sm mt-2">Complete your first day to place your first footprint</p>
          </div>
        ) : (
          <div className="relative flex flex-wrap gap-4 justify-center py-4">
            {trailFootprints.map((day, i) => (
              <motion.button
                key={day.date}
                id={`trail-day-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring' }}
                onClick={() => setSelectedDay(day)}
                className="relative group cursor-pointer"
              >
                {/* Mini-footprint */}
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl shadow-lg transition-all group-hover:scale-110 ${
                  day.restored
                    ? 'bg-emerald-500/15 border-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-amber-500/10 border-amber-500/25 shadow-amber-500/10'
                }`}>
                  {day.restored ? '🌿' : '🌫️'}
                </div>
                {/* Day label */}
                <div className="text-center mt-1 text-xs text-slate-600">
                  Day {i + 1}
                </div>
                {/* Milestone indicator */}
                {MILESTONES.find(m => m.days === i + 1) && (
                  <div className="absolute -top-2 -right-2 text-lg">
                    {MILESTONES.find(m => m.days === i + 1)!.emoji}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Day Detail Modal */}
      {selectedDay && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedDay(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="glass-panel rounded-3xl p-8 max-w-sm w-full text-center border border-emerald-500/20"
          >
            <div className="mb-6">
              <LivingFootprint percentage={selectedDay.restorationPct} />
            </div>
            <p className="text-slate-400 text-sm mb-1">{selectedDay.date}</p>
            <h3 className="text-white text-xl font-semibold mb-2">{Math.round(selectedDay.restorationPct)}% Restored</h3>
            <p className="text-slate-500 text-sm mb-4">{selectedDay.restored ? '✅ Day fully restored!' : '⚠️ Partially restored'}</p>
            <button
              id="close-trail-modal-btn"
              onClick={() => setSelectedDay(null)}
              className="w-full py-2.5 glass-panel rounded-xl text-slate-400 text-sm"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Milestones Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MILESTONES.map(m => {
            const unlocked = totalDays >= m.days;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel rounded-2xl p-5 border transition-all ${unlocked ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 opacity-50'}`}
              >
                <div className="text-3xl mb-2">{m.emoji}</div>
                <h3 className={`font-semibold ${unlocked ? 'text-white' : 'text-slate-500'}`}>{m.name}</h3>
                <p className="text-slate-500 text-xs mt-1">{m.description}</p>
                <p className={`text-xs mt-2 ${unlocked ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {unlocked ? '✓ Unlocked' : `Unlock at ${m.days} days`}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
