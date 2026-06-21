import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  name: string;
  category: 'transportation' | 'exercise' | 'energy' | 'nature' | 'water' | 'food' | 'shopping' | 'recycling';
  completed: boolean;
  notes?: string;
  points: number;
}

export interface ExerciseLog {
  steps: number;
  waterIntake: number; // in ml
  walkingMinutes: number;
  cyclingMinutes: number;
  outdoorMinutes: number;
}

export interface DayRecord {
  dateString: string; // YYYY-MM-DD
  completedTasks: string[]; // task IDs completed on that day
  exercise: ExerciseLog;
  restorationPercentage: number; // 0 to 100
  restored: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  ecoTitle: string;
  currentStreak: number;
  footprintsRestored: number;
  tasksCompleted: number;
  level: number;
  badge: string;
}

interface AppContextType {
  user: { username: string; email: string; isGuest: boolean } | null;
  tasks: Task[];
  exercise: ExerciseLog;
  dayRecords: Record<string, DayRecord>;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  footprintsRestoredCount: number;
  journeyType: 'ai' | 'custom' | null;
  login: (username: string, email: string, isGuest: boolean) => void;
  logout: () => void;
  setJourney: (type: 'ai' | 'custom') => void;
  addTask: (name: string, category: Task['category'], notes?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateExercise: (key: keyof ExerciseLog, value: number) => void;
  completeToday: () => void;
  resetAllData: () => void;
  showUnlockCelebration: Achievement | null;
  dismissUnlockCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_TASKS: Task[] = [
  { id: '1', name: 'Use public transport or bicycle', category: 'transportation', completed: false, points: 25 },
  { id: '2', name: 'Drink 2L of water', category: 'water', completed: false, points: 15 },
  { id: '3', name: 'Spend 20 mins in nature outdoors', category: 'nature', completed: false, points: 20 },
  { id: '4', name: 'Turn off standby appliances', category: 'energy', completed: false, points: 15 },
  { id: '5', name: 'Eat a plant-based meal today', category: 'food', completed: false, points: 25 }
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first sustainable task', unlocked: false },
  { id: 'eco_starter', name: 'Eco Starter', description: 'Complete a full day with at least 50% footprint restored', unlocked: false },
  { id: 'green_explorer', name: 'Green Explorer', description: 'Maintain a 3-day eco streak', unlocked: false },
  { id: 'eco_warrior', name: 'Eco Warrior', description: 'Unlock the River Crossing milestone (25 days)', unlocked: false },
  { id: 'nature_guardian', name: 'Nature Guardian', description: 'Restore 10 footprints completely', unlocked: false },
  { id: 'forest_keeper', name: 'Forest Keeper', description: 'Maintain a 7-day eco streak', unlocked: false },
  { id: 'earth_protector', name: 'Earth Protector', description: 'Complete 50 eco tasks in total', unlocked: false },
  { id: 'planet_champion', name: 'Planet Champion', description: 'Reach the Nature Sanctuary milestone (100 days)', unlocked: false }
];

export const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; email: string; isGuest: boolean } | null>(() => {
    const saved = localStorage.getItem('ecofoot_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ecofoot_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [exercise, setExercise] = useState<ExerciseLog>(() => {
    const saved = localStorage.getItem('ecofoot_exercise');
    return saved ? JSON.parse(saved) : { steps: 0, waterIntake: 0, walkingMinutes: 0, cyclingMinutes: 0, outdoorMinutes: 0 };
  });

  const [dayRecords, setDayRecords] = useState<Record<string, DayRecord>>(() => {
    const saved = localStorage.getItem('ecofoot_day_records');
    return saved ? JSON.parse(saved) : {};
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('ecofoot_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    const saved = localStorage.getItem('ecofoot_current_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [longestStreak, setLongestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('ecofoot_longest_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [footprintsRestoredCount, setFootprintsRestoredCount] = useState<number>(() => {
    const saved = localStorage.getItem('ecofoot_restored_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [journeyType, setJourneyType] = useState<'ai' | 'custom' | null>(() => {
    const saved = localStorage.getItem('ecofoot_journey_type');
    return saved ? (saved as 'ai' | 'custom') : null;
  });

  const [showUnlockCelebration, setShowUnlockCelebration] = useState<Achievement | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('ecofoot_user', JSON.stringify(user));
    else localStorage.removeItem('ecofoot_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ecofoot_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ecofoot_exercise', JSON.stringify(exercise));
  }, [exercise]);

  useEffect(() => {
    localStorage.setItem('ecofoot_day_records', JSON.stringify(dayRecords));
  }, [dayRecords]);

  useEffect(() => {
    localStorage.setItem('ecofoot_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('ecofoot_current_streak', currentStreak.toString());
  }, [currentStreak]);

  useEffect(() => {
    localStorage.setItem('ecofoot_longest_streak', longestStreak.toString());
  }, [longestStreak]);

  useEffect(() => {
    localStorage.setItem('ecofoot_restored_count', footprintsRestoredCount.toString());
  }, [footprintsRestoredCount]);

  useEffect(() => {
    if (journeyType) localStorage.setItem('ecofoot_journey_type', journeyType);
    else localStorage.removeItem('ecofoot_journey_type');
  }, [journeyType]);

  // Dynamic achievement unlock check
  const triggerUnlock = (id: string) => {
    setAchievements((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx !== -1 && !prev[idx].unlocked) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], unlocked: true, unlockedAt: new Date().toISOString() };
        setShowUnlockCelebration(updated[idx]);
        return updated;
      }
      return prev;
    });
  };

  const login = (username: string, email: string, isGuest: boolean) => {
    setUser({ username, email, isGuest });
  };

  const logout = () => {
    setUser(null);
    setJourneyType(null);
    setTasks(DEFAULT_TASKS);
    setExercise({ steps: 0, waterIntake: 0, walkingMinutes: 0, cyclingMinutes: 0, outdoorMinutes: 0 });
    setCurrentStreak(0);
    setAchievements(INITIAL_ACHIEVEMENTS);
  };

  const setJourney = (type: 'ai' | 'custom') => {
    setJourneyType(type);
  };

  const addTask = (name: string, category: Task['category'], notes?: string) => {
    const pointsMap: Record<Task['category'], number> = {
      transportation: 25,
      exercise: 20,
      energy: 15,
      nature: 20,
      water: 15,
      food: 25,
      shopping: 20,
      recycling: 15
    };
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      category,
      completed: false,
      notes,
      points: pointsMap[category] || 20
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      
      // Check for first task completion achievement
      const justCompleted = updated.find((t) => t.id === id && t.completed);
      if (justCompleted) {
        triggerUnlock('first_step');
      }

      // Check total completed tasks across history
      const totalCompletedCount = Object.values(dayRecords).reduce((acc, record) => acc + record.completedTasks.length, 0) 
        + updated.filter(t => t.completed).length;
      if (totalCompletedCount >= 50) {
        triggerUnlock('earth_protector');
      }

      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateExercise = (key: keyof ExerciseLog, value: number) => {
    setExercise((prev) => {
      const updated = { ...prev, [key]: Math.max(0, value) };
      return updated;
    });
  };

  const completeToday = () => {
    const today = getTodayDateString();
    
    // Calculate current restoration percentage
    // Tasks: 80% weight, Exercise: 20% weight
    const completedTasksCount = tasks.filter((t) => t.completed).length;
    const totalTasksCount = tasks.length;
    const taskRatio = totalTasksCount > 0 ? completedTasksCount / totalTasksCount : 1;
    
    // Exercise contributions: steps (target 10000), water (target 2000), outdoor (target 30)
    const stepsRatio = Math.min(1, exercise.steps / 10000);
    const waterRatio = Math.min(1, exercise.waterIntake / 2000);
    const outdoorRatio = Math.min(1, exercise.outdoorMinutes / 30);
    const exerciseRatio = (stepsRatio + waterRatio + outdoorRatio) / 3;

    const percentage = Math.round((taskRatio * 80) + (exerciseRatio * 20));
    const isRestored = percentage >= 80; // considered restored if >= 80%

    // Create record
    const record: DayRecord = {
      dateString: today,
      completedTasks: tasks.filter((t) => t.completed).map((t) => t.id),
      exercise: { ...exercise },
      restorationPercentage: percentage,
      restored: isRestored
    };

    setDayRecords((prev) => ({ ...prev, [today]: record }));

    if (isRestored) {
      setFootprintsRestoredCount((prev) => {
        const next = prev + 1;
        if (next >= 10) triggerUnlock('nature_guardian');
        return next;
      });

      triggerUnlock('eco_starter');

      // Update streaks
      setCurrentStreak((prev) => {
        const next = prev + 1;
        if (next >= 3) triggerUnlock('green_explorer');
        if (next >= 7) triggerUnlock('forest_keeper');
        
        setLongestStreak((longest) => Math.max(longest, next));
        return next;
      });
    }

    // Reset daily tasks for tomorrow (or simulate starting tomorrow)
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
    setExercise({ steps: 0, waterIntake: 0, walkingMinutes: 0, cyclingMinutes: 0, outdoorMinutes: 0 });

    // Milestones unlocks on DayRecords size (simulating total days complete)
    const totalDaysCount = Object.keys(dayRecords).length + 1;
    if (totalDaysCount >= 25) triggerUnlock('eco_warrior');
    if (totalDaysCount >= 100) triggerUnlock('planet_champion');
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(null);
    setTasks(DEFAULT_TASKS);
    setExercise({ steps: 0, waterIntake: 0, walkingMinutes: 0, cyclingMinutes: 0, outdoorMinutes: 0 });
    setDayRecords({});
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCurrentStreak(0);
    setLongestStreak(0);
    setFootprintsRestoredCount(0);
    setJourneyType(null);
  };

  const dismissUnlockCelebration = () => {
    setShowUnlockCelebration(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        exercise,
        dayRecords,
        achievements,
        currentStreak,
        longestStreak,
        footprintsRestoredCount,
        journeyType,
        login,
        logout,
        setJourney,
        addTask,
        toggleTask,
        deleteTask,
        updateExercise,
        completeToday,
        resetAllData,
        showUnlockCelebration,
        dismissUnlockCelebration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
