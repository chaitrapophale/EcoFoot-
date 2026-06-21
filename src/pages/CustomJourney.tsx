import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Task } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES: { value: Task['category']; label: string; icon: string; color: string }[] = [
  { value: 'transportation', label: 'Transportation', icon: '🚲', color: 'blue' },
  { value: 'exercise', label: 'Exercise', icon: '🏃', color: 'orange' },
  { value: 'energy', label: 'Energy', icon: '⚡', color: 'yellow' },
  { value: 'nature', label: 'Nature', icon: '🌿', color: 'emerald' },
  { value: 'water', label: 'Water', icon: '💧', color: 'sky' },
  { value: 'food', label: 'Food', icon: '🥗', color: 'green' },
  { value: 'shopping', label: 'Shopping', icon: '♻️', color: 'teal' },
  { value: 'recycling', label: 'Recycling', icon: '📦', color: 'lime' },
];

export const CustomJourney: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, setJourney } = useApp();
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>('nature');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [activeFilter, setActiveFilter] = useState<Task['category'] | 'all'>('all');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    addTask(newTaskName.trim(), newTaskCategory, newTaskNotes || undefined);
    setJourney('custom');
    setNewTaskName('');
    setNewTaskNotes('');
    setShowAddForm(false);
  };

  const filtered = activeFilter === 'all' ? tasks : tasks.filter(t => t.category === activeFilter);
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getCatIcon = (cat: Task['category']) => CATEGORIES.find(c => c.value === cat)?.icon || '📌';

  return (
    <div className="min-h-screen px-4 py-24 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Custom Journey</p>
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Lora, serif' }}>
          My Eco Checklist
        </h1>
        <p className="text-slate-400">Build your daily sustainability habits, one task at a time.</p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-5 mb-6"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">{completedCount}/{tasks.length} tasks done</span>
          <span className="text-emerald-400 text-sm font-semibold">{completionPct}%</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          id="filter-all-btn"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm transition-all ${activeFilter === 'all' ? 'bg-emerald-500 text-white' : 'glass-panel text-slate-400 hover:text-slate-200'}`}
        >
          All ({tasks.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            id={`filter-${cat.value}-btn`}
            onClick={() => setActiveFilter(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${activeFilter === cat.value ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'glass-panel text-slate-400 hover:text-slate-200'}`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-slate-600"
            >
              <div className="text-4xl mb-3">📝</div>
              <p>No tasks yet. Add your first eco task!</p>
            </motion.div>
          )}
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-4 glass-panel rounded-2xl p-4 border transition-all duration-300 ${task.completed ? 'border-emerald-500/20 opacity-70' : 'border-white/5 hover:border-emerald-500/20'}`}
            >
              {/* Checkbox */}
              <button
                id={`task-toggle-${task.id}`}
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-emerald-500'}`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {/* Icon */}
              <span className="text-xl flex-shrink-0">{getCatIcon(task.category)}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.name}
                </p>
                {task.notes && (
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{task.notes}</p>
                )}
              </div>

              {/* Points */}
              <span className="flex-shrink-0 text-xs text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 rounded-full">
                +{task.points}
              </span>

              {/* Delete */}
              <button
                id={`task-delete-${task.id}`}
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAdd}
            className="glass-panel rounded-2xl p-6 mb-4 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add New Task</h3>
              <button type="button" onClick={() => setShowAddForm(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <input
              id="new-task-name"
              type="text"
              required
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              placeholder="E.g. Walk to work today"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-emerald-500/40"
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  id={`cat-${cat.value}-btn`}
                  onClick={() => setNewTaskCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition-all ${newTaskCategory === cat.value ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'glass-panel text-slate-400'}`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <input
              id="new-task-notes"
              type="text"
              value={newTaskNotes}
              onChange={e => setNewTaskNotes(e.target.value)}
              placeholder="Optional note (e.g. bring reusable bag)"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-emerald-500/40"
            />
            <button
              id="add-task-submit"
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
            >
              Add Task
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!showAddForm && (
          <motion.button
            id="open-add-task-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 flex-1 py-3.5 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 rounded-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Eco Task
          </motion.button>
        )}
        <motion.button
          id="go-to-footprint-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/footprint')}
          className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
        >
          View My Footprint →
        </motion.button>
      </div>
    </div>
  );
};
