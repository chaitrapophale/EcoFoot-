import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Droplets, Activity, Bike, TreePine, Plus, Minus } from 'lucide-react';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  target: number;
  color: 'emerald' | 'sky' | 'green' | 'amber';
  id: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const COLOR_STYLES = {
  emerald: {
    text: 'text-emerald-400',
    badge: 'text-emerald-400 bg-emerald-500/10',
    bar: 'bg-emerald-500'
  },
  sky: {
    text: 'text-sky-400',
    badge: 'text-sky-400 bg-sky-500/10',
    bar: 'bg-sky-500'
  },
  green: {
    text: 'text-green-400',
    badge: 'text-green-400 bg-green-500/10',
    bar: 'bg-green-500'
  },
  amber: {
    text: 'text-amber-400',
    badge: 'text-amber-400 bg-amber-500/10',
    bar: 'bg-amber-500'
  }
} as const;

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  target,
  color,
  id,
  onIncrement,
  onDecrement
}) => {
  const pct = Math.min(100, (value / target) * 100);
  const styles = COLOR_STYLES[color];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 ${styles.text}`}>
          <Icon className="w-5 h-5" />
          <span className="text-slate-300 text-sm font-medium">{label}</span>
        </div>
        <span className={`text-xs px-2.5 py-0.5 rounded-full ${styles.badge}`}>
          {Math.round(pct)}%
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <button id={`${id}-decrement-btn`} onClick={onDecrement} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 text-center">
          <span className={`text-2xl font-bold ${styles.text}`}>{value}</span>
          <span className="text-slate-500 text-xs ml-1">{unit}</span>
        </div>
        <button id={`${id}-increment-btn`} onClick={onIncrement} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${styles.bar} rounded-full`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-slate-700 text-xs">0</span>
        <span className="text-slate-600 text-xs">Target: {target} {unit}</span>
      </div>
    </div>
  );
};

export const Exercise: React.FC = () => {
  const { exercise, updateExercise } = useApp();

  const totalContribution = Math.round(
    (Math.min(1, exercise.steps / 10000) + Math.min(1, exercise.waterIntake / 2000) + Math.min(1, exercise.outdoorMinutes / 30)) / 3 * 20
  );

  return (
    <div className="min-h-screen px-4 py-20 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Wellness</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
          Exercise & Health
        </h1>
        <p className="text-slate-400">Healthy You = Healthy Planet. Your wellness contributes {totalContribution}% to today's footprint restoration.</p>
      </motion.div>

      {/* Wellness Impact Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-5 mb-6 border border-emerald-500/15 flex items-center gap-4"
      >
        <div className="text-4xl">🌍</div>
        <div className="flex-1">
          <p className="text-white font-semibold">Your wellness boosts your footprint</p>
          <p className="text-slate-400 text-sm">Exercise, hydration, and outdoor time restore up to 20% of your living footprint.</p>
        </div>
        <div className="text-right">
          <span className="text-emerald-400 text-2xl font-bold">{totalContribution}%</span>
          <p className="text-slate-600 text-xs">of footprint</p>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <MetricCard
          id="steps"
          icon={Activity}
          label="Daily Steps"
          value={exercise.steps}
          unit="steps"
          target={10000}
          color="emerald"
          onIncrement={() => updateExercise('steps', exercise.steps + 500)}
          onDecrement={() => updateExercise('steps', exercise.steps - 500)}
        />
        <MetricCard
          id="water"
          icon={Droplets}
          label="Water Intake"
          value={exercise.waterIntake}
          unit="ml"
          target={2000}
          color="sky"
          onIncrement={() => updateExercise('waterIntake', exercise.waterIntake + 200)}
          onDecrement={() => updateExercise('waterIntake', exercise.waterIntake - 200)}
        />
        <MetricCard
          id="walking"
          icon={TreePine}
          label="Outdoor Time"
          value={exercise.outdoorMinutes}
          unit="min"
          target={30}
          color="green"
          onIncrement={() => updateExercise('outdoorMinutes', exercise.outdoorMinutes + 5)}
          onDecrement={() => updateExercise('outdoorMinutes', exercise.outdoorMinutes - 5)}
        />
        <MetricCard
          id="cycling"
          icon={Bike}
          label="Cycling"
          value={exercise.cyclingMinutes}
          unit="min"
          target={30}
          color="amber"
          onIncrement={() => updateExercise('cyclingMinutes', exercise.cyclingMinutes + 5)}
          onDecrement={() => updateExercise('cyclingMinutes', exercise.cyclingMinutes - 5)}
        />
      </div>

      {/* Eco Tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-2xl p-5 border border-emerald-500/10"
      >
        <p className="text-emerald-400 text-sm font-semibold mb-2">🌿 Today's Eco Wellness Tip</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Choosing to walk or cycle instead of driving saves approximately 0.21 kg of CO₂ per kilometer.
          Over a year, that's the equivalent of planting 10+ trees! Your steps matter more than you know.
        </p>
      </motion.div>
    </div>
  );
};
