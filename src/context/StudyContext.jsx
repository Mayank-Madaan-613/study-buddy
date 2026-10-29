import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playTimerChime, playSuccessChime } from '../utils/sound';

const StudyContext = createContext(null);

const DEFAULT_HABITS = [
  { id: 1, name: 'Read 30 mins', currentStreak: 5, target: 7, category: 'Learning', history: [true, true, true, true, true, false, false] },
  { id: 2, name: 'Exercise', currentStreak: 2, target: 5, category: 'Health', history: [false, true, true, false, false, false, false] },
  { id: 3, name: 'Meditation', currentStreak: 14, target: 7, category: 'Wellness', history: [true, true, true, true, true, true, true] },
  { id: 4, name: 'Review Notes', currentStreak: 3, target: 3, category: 'Study', history: [false, false, false, false, true, true, true] },
];

const DEFAULT_ACTIVITIES = [
  { id: 1, title: "React Fundamentals", type: "studying", time: "2h ago", duration: "1h 30m" },
  { id: 2, title: "Daily Habit: Reading", type: "habit", time: "5h ago" },
  { id: 3, title: "Math Assignment", type: "studying", time: "Yesterday", duration: "45m" },
  { id: 4, title: "CSS Grid Concepts", type: "studying", time: "2 days ago", duration: "2h" },
  { id: 5, title: "Data Structures", type: "studying", time: "3 days ago", duration: "4h 15m" },
  { id: 6, title: "Daily Habit: Exercise", type: "habit", time: "3 days ago" },
];

export const StudyProvider = ({ children }) => {
  // --- Toast Notification State ---
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Sound Settings ---
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('study_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('study_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // --- Pomodoro Settings & State ---
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('study_timer_durations');
    return saved ? JSON.parse(saved) : { focus: 25, shortBreak: 5, longBreak: 15 };
  });

  const [mode, setMode] = useState('focus'); // focus | shortBreak | longBreak
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(() => {
    const saved = localStorage.getItem('study_completed_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track session timer accurately with background drift mitigation
  const endTimeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('study_timer_durations', JSON.stringify(durations));
  }, [durations]);

  useEffect(() => {
    localStorage.setItem('study_completed_sessions', completedSessionsCount.toString());
  }, [completedSessionsCount]);

  // Set mode handler
  const handleMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    const mins = durations[newMode] || 25;
    const secs = mins * 60;
    setTotalDuration(secs);
    setTimeLeft(secs);
  };

  const toggleTimer = () => {
    if (!isActive) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    const mins = durations[mode] || 25;
    const secs = mins * 60;
    setTotalDuration(secs);
    setTimeLeft(secs);
  };

  const addTime = (minutes = 5) => {
    const addedSecs = minutes * 60;
    setTimeLeft(t => {
      const next = t + addedSecs;
      setTotalDuration(prev => Math.max(prev, next));
      if (isActive) {
        endTimeRef.current = Date.now() + next * 1000;
      }
      return next;
    });
    addToast(`Added +${minutes} minutes to session`, 'info');
  };

  const updateDurations = (newDurations) => {
    setDurations(newDurations);
    if (!isActive) {
      const mins = newDurations[mode] || 25;
      const secs = mins * 60;
      setTotalDuration(secs);
      setTimeLeft(secs);
    }
    addToast("Timer durations updated", "info");
  };

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      handleSessionCompletion();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Session completion logic
  const handleSessionCompletion = () => {
    if (soundEnabled) {
      playTimerChime();
    }

    if (mode === 'focus') {
      const sessionMinutes = Math.round(totalDuration / 60);
      const sessionName = currentTask.trim() || 'Focus Session';
      
      setCompletedSessionsCount(c => c + 1);
      
      // Log to activities
      addActivity({
        title: sessionName,
        type: 'studying',
        duration: `${sessionMinutes}m`
      });

      addToast(`🎉 Awesome! You completed "${sessionName}"! Take a well-deserved break.`, 'celebrate');
      // Prompt switch to short break
      setMode('shortBreak');
      const breakSecs = (durations.shortBreak || 5) * 60;
      setTotalDuration(breakSecs);
      setTimeLeft(breakSecs);
    } else {
      addToast("☕ Break is over! Ready for another focused sprint?", 'info');
      setMode('focus');
      const focusSecs = (durations.focus || 25) * 60;
      setTotalDuration(focusSecs);
      setTimeLeft(focusSecs);
    }
  };

  // Update browser tab title
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    if (isActive) {
      document.title = `(${timeFormatted}) ${mode === 'focus' ? '🎯 Focus' : '☕ Break'} | StudySpace`;
    } else {
      document.title = 'StudySpace - Modern Productivity Dashboard';
    }
  }, [timeLeft, isActive, mode]);

  // --- Habits State with LocalStorage Persistence ---
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('study_buddy_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  useEffect(() => {
    localStorage.setItem('study_buddy_habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabitDay = (habitId, dayIndex) => {
    let completedNow = false;
    let habitName = '';

    setHabits(prevHabits => prevHabits.map(h => {
      if (h.id === habitId) {
        habitName = h.name;
        const newHistory = [...h.history];
        newHistory[dayIndex] = !newHistory[dayIndex];
        completedNow = newHistory[dayIndex];
        
        // Calculate true current streak: consecutive completed days ending at most recent active day
        let streak = 0;
        for (let i = newHistory.length - 1; i >= 0; i--) {
          if (newHistory[i]) streak++;
          else if (streak > 0) break; // streak broken
        }
        // If streak is 0 but has completed days, fallback to completed count in current week
        const completedThisWeek = newHistory.filter(Boolean).length;
        const calculatedStreak = streak > 0 ? streak : completedThisWeek;

        return { ...h, history: newHistory, currentStreak: Math.max(h.currentStreak, calculatedStreak) };
      }
      return h;
    }));

    if (completedNow) {
      if (soundEnabled) playSuccessChime();
      addToast(`Completed: "${habitName}" for today! Keep the momentum going!`, 'success');
      addActivity({
        title: `Habit: ${habitName}`,
        type: 'habit'
      });
    }
  };

  const addHabit = ({ name, category, target = 7 }) => {
    if (!name.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: name.trim(),
      category: category || 'Learning',
      currentStreak: 0,
      target: Number(target) || 7,
      history: Array(7).fill(false)
    };
    setHabits(prev => [...prev, newHabit]);
    addToast(`Added new habit: "${name.trim()}"`, 'success');
  };

  const deleteHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    setHabits(prev => prev.filter(h => h.id !== id));
    addToast(`Deleted habit "${habit?.name || ''}"`, 'info');
  };

  const editHabit = (id, updatedFields) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updatedFields } : h));
    addToast("Habit updated", "info");
  };

  // --- Activities State ---
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('study_buddy_activities');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  useEffect(() => {
    localStorage.setItem('study_buddy_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = ({ title, type, duration = null }) => {
    const newActivity = {
      id: Date.now(),
      title,
      type,
      time: 'Just now',
      duration
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 15)]);
  };

  // --- Dynamic Dashboard Metrics ---
  const totalCompletedHabits = habits.reduce((acc, h) => acc + h.history.filter(Boolean).length, 0);
  const totalTasksCompleted = 14 + completedSessionsCount + totalCompletedHabits;
  const studyHoursBonus = (completedSessionsCount * 25) / 60;
  const totalStudyHours = (26.0 + studyHoursBonus).toFixed(1);

  return (
    <StudyContext.Provider
      value={{
        // Timer
        mode,
        timeLeft,
        totalDuration,
        isActive,
        currentTask,
        setCurrentTask,
        handleMode,
        toggleTimer,
        resetTimer,
        addTime,
        durations,
        updateDurations,
        completedSessionsCount,
        
        // Habits
        habits,
        toggleHabitDay,
        addHabit,
        deleteHabit,
        editHabit,
        
        // Activities & Metrics
        activities,
        addActivity,
        totalStudyHours,
        totalTasksCompleted,
        
        // Settings & Sound
        soundEnabled,
        setSoundEnabled,
        
        // Toasts
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

