import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Icons } from '../components/Icons';
import { useStudy } from '../context/StudyContext';

const HomeView = ({ setView }) => {
  const { totalStudyHours, habits, completedSessionsCount } = useStudy();

  const features = [
    { 
      id: 'dashboard',
      title: "Smart Analytics", 
      desc: "Visualize your focus trends, study hours, and weekly performance metrics.", 
      icon: Icons.Dashboard, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10 border-blue-500/20" 
    },
    { 
      id: 'pomodoro',
      title: "Focus Sessions", 
      desc: "Scientifically structured Pomodoro intervals with custom audio cues.", 
      icon: Icons.Timer, 
      color: "text-rose-400", 
      bg: "bg-rose-500/10 border-rose-500/20" 
    },
    { 
      id: 'habits',
      title: "Habit Tracking", 
      desc: "Build daily discipline with interactive weekly grids and streak motivation.", 
      icon: Icons.Checklist, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10 border-emerald-500/20" 
    },
    { 
      id: 'chat',
      title: "AI Study Tutor", 
      desc: "Get instant explanations, study techniques, and active recall assistance.", 
      icon: Icons.Chat, 
      color: "text-indigo-400", 
      bg: "bg-indigo-500/10 border-indigo-500/20" 
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 max-w-3xl relative px-2"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gradient-to-tr from-indigo-600/25 via-teal-500/20 to-purple-600/25 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 mb-2 shadow-lg shadow-indigo-500/5 backdrop-blur-md"
        >
          <Icons.Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs sm:text-sm font-semibold">Your Unified Study & Productivity Command Center</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
        >
          Supercharge your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-300">
            Study Sessions
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Track habits, master your focus with intelligent Pomodoro intervals, and get instant guidance from your AI study tutor.
        </motion.p>
        
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Button 
            onClick={() => setView('dashboard')} 
            className="px-8 py-3.5 text-base sm:text-lg rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-xl shadow-indigo-500/30 font-bold"
          >
            Launch Dashboard <Icons.ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setView('pomodoro')} 
            className="px-8 py-3.5 text-base sm:text-lg rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200 font-semibold"
          >
            Start Focus Timer
          </Button>
        </motion.div>

        {/* Live Quick Counter Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span><strong className="text-white">{totalStudyHours}h</strong> Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span><strong className="text-white">{habits.length}</strong> Habits Tracked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span><strong className="text-white">{completedSessionsCount}</strong> Sprints Today</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl mt-12 z-10 text-left">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 120 }}
            whileHover={{ y: -6 }}
            onClick={() => setView(feature.id)}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
              Open Tool <Icons.ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
