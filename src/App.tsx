import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useApp } from './context/AppContext';
import { AmbientEnv } from './components/AmbientEnv';
import { Navigation } from './components/Navigation';

// Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { ChooseJourney } from './pages/ChooseJourney';
import { AIJourney } from './pages/AIJourney';
import { CustomJourney } from './pages/CustomJourney';
import { Footprint } from './pages/Footprint';
import { ForestTrail } from './pages/ForestTrail';
import { Exercise } from './pages/Exercise';
import { Leaderboard } from './pages/Leaderboard';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient();

const PAGE_TITLES: Record<string, string> = {
  '/': 'EcoFoot | Home',
  '/auth': 'EcoFoot | Sign In',
  '/choose-journey': 'EcoFoot | Choose Journey',
  '/journey/ai': 'EcoFoot | AI Journey',
  '/journey/custom': 'EcoFoot | Custom Journey',
  '/footprint': 'EcoFoot | Footprint',
  '/forest': 'EcoFoot | Forest Trail',
  '/exercise': 'EcoFoot | Wellness',
  '/leaderboard': 'EcoFoot | Leaderboard',
  '/achievements': 'EcoFoot | Achievements',
  '/profile': 'EcoFoot | Profile',
  '/settings': 'EcoFoot | Settings'
};

// Achievement unlock toast
const AchievementToast: React.FC = () => {
  const { showUnlockCelebration, dismissUnlockCelebration } = useApp();

  return (
    <AnimatePresence>
      {showUnlockCelebration && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="fixed bottom-20 lg:bottom-6 right-4 z-50 glass-panel rounded-2xl p-4 flex items-center gap-3 border border-emerald-500/30 shadow-xl shadow-emerald-500/10 max-w-xs"
          onClick={dismissUnlockCelebration}
        >
          <div className="text-3xl">🏆</div>
          <div>
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Achievement Unlocked!</p>
            <p className="text-white text-sm font-medium">{showUnlockCelebration.name}</p>
            <p className="text-slate-500 text-xs">{showUnlockCelebration.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || 'EcoFoot';
    document.title = title;
  }, [location.pathname]);

  return (
    <>
      <AmbientEnv />
      <Navigation />
      <main aria-label="Main content" className="relative z-10 lg:pl-52 pb-20 lg:pb-0 pt-14 lg:pt-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/choose-journey" element={<PageTransition><ChooseJourney /></PageTransition>} />
            <Route path="/journey/ai" element={<PageTransition><AIJourney /></PageTransition>} />
            <Route path="/journey/custom" element={<PageTransition><CustomJourney /></PageTransition>} />
            <Route path="/footprint" element={<PageTransition><Footprint /></PageTransition>} />
            <Route path="/forest" element={<PageTransition><ForestTrail /></PageTransition>} />
            <Route path="/exercise" element={<PageTransition><Exercise /></PageTransition>} />
            <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
            <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <AchievementToast />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
