import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playTimerChime, playSuccessChime } from '../utils/sound';
import { SoundEngine } from '../utils/ambientAudio';

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

const DEFAULT_MIXER = {
  lofiChords: { enabled: false, volume: 0.6, name: 'Lo-Fi Jazz Chords', icon: 'Music' },
  rain: { enabled: false, volume: 0.5, name: 'Gentle Rain', icon: 'CloudRain' },
  campfire: { enabled: false, volume: 0.4, name: 'Crackling Fire', icon: 'Flame' },
  waves: { enabled: false, volume: 0.45, name: 'Ocean Waves', icon: 'Waves' },
  wind: { enabled: false, volume: 0.35, name: 'Forest Wind', icon: 'Wind' },
  brownNoise: { enabled: false, volume: 0.5, name: 'Deep Brown Noise', icon: 'Headphones' },
  binaural: { enabled: false, volume: 0.5, name: '14Hz Alpha Beats', icon: 'Disc' },
};

export const PRESETS = [
  {
    id: 'lofi_chill',
    title: 'Lo-Fi Rain Lounge',
    description: 'Mellow electric piano chords with soft rainfall',
    icon: 'Music',
    color: 'from-indigo-600 to-purple-600',
    sounds: { lofiChords: 0.65, rain: 0.45 },
  },
  {
    id: 'deep_focus',
    title: 'Deep Alpha Flow',
    description: '14Hz binaural beats with distraction-masking brown noise',
    icon: 'Headphones',
    color: 'from-blue-600 to-cyan-600',
    sounds: { binaural: 0.6, brownNoise: 0.5 },
  },
  {
    id: 'cozy_night',
    title: 'Cozy Fireplace',
    description: 'Warm fireplace crackles, steady rain & soothing chords',
    icon: 'Flame',
    color: 'from-amber-600 to-rose-600',
    sounds: { campfire: 0.6, rain: 0.4, lofiChords: 0.4 },
  },
  {
    id: 'ocean_retreat',
    title: 'Ocean Horizon',
    description: 'Slow ocean swells paired with calming alpha waves',
    icon: 'Waves',
    color: 'from-teal-600 to-emerald-600',
    sounds: { waves: 0.65, binaural: 0.4 },
  },
  {
    id: 'quiet_forest',
    title: 'Forest Sanctuary',
    description: 'Whispering pine trees with gentle rain & lo-fi vibes',
    icon: 'Wind',
    color: 'from-emerald-600 to-teal-700',
    sounds: { wind: 0.5, rain: 0.35, lofiChords: 0.4 },
  },
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

  // --- Sound Settings (Audio cues) ---
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('study_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('study_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // --- Ambient Music & Soundscape State ---
  const [soundMixer, setSoundMixer] = useState(DEFAULT_MIXER);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [activePreset, setActivePreset] = useState(null);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const sleepTimerRef = useRef(null);

  const isMusicPlaying = Object.values(soundMixer).some(s => s.enabled);

  const toggleAmbientSound = (soundKey) => {
    setSoundMixer(prev => {
      const current = prev[soundKey];
      const willEnable = !current.enabled;
      SoundEngine.toggleSound(soundKey, willEnable, current.volume);
      return {
        ...prev,
        [soundKey]: {
          ...current,
          enabled: willEnable,
        }
      };
    });
    setActivePreset(null);
  };

  const setAmbientVolume = (soundKey, vol) => {
    const clamped = Math.max(0, Math.min(1, vol));
    SoundEngine.setSoundVolume(soundKey, clamped);
    setSoundMixer(prev => ({
      ...prev,
      [soundKey]: {
        ...prev[soundKey],
        volume: clamped,
      }
    }));
  };

  const setMasterMusicVolume = (vol) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setMasterVolume(clamped);
    SoundEngine.setMasterVolume(clamped);
  };

  const applyPreset = (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    SoundEngine.stopAll();

    setSoundMixer(prev => {
      const nextMixer = {};
      Object.keys(prev).forEach(key => {
        const isPresetSound = Boolean(preset.sounds[key]);
        const targetVol = isPresetSound ? preset.sounds[key] : prev[key].volume;
        nextMixer[key] = {
          ...prev[key],
          enabled: isPresetSound,
          volume: targetVol,
        };
        if (isPresetSound) {
          SoundEngine.toggleSound(key, true, targetVol);
        }
      });
      return nextMixer;
    });

    setActivePreset(presetId);
    addToast(`Playing soundscape: ${preset.title} 🎧`, 'info');
  };

  const stopAllMusic = () => {
    SoundEngine.stopAll();
    setSoundMixer(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        next[k] = { ...prev[k], enabled: false };
      });
      return next;
    });
    setActivePreset(null);
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
      setSleepTimerMinutes(null);
    }
  };

  const setSleepTimer = (mins) => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (mins === null || mins === 0) {
      setSleepTimerMinutes(null);
      addToast("Sleep timer disabled", "info");
      return;
    }

    setSleepTimerMinutes(mins);
    addToast(`Sleep timer set: Audio will stop in ${mins} minutes`, 'info');
    sleepTimerRef.current = setTimeout(() => {
      stopAllMusic();
      addToast("Sleep timer reached: Music stopped", "info");
    }, mins * 60 * 1000);
  };

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

  const endTimeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('study_timer_durations', JSON.stringify(durations));
  }, [durations]);

  useEffect(() => {
    localStorage.setItem('study_completed_sessions', completedSessionsCount.toString());
  }, [completedSessionsCount]);

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

  const handleSessionCompletion = () => {
    if (soundEnabled) {
      playTimerChime();
    }

    if (mode === 'focus') {
      const sessionMinutes = Math.round(totalDuration / 60);
      const sessionName = currentTask.trim() || 'Focus Session';
      
      setCompletedSessionsCount(c => c + 1);
      
      addActivity({
        title: sessionName,
        type: 'studying',
        duration: `${sessionMinutes}m`
      });

      addToast(`🎉 Awesome! You completed "${sessionName}"! Take a well-deserved break.`, 'celebrate');
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

  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    if (isActive) {
      document.title = `(${timeFormatted}) ${mode === 'focus' ? '🎯 Focus' : '☕ Break'} | StudySpace`;
    } else if (isMusicPlaying) {
      document.title = `🎵 Playing Study Audio | StudySpace`;
    } else {
      document.title = 'StudySpace - Modern Productivity Dashboard';
    }
  }, [timeLeft, isActive, mode, isMusicPlaying]);

  // --- Habits State ---
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
        
        let streak = 0;
        for (let i = newHistory.length - 1; i >= 0; i--) {
          if (newHistory[i]) streak++;
          else if (streak > 0) break;
        }
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
        
        // Ambient Soundscape & Study Music
        soundMixer,
        masterVolume,
        activePreset,
        isMusicPlaying,
        toggleAmbientSound,
        setAmbientVolume,
        setMasterMusicVolume,
        applyPreset,
        stopAllMusic,
        sleepTimerMinutes,
        setSleepTimer,
        
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
