import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Info } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, logout, resetAllData } = useApp();
  const navigate = useNavigate();
  const appVersion = '1.0.0';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure? This will erase all your eco journey data permanently.')) {
      resetAllData();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen px-4 py-20 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">Preferences</p>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>Settings</h1>
      </motion.div>

      <div className="space-y-4">
        {/* Account Info */}
        {user && (
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Account</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-xl">🌍</div>
              <div>
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-slate-500 text-sm">{user.email} {user.isGuest && '(Guest)'}</p>
              </div>
            </div>
          </div>
        )}

        {/* App Info */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">About EcoFoot</h2>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">EcoFoot v{appVersion}</p>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                An immersive sustainability experience designed to emotionally connect you with your ecological impact.
                Built with ❤️ for hackathon 2025.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Quick Tips</h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>• Complete small daily actions to grow your forest trail faster.</p>
            <p>• Track steps, hydration, and outdoor time for bonus footprint progress.</p>
            <p>• Use the AI journey feature if you want a personalized checklist.</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel rounded-2xl p-5 border border-red-500/15">
          <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Danger Zone</h2>
          <div className="space-y-3">
            {user && (
              <button
                id="settings-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/25 text-slate-300 hover:text-orange-400 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
            <button
              id="settings-reset-btn"
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 hover:bg-red-500/10 border border-white/5 hover:border-red-500/25 text-slate-400 hover:text-red-400 transition-all text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
