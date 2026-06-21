import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string; icon: string }[];
}

const questions: Question[] = [
  {
    id: 'transportation',
    text: 'How do you usually get around?',
    options: [
      { value: 'car', label: 'Private car', icon: '🚗' },
      { value: 'public', label: 'Public transport', icon: '🚌' },
      { value: 'bike', label: 'Bicycle / E-bike', icon: '🚲' },
      { value: 'walk', label: 'Walk', icon: '🚶' }
    ]
  },
  {
    id: 'food',
    text: 'How would you describe your diet?',
    options: [
      { value: 'meat-heavy', label: 'Meat at most meals', icon: '🥩' },
      { value: 'balanced', label: 'Balanced (some meat)', icon: '🥗' },
      { value: 'flexitarian', label: 'Mostly plant-based', icon: '🥦' },
      { value: 'vegan', label: 'Fully plant-based', icon: '🌱' }
    ]
  },
  {
    id: 'electricity',
    text: 'How eco-conscious is your energy use at home?',
    options: [
      { value: 'low', label: 'I don\'t think about it', icon: '💡' },
      { value: 'medium', label: 'Sometimes I switch off', icon: '🔌' },
      { value: 'high', label: 'Actively try to save', icon: '⚡' },
      { value: 'renewable', label: 'Using renewable energy', icon: '☀️' }
    ]
  },
  {
    id: 'shopping',
    text: 'How sustainable is your shopping?',
    options: [
      { value: 'fast-fashion', label: 'Frequent fast fashion', icon: '🛍️' },
      { value: 'moderate', label: 'Occasional new items', icon: '👕' },
      { value: 'conscious', label: 'Conscious buyer', icon: '♻️' },
      { value: 'minimal', label: 'Minimalist / secondhand', icon: '🔄' }
    ]
  },
  {
    id: 'exercise',
    text: 'How active are you outdoors?',
    options: [
      { value: 'sedentary', label: 'Mostly indoors', icon: '🏠' },
      { value: 'occasional', label: 'A few walks per week', icon: '🌥️' },
      { value: 'active', label: 'Regular outdoor activity', icon: '🏃' },
      { value: 'very-active', label: 'Daily outdoor sports', icon: '⛰️' }
    ]
  },
  {
    id: 'recycling',
    text: 'How consistently do you recycle?',
    options: [
      { value: 'never', label: 'Rarely / never', icon: '🗑️' },
      { value: 'sometimes', label: 'When convenient', icon: '📦' },
      { value: 'most', label: 'Most materials', icon: '♻️' },
      { value: 'always', label: 'Comprehensive recycler', icon: '🌿' }
    ]
  }
];

const generateTasks = (answers: Record<string, string>) => {
  const tasks = [];

  if (answers.transportation !== 'bike' && answers.transportation !== 'walk') {
    tasks.push({ name: 'Use public transport or cycle today', category: 'transportation' as const, points: 25 });
  } else {
    tasks.push({ name: 'Take your daily eco-commute by bike or foot', category: 'transportation' as const, points: 20 });
  }

  if (answers.food === 'meat-heavy' || answers.food === 'balanced') {
    tasks.push({ name: 'Eat one fully plant-based meal today', category: 'food' as const, points: 25 });
  } else {
    tasks.push({ name: 'Try a new plant-based recipe', category: 'food' as const, points: 20 });
  }

  if (answers.electricity !== 'renewable') {
    tasks.push({ name: 'Unplug idle electronics and standby devices', category: 'energy' as const, points: 15 });
    tasks.push({ name: 'Turn off lights when leaving a room', category: 'energy' as const, points: 10 });
  } else {
    tasks.push({ name: 'Reduce overall home energy consumption by 10%', category: 'energy' as const, points: 15 });
  }

  if (answers.shopping === 'fast-fashion' || answers.shopping === 'moderate') {
    tasks.push({ name: 'Avoid single-use plastics today', category: 'shopping' as const, points: 20 });
  }

  if (answers.exercise === 'sedentary' || answers.exercise === 'occasional') {
    tasks.push({ name: 'Spend 15 minutes walking in nature', category: 'nature' as const, points: 20 });
  } else {
    tasks.push({ name: 'Complete your outdoor exercise routine', category: 'exercise' as const, points: 20 });
  }

  if (answers.recycling !== 'always') {
    tasks.push({ name: 'Sort and recycle all recyclable waste today', category: 'recycling' as const, points: 15 });
  }

  tasks.push({ name: 'Drink 2L of water (carry a reusable bottle)', category: 'water' as const, points: 15 });

  return tasks;
};

export const AIJourney: React.FC = () => {
  const { addTask, setJourney } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<Array<{ name: string; category: string }>>([]);

  const currentQ = questions[step];
  const progress = ((step) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      // Generate plan
      setGenerating(true);
      const tasks = generateTasks(newAnswers);
      setTimeout(() => {
        setGeneratedTasks(tasks);
        tasks.forEach(t => addTask(t.name, t.category as any));
        setJourney('ai');
        setGenerating(false);
        setGenerated(true);
      }, 2500);
    }
  };

  if (generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Crafting your eco journey...
          </h2>
          <p className="text-slate-400">Analyzing your lifestyle and generating a personalized plan</p>
          <div className="flex gap-1 justify-center mt-6">
            {[0.1, 0.2, 0.3].map(d => (
              <motion.div
                key={d}
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1, delay: d }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (generated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl mb-6"
          >
            🌿
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Your Journey is Ready!
          </h1>
          <p className="text-slate-400 mb-8">
            We've created {generatedTasks.length} personalized tasks to start restoring your footprint.
          </p>

          <div className="glass-panel rounded-2xl p-6 text-left mb-8 space-y-3">
            {generatedTasks.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm">{t.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            id="ai-journey-start-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/footprint')}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Begin Restoring My Footprint
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm">Question {step + 1} of {questions.length}</span>
            <span className="text-emerald-400 text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Lora, serif' }}>
              {currentQ.text}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {currentQ.options.map(opt => (
                <motion.button
                  key={opt.value}
                  id={`ai-q${step}-${opt.value}`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt.value)}
                  className={`flex flex-col items-center gap-2 p-5 glass-panel rounded-2xl border transition-all duration-300 ${
                    answers[currentQ.id] === opt.value
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-white/8 hover:border-emerald-500/25'
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="text-slate-300 text-sm font-medium text-center">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button
            id="ai-journey-back-btn"
            onClick={() => setStep(s => s - 1)}
            className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous question
          </button>
        )}
      </div>
    </div>
  );
};
