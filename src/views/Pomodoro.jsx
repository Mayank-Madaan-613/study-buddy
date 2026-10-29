import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Icons } from '../components/Icons';
import { useStudy } from '../context/StudyContext';

const PomodoroView = () => {
  const {
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
    completedSessionsCount
  } = useStudy();

  const [showSettings, setShowSettings] = useState(false);
  const [tempDurations, setTempDurations] = useState(durations);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const radius = 135;
  const circumference = radius * 2 * Math.PI;
  // Guard against divide-by-zero or negative offsets
  const progressRatio = totalDuration > 0 ? Math.min(Math.max(timeLeft / totalDuration, 0), 1) : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const quickTasks = ['Programming', 'Math Problem Set', 'Reading Notes', 'Exam Revision', 'Essay Writing'];

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateDurations(tempDurations);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[82vh] py-4 w-full max-w-4xl mx-auto space-y-6">
      {/* View Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Focus Session
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {completedSessionsCount} completed today
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Science-backed intervals to sustain deep focus.</p>
        </div>

        <button
          onClick={() => {
            setTempDurations(durations);
            setShowSettings(true);
          }}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-2 text-sm font-medium"
          title="Timer Settings"
        >
          <Icons.Settings className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Mode Presets */}
      <div className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
        <button 
          onClick={() => handleMode('focus')} 
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            mode === 'focus' 
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Focus ({durations.focus}m)
        </button>
        <button 
          onClick={() => handleMode('shortBreak')} 
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            mode === 'shortBreak' 
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Short Break ({durations.shortBreak}m)
        </button>
        <button 
          onClick={() => handleMode('longBreak')} 
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            mode === 'longBreak' 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Long Break ({durations.longBreak}m)
        </button>
      </div>

      {/* Main Focus Card */}
      <Card className="w-full flex flex-col items-center py-10 px-6 border-slate-800/80 bg-slate-900/40 relative overflow-hidden">
        {/* Glow backdrop */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[110px] -z-10 transition-colors duration-700 ${
            isActive 
              ? mode === 'focus' 
                ? 'bg-indigo-600/25' 
                : 'bg-emerald-500/25' 
              : 'bg-indigo-900/10'
          }`}
        />

        {/* Task tagging input */}
        <div className="w-full max-w-md mb-8 flex flex-col items-center space-y-2">
          <input
            type="text"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="What study task are you tackling? (Optional)"
            className="w-full text-center bg-slate-800/50 hover:bg-slate-800/80 focus:bg-slate-800/90 border border-slate-700/60 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
          {/* Quick task pills */}
          {!currentTask && (
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {quickTasks.map((task) => (
                <button
                  key={task}
                  onClick={() => setCurrentTask(task)}
                  className="text-[11px] font-medium text-slate-400 hover:text-indigo-300 bg-slate-800/40 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
                >
                  + {task}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Circular Timer Ring */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-8 drop-shadow-2xl">
          <svg className="w-full h-full -rotate-90 top-0 left-0 absolute" viewBox="0 0 300 300">
            <defs>
              <linearGradient id="timerGradientFocus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="timerGradientBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background ring */}
            <circle 
              cx="150" 
              cy="150" 
              r={radius} 
              stroke="currentColor" 
              strokeWidth="10" 
              fill="none" 
              className="text-slate-800/70" 
            />
            {/* Animated progress ring */}
            <circle 
              cx="150" 
              cy="150" 
              r={radius} 
              stroke={mode === 'focus' ? "url(#timerGradientFocus)" : "url(#timerGradientBreak)"} 
              strokeWidth="10" 
              fill="none" 
              strokeLinecap="round" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }} 
            />
          </svg>

          {/* Central Counter Display */}
          <div className="flex flex-col items-center select-none z-10">
            <h2 className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-none tabular-nums drop-shadow-md">
              {formatTime(timeLeft)}
            </h2>
            <div className="mt-3.5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <p className="text-slate-400 uppercase tracking-[0.25em] font-bold text-[11px]">
                {isActive ? (mode === 'focus' ? 'Deep Work' : 'Resting') : 'Paused'}
              </p>
            </div>
            {currentTask && (
              <span className="mt-2 text-xs font-semibold text-indigo-300 max-w-[200px] truncate bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                {currentTask}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-6 sm:gap-8">
          <button 
            onClick={resetTimer} 
            className="p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80 shadow-md hover:scale-105 active:scale-95"
            title="Reset Session"
          >
            <Icons.Refresh className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button 
            onClick={toggleTimer} 
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-xl group hover:scale-105 active:scale-95 ${
              isActive 
                ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/30' 
                : mode === 'focus' 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30' 
                : 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-teal-500/30'
            }`}
            title={isActive ? 'Pause' : 'Start Focus'}
          >
            {isActive ? (
              <Icons.Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white transition-transform group-hover:scale-110" />
            ) : (
              <Icons.Play className="w-8 h-8 sm:w-10 sm:h-10 text-white transition-transform group-hover:scale-110 ml-1" />
            )}
          </button>
          
          <button 
            onClick={() => addTime(5)} 
            className="p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80 shadow-md hover:scale-105 active:scale-95 flex items-center gap-1"
            title="Extend by 5 minutes"
          >
            <Icons.Plus className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300">5m</span>
          </button>
        </div>
      </Card>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Icons.Settings className="w-5 h-5 text-indigo-400" />
                  Customize Timer
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={tempDurations.focus}
                    onChange={(e) => setTempDurations({ ...tempDurations, focus: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={tempDurations.shortBreak}
                    onChange={(e) => setTempDurations({ ...tempDurations, shortBreak: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={tempDurations.longBreak}
                    onChange={(e) => setTempDurations({ ...tempDurations, longBreak: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PomodoroView;
