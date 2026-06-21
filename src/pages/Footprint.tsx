import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Trophy, Flame } from 'lucide-react';
import { useApp, getTodayDateString } from '../context/AppContext';
import { LivingFootprint } from '../components/LivingFootprint';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const Footprint: React.FC = () => {
  const { tasks, toggleTask, completeToday, dayRecords, currentStreak, exercise } = useApp();
  const navigate = useNavigate();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const today = getTodayDateString();
  const todayRecord = dayRecords[today];

  // Calculate today's restoration percentage live
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const taskRatio = totalCount > 0 ? completedCount / totalCount : 0;
  const stepsRatio = Math.min(1, exercise.steps / 10000);
  const waterRatio = Math.min(1, exercise.waterIntake / 2000);
  const outdoorRatio = Math.min(1, exercise.outdoorMinutes / 30);
  const exerciseRatio = (stepsRatio + waterRatio + outdoorRatio) / 3;
  const restorationPct = Math.min(100, Math.round((taskRatio * 80) + (exerciseRatio * 20)));

  const handleCompleteDay = () => {
    completeToday();
    setShowCompletionModal(true);
    if (restorationPct >= 80) {
      confetti({
        particleCount: 150,
        spread: 90,
        colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24'],
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen px-4 py-20 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Today's Journey</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>
          Living Footprint
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Footprint Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="glass-panel rounded-3xl p-8 w-full flex flex-col items-center border border-emerald-500/10 shadow-2xl shadow-black/30 mb-5">
            <LivingFootprint percentage={restorationPct} />
          </div>

          {/* Streak + Stats */}
          <div className="flex gap-3 w-full">
            <div className="flex-1 glass-panel rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-bold text-xl">{currentStreak}</span>
              </div>
              <p className="text-slate-500 text-xs">Day Streak</p>
            </div>
            <div className="flex-1 glass-panel rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-bold text-xl">{completedCount * 15}</span>
              </div>
              <p className="text-slate-500 text-xs">Eco Points</p>
            </div>
            <div className="flex-1 glass-panel rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-xl">{completedCount}/{totalCount}</span>
              </div>
              <p className="text-slate-500 text-xs">Tasks Done</p>
            </div>
          </div>
        </motion.div>

        {/* Tasks Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                {completedCount}/{totalCount} complete
              </span>
            </div>

            {/* Progress */}
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-5">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Task List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <div className="text-4xl mb-3">🌱</div>
                  <p className="mb-4">No tasks yet</p>
                  <button
                    id="footprint-add-tasks-btn"
                    onClick={() => navigate('/journey/custom')}
                    className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                  >
                    Add your first eco task
                  </button>
                </div>
              ) : (
                tasks.map((task, i) => (
                  <motion.button
                    key={task.id}
                    id={`footprint-task-${task.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 3 }}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 text-left ${
                      task.completed
                        ? 'bg-emerald-500/8 border-emerald-500/25 opacity-75'
                        : 'bg-white/3 border-white/5 hover:border-emerald-500/25'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-emerald-500'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`flex-1 text-sm font-medium transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.name}
                    </span>
                    <span className="text-emerald-400 text-xs flex-shrink-0">+{task.points}</span>
                  </motion.button>
                ))
              )}
            </div>

            {/* Complete Day Button */}
            {tasks.length > 0 && !todayRecord && (
              <motion.button
                id="complete-today-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompleteDay}
                className="mt-5 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
              >
                {restorationPct >= 80 ? '🌿 Complete Day & Celebrate!' : `Complete Today (${restorationPct}% restored)`}
              </motion.button>
            )}

            {todayRecord && (
              <div className="mt-5 text-center text-emerald-400 text-sm py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                ✅ Today's footprint logged! ({todayRecord.restorationPercentage}% restored)
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="glass-panel rounded-3xl p-10 max-w-sm w-full text-center border border-emerald-500/25 shadow-2xl shadow-emerald-500/10"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-5"
              >
                {restorationPct >= 80 ? '🌳' : '🌱'}
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Lora, serif' }}>
                {restorationPct >= 80 ? 'Day Restored!' : 'Good Progress!'}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {restorationPct >= 80
                  ? `You've restored today's footprint ${restorationPct}%! Your forest trail grows stronger.`
                  : `You restored ${restorationPct}% today. Every action counts — come back tomorrow!`}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  id="completion-view-trail-btn"
                  onClick={() => { setShowCompletionModal(false); navigate('/forest'); }}
                  className="py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all"
                >
                  View Forest Trail 🌿
                </button>
                <button
                  id="completion-dismiss-btn"
                  onClick={() => setShowCompletionModal(false)}
                  className="py-3 glass-panel text-slate-400 rounded-2xl text-sm"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
