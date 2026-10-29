import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { useStudy } from '../context/StudyContext';
import { ToastContainer } from './ToastContainer';

const Layout = ({ children, view, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    isActive, 
    timeLeft, 
    mode, 
    toggleTimer, 
    soundEnabled, 
    setSoundEnabled,
    completedSessionsCount 
  } = useStudy();

  const navItems = [
    { id: 'home', label: 'Home', icon: Icons.Home },
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'pomodoro', label: 'Focus Timer', icon: Icons.Timer },
    { id: 'habits', label: 'Habit Tracker', icon: Icons.Checklist },
    { id: 'chat', label: 'AI StudyBot', icon: Icons.Chat },
  ];

  const formatMinSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] text-slate-100 flex overflow-hidden selection:bg-indigo-500/30">
      {/* Background ambient lighting */}
      <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 glass-panel border-r border-slate-800/80 z-20 sticky top-0 h-screen select-none">
        {/* Brand header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
          <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white font-extrabold text-lg group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                StudySpace
              </h1>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-indigo-400">AI Productivity</p>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors"
            title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
          >
            {soundEnabled ? <Icons.Volume className="w-4 h-4 text-indigo-400" /> : <Icons.VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
        
        {/* Navigation list */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto w-full relative">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-slate-500">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 relative group ${
                view === item.id 
                  ? 'text-white font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {view === item.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-teal-500/10 border border-indigo-500/30 rounded-xl z-0 shadow-inner" 
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3 w-full">
                <item.icon className={`w-5 h-5 transition-colors ${
                  view === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span className="text-sm">{item.label}</span>
                {item.id === 'pomodoro' && isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* Mini Active Pomodoro Card in Sidebar (visible if timer is running or outside pomodoro view) */}
        <div className="p-4 border-t border-slate-800/60 space-y-3">
          <div 
            onClick={() => setView('pomodoro')}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
              isActive 
                ? 'bg-indigo-950/40 border-indigo-500/40 hover:border-indigo-400/60 shadow-lg shadow-indigo-500/10' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                {mode === 'focus' ? 'Focus Session' : 'Break Time'}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleTimer(); }}
                className="p-1 hover:text-white text-slate-400 transition-colors"
                title={isActive ? "Pause timer" : "Start timer"}
              >
                {isActive ? <Icons.Pause className="w-4 h-4 text-amber-400" /> : <Icons.Play className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black tracking-tight text-white tabular-nums">
                {formatMinSec(timeLeft)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {completedSessionsCount} {completedSessionsCount === 1 ? 'sprint' : 'sprints'} done
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden glass-panel border-b border-slate-800/80 p-4 flex items-center justify-between sticky top-0 z-30">
          <div onClick={() => setView('home')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              S
            </div>
            <h1 className="text-lg font-bold text-white">StudySpace</h1>
          </div>

          <div className="flex items-center gap-2">
            {isActive && (
              <button 
                onClick={() => setView('pomodoro')} 
                className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-pulse"
              >
                <Icons.Timer className="w-3.5 h-3.5" />
                {formatMinSec(timeLeft)}
              </button>
            )}

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl"
              title="Toggle audio"
            >
              {soundEnabled ? <Icons.Volume className="w-4 h-4 text-indigo-400" /> : <Icons.VolumeX className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown & Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-20"
              />
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden glass-panel border-b border-slate-700/80 absolute top-[65px] left-0 w-full z-30 shadow-2xl overflow-hidden"
              >
                <nav className="p-4 flex flex-col gap-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl transition-all ${
                        view === item.id 
                          ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative w-full scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global Interactive Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Layout;
