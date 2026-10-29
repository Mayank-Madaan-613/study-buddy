import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Icons } from '../components/Icons';
import { useStudy } from '../context/StudyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-indigo-300">
          {payload[0].value} <span className="text-xs font-normal text-slate-400">hours studied</span>
        </p>
      </div>
    );
  }
  return null;
};

const DashboardView = ({ setView }) => {
  const { 
    totalStudyHours, 
    totalTasksCompleted, 
    activities, 
    completedSessionsCount, 
    habits, 
    toggleHabitDay 
  } = useStudy();

  const [timeframe, setTimeframe] = useState('This Week');
  const [activityFilter, setActivityFilter] = useState('all');
  const [showAllActivities, setShowAllActivities] = useState(false);

  const todayIndex = new Date().getDay();

  // Dynamic Chart Data with boost from today's completed pomodoros
  const todayExtraHours = (completedSessionsCount * 25) / 60;

  const dataThisWeek = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 4.0 },
    { name: 'Wed', hours: 3.2 },
    { name: 'Thu', hours: 5.0 },
    { name: 'Fri', hours: 2.0 },
    { name: 'Sat', hours: 6.5 },
    { name: 'Sun', hours: Number((3.5 + todayExtraHours).toFixed(1)) },
  ];

  const dataLastWeek = [
    { name: 'Mon', hours: 3.0 },
    { name: 'Tue', hours: 2.0 },
    { name: 'Wed', hours: 6.0 },
    { name: 'Thu', hours: 4.5 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 1.5 },
    { name: 'Sun', hours: 5.0 },
  ];

  const data = timeframe === 'This Week' ? dataThisWeek : dataLastWeek;

  const filteredActivities = activities.filter(act => {
    if (activityFilter === 'all') return true;
    return act.type === activityFilter;
  });

  const displayedActivities = showAllActivities 
    ? filteredActivities 
    : filteredActivities.slice(0, 5);

  return (
    <div className="space-y-6 pt-2 pb-10">
      {/* Welcome Banner */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Study Analytics
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            Welcome back! Here's your study performance and active goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-300">5-Day Active Streak 🔥</span>
          </div>

          {setView && (
            <button
              onClick={() => setView('pomodoro')}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
            >
              <Icons.Timer className="w-4 h-4" /> Start Focus
            </button>
          )}
        </div>
      </header>

      {/* Metric Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <Card className="bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-900/90 border-indigo-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-indigo-200/80 text-xs font-semibold uppercase tracking-wider mb-1">Total Study Hours</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white">
                {totalStudyHours}<span className="text-xl text-indigo-300/70 ml-1">h</span>
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
                ↑ +2.4h vs last week
              </p>
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
              <Icons.Timer className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-950/50 via-slate-900/80 to-slate-900/90 border-teal-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-teal-200/80 text-xs font-semibold uppercase tracking-wider mb-1">Tasks Completed</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white">{totalTasksCompleted}</h3>
              <p className="text-[11px] text-teal-300 font-medium mt-2">
                Across habits & sessions
              </p>
            </div>
            <div className="p-3 bg-teal-500/20 rounded-2xl border border-teal-500/30 text-teal-400">
              <Icons.Checklist className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/50 via-slate-900/80 to-slate-900/90 border-purple-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-purple-200/80 text-xs font-semibold uppercase tracking-wider mb-1">Focus Sprints</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white">{completedSessionsCount}</h3>
              <p className="text-[11px] text-purple-300 font-medium mt-2">
                Pomodoros logged
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-400">
              <Icons.Trophy className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-rose-950/50 via-slate-900/80 to-slate-900/90 border-rose-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-rose-200/80 text-xs font-semibold uppercase tracking-wider mb-1">Focus Score</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white">94<span className="text-xl text-rose-300/70 ml-1">%</span></h3>
              <p className="text-[11px] text-emerald-400 font-medium mt-2">
                Top 5% student benchmark
              </p>
            </div>
            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-500/30 text-rose-400">
              <Icons.Sparkles className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Interactive Chart & Quick Checklist Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-2 min-w-0"
        >
          <Card className="h-full border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">Study Consistency</h3>
                <p className="text-xs text-slate-400">Hours invested per day</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setTimeframe('This Week')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === 'This Week'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeframe('Last Week')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === 'Last Week'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Last Week
                </button>
              </div>
            </div>

            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.5 }} />
                  <Bar dataKey="hours" fill="url(#barGradient)" radius={[8, 8, 2, 2]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        {/* Today's Habit Quick-Check */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <Card className="h-full border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Icons.Target className="w-5 h-5 text-teal-400" />
                  Today's Habits
                </h3>
                {setView && (
                  <button 
                    onClick={() => setView('habits')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View All →
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-4">Click to mark off habits directly from here.</p>

              <div className="space-y-2.5">
                {habits.slice(0, 4).map((habit) => {
                  const isDoneToday = habit.history[todayIndex];
                  return (
                    <div 
                      key={habit.id}
                      onClick={() => toggleHabitDay(habit.id, todayIndex)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isDoneToday 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          isDoneToday 
                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                            : 'border-slate-600 bg-slate-800 text-transparent'
                        }`}>
                          <Icons.Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-sm font-medium ${isDoneToday ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {habit.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-400">
                        🔥 {habit.currentStreak}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Daily Completion</span>
                <span className="font-bold text-white">
                  {habits.filter(h => h.history[todayIndex]).length}/{habits.length} Done
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card className="border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-slate-400">Real-time log of your sessions and habit milestones</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                {['all', 'studying', 'habit'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                      activityFilter === f
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'studying' ? 'Study' : 'Habits'}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowAllActivities(!showAllActivities)} 
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 ml-2"
              >
                {showAllActivities ? 'Show Less' : 'View All'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedActivities.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 col-span-2">No activity logged for this filter.</p>
            ) : (
              displayedActivities.map((act, i) => (
                <div 
                  key={act.id || i} 
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-800/30 hover:bg-slate-800/70 transition-all border border-slate-800/80 hover:border-slate-700"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    act.type === 'studying' 
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' 
                      : 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                  }`}>
                    {act.type === 'studying' ? <Icons.Timer className="w-4 h-4" /> : <Icons.Checklist className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{act.title}</h4>
                    <p className="text-xs text-slate-500">{act.time}</p>
                  </div>
                  {act.duration && (
                    <span className="text-xs font-bold bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-lg border border-slate-700/60 shrink-0">
                      {act.duration}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardView;
