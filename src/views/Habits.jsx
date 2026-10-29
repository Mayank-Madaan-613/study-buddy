import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icons } from '../components/Icons';
import { useStudy } from '../context/StudyContext';

const HabitsView = () => {
  const { habits, toggleHabitDay, addHabit, deleteHabit } = useStudy();

  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Learning');
  const [target, setTarget] = useState(7);

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const todayIndex = new Date().getDay(); // 0 for Sunday ... 6 for Saturday

  const categories = ['Learning', 'Study', 'Health', 'Wellness', 'Coding'];

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Learning':
        return 'text-blue-300 bg-blue-500/15 border-blue-500/30';
      case 'Study':
        return 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30';
      case 'Health':
        return 'text-rose-300 bg-rose-500/15 border-rose-500/30';
      case 'Wellness':
        return 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
      case 'Coding':
        return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
      default:
        return 'text-slate-300 bg-slate-500/15 border-slate-500/30';
    }
  };

  const filteredHabits = activeFilter === 'All' 
    ? habits 
    : habits.filter(h => h.category === activeFilter);

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({ name, category, target });
    setName('');
    setCategory('Learning');
    setTarget(7);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pt-2 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            Habit Tracker
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {habits.length} habits active
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Consistency compounds. Check in daily to maintain streaks.</p>
        </div>

        <Button 
          onClick={() => setShowAddModal(true)} 
          className="rounded-xl px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/25 self-start sm:self-auto"
        >
          <Icons.Plus className="w-5 h-5 mr-1.5" /> New Habit
        </Button>
      </header>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeFilter === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <Icons.Checklist className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-300">No habits found</h3>
            <p className="text-sm text-slate-500 mt-1">Create a new habit or select another category filter.</p>
          </div>
        ) : (
          filteredHabits.map((habit, idx) => {
            const completedCount = habit.history.filter(Boolean).length;
            const progressPercent = Math.min(Math.round((completedCount / (habit.target || 7)) * 100), 100);

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={habit.id}
              >
                <Card className="border border-slate-800/80 hover:border-slate-700/80 transition-all bg-slate-900/40 p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                    {/* Habit Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white truncate max-w-xs" title={habit.name}>
                          {habit.name}
                        </h3>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-lg font-semibold border ${getCategoryBadge(habit.category)}`}>
                          {habit.category}
                        </span>
                        <button 
                          onClick={() => setHabitToDelete(habit)} 
                          className="ml-auto text-slate-500 hover:text-rose-400 p-1 transition-colors rounded-lg hover:bg-slate-800"
                          title="Delete Habit"
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Bar & Goal */}
                      <div className="space-y-1.5 mt-3 max-w-sm">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Weekly Goal</span>
                          <span className="text-slate-300 font-semibold">{completedCount}/{habit.target} days ({progressPercent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Streak Badges */}
                      <div className="flex items-center gap-3 text-xs mt-3.5">
                        <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Icons.Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                          {habit.currentStreak} Day Streak
                        </span>
                        {completedCount >= habit.target && (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            <Icons.Check className="w-3.5 h-3.5" /> Goal Met!
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Weekly Days Toggle Grid */}
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar self-start lg:self-auto">
                      {habit.history.map((status, i) => {
                        const isToday = i === todayIndex;
                        return (
                          <div key={i} className="flex flex-col items-center gap-1.5">
                            <span className={`text-[11px] font-bold ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>
                              {days[i]}
                            </span>
                            <button 
                              onClick={() => toggleHabitDay(habit.id, i)}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                status 
                                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95' 
                                  : 'bg-slate-800/80 border border-slate-700/80 text-transparent hover:border-slate-500 hover:text-slate-600 hover:scale-105 active:scale-95'
                              } ${isToday ? 'ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-900' : ''}`}
                              title={`${days[i]}: ${status ? 'Completed' : 'Click to mark complete'}`}
                            >
                              <Icons.Check className={`w-5 h-5 ${status ? 'text-white' : 'text-slate-600'}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* AI Behavioral Habit Insights */}
      <Card className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/80 border-indigo-500/30 overflow-hidden relative mt-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Icons.Sparkles className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
              Habit Coach Insight
              <span className="bg-gradient-to-r from-indigo-500 to-teal-400 px-2 py-0.5 rounded text-[10px] font-extrabold text-white tracking-wider uppercase">
                Habit Stacking
              </span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              Connecting a new study habit immediately to an established anchor (e.g. "After I complete a 25-minute Pomodoro, I will review flashcards for 5 minutes") increases long-term adherence by 64% through neurological association.
            </p>
          </div>
        </div>
      </Card>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Icons.Plus className="w-5 h-5 text-indigo-400" />
                  Add New Habit
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Read 30 mins, Review flashcards..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          category === cat
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Frequency: <span className="text-indigo-400 font-bold">{target} days/week</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1 day</span>
                    <span>4 days</span>
                    <span>7 days (Daily)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {habitToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-sm p-6 rounded-3xl border border-rose-500/30 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <Icons.Trash className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Delete Habit?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">"{habitToDelete.name}"</span>? Your streak data for this habit will be removed.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setHabitToDelete(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteHabit(habitToDelete.id);
                    setHabitToDelete(null);
                  }}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitsView;
