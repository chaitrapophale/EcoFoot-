import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Leaf } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'forgot';

export const Auth: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        setSuccess('Password reset link sent! Check your email.');
        return;
      }
      login(
        formData.username || formData.email.split('@')[0],
        formData.email,
        false
      );
      navigate('/footprint');
    }, 1200);
  };

  const handleGuest = () => {
    login('EcoExplorer', 'guest@ecofoot.app', true);
    navigate('/footprint');
  };

  const titles = {
    signin: 'Welcome back',
    signup: 'Join EcoFoot',
    forgot: 'Reset Password'
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl shadow-black/40"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-3">
            <Leaf className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>
            {titles[mode]}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'signin' ? 'Sign in to continue your eco journey' :
             mode === 'signup' ? 'Start your sustainability journey today' :
             'We\'ll send you a reset link'}
          </p>
        </div>

        {success && (
          <div
            aria-live="polite"
            className="mb-4 px-4 py-3 bg-emerald-500/15 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm text-center"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Username</label>
              <input
                id="auth-username"
                type="text"
                autoComplete="username"
                required={mode === 'signup'}
                value={formData.username}
                onChange={e => setFormData(p => ({ ...p, username: e.target.value }))}
                placeholder="EcoWarrior2025"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-slate-400 text-sm mb-1.5 block">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="you@ecofoot.app"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signin' && (
            <div className="text-right">
              <button type="button" onClick={() => setMode('forgot')} id="forgot-password-link" className="text-emerald-400 text-xs hover:text-emerald-300">
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            type="submit"
            id="auth-submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-slate-600 text-xs">or</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Guest Mode */}
        <button
          id="guest-mode-btn"
          onClick={handleGuest}
          className="w-full py-3.5 glass-panel glass-card-hover text-slate-300 font-medium rounded-xl text-sm"
        >
          🌿 Continue as Guest
        </button>

        {/* Switch mode */}
        <div className="text-center mt-6 text-sm text-slate-500">
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <button id="switch-to-signup" onClick={() => setMode('signup')} className="text-emerald-400 hover:text-emerald-300">Sign up</button>
            </>
          ) : mode === 'signup' ? (
            <>Already have an account?{' '}
              <button id="switch-to-signin" onClick={() => setMode('signin')} className="text-emerald-400 hover:text-emerald-300">Sign in</button>
            </>
          ) : (
            <button id="switch-back-signin" onClick={() => setMode('signin')} className="text-emerald-400 hover:text-emerald-300">← Back to Sign In</button>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/" id="back-home-link" className="text-slate-600 hover:text-slate-400 text-xs">← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
};
