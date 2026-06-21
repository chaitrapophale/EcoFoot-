import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Leaf, TreePine, Trophy, User, Dumbbell, Menu, X, Settings, Map, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: Home, id: 'nav-home' },
  { path: '/footprint', label: 'Footprint', icon: Leaf, id: 'nav-footprint' },
  { path: '/forest', label: 'Trail', icon: TreePine, id: 'nav-trail' },
  { path: '/exercise', label: 'Wellness', icon: Dumbbell, id: 'nav-exercise' },
  { path: '/achievements', label: 'Awards', icon: Trophy, id: 'nav-achievements' },
  { path: '/leaderboard', label: 'Leaderboard', icon: Map, id: 'nav-leaderboard' },
  { path: '/profile', label: 'Profile', icon: User, id: 'nav-profile' },
];

export const Navigation: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav aria-label="Primary navigation" className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1.5 glass-panel rounded-2xl p-2 border border-white/8 shadow-xl shadow-black/30">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            id={item.id}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 inset-y-1 w-0.5 bg-emerald-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        <div className="h-px bg-white/8 my-1" />
        <NavLink
          to="/settings"
          id="nav-settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
              isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
        {!user && (
          <button
            id="nav-signin"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        )}
      </nav>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden flex items-center justify-between px-4 py-3 glass-panel border-b border-white/8">
        <span className="text-white font-bold text-lg" style={{ fontFamily: 'Lora, serif' }}>
          <span className="text-gradient-emerald">Eco</span>Foot
        </span>
        <button id="mobile-menu-btn" aria-label="Toggle navigation menu" onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-0 z-30 pt-16 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
            <nav className="relative z-10 flex flex-col gap-1 p-4">
              {[...NAV_ITEMS, { path: '/settings', label: 'Settings', icon: Settings, id: 'mob-nav-settings' }].map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  id={`mobile-${item.id}`}
                  end={item.path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25'
                        : 'text-slate-300 glass-panel'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
              {!user && (
                <button
                  id="mobile-nav-signin"
                  onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 mt-2 bg-emerald-500 text-white rounded-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In / Sign Up
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="flex glass-panel border-t border-white/8">
          {NAV_ITEMS.slice(0, 5).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              id={`bottom-${item.id}`}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 gap-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                  isActive ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};
