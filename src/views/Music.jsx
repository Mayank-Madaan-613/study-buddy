import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Icons } from '../components/Icons';
import { useStudy, PRESETS } from '../context/StudyContext';

const SoundIconComponent = ({ iconName, className = "w-5 h-5" }) => {
  switch (iconName) {
    case 'Music': return <Icons.Music className={className} />;
    case 'CloudRain': return <Icons.CloudRain className={className} />;
    case 'Flame': return <Icons.Flame className={className} />;
    case 'Waves': return <Icons.Waves className={className} />;
    case 'Wind': return <Icons.Wind className={className} />;
    case 'Headphones': return <Icons.Headphones className={className} />;
    case 'Disc': return <Icons.Disc className={className} />;
    default: return <Icons.Music className={className} />;
  }
};

const MusicView = () => {
  const {
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
    setSleepTimer
  } = useStudy();

  const activeSoundsCount = Object.values(soundMixer).filter(s => s.enabled).length;

  // Find currently active preset or title
  const activePresetObj = PRESETS.find(p => p.id === activePreset);
  const nowPlayingTitle = activePresetObj
    ? activePresetObj.title
    : activeSoundsCount > 0
    ? `${activeSoundsCount} Layer Custom Soundscape`
    : 'No Soundscape Active';

  const nowPlayingDesc = activePresetObj
    ? activePresetObj.description
    : activeSoundsCount > 0
    ? 'Custom soundboard mix active in background'
    : 'Select a soundscape preset or customize individual ambient layers below';

  return (
    <div className="space-y-8 pt-2 pb-12 max-w-5xl mx-auto">
      {/* View Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Study Soundscapes & Lo-Fi
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              100% Offline & Infinite
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Scientifically tuned ambient noise, binaural alpha waves, and lo-fi chords to anchor your focus.
          </p>
        </div>

        {/* Global Stop button if playing */}
        {isMusicPlaying && (
          <button
            onClick={stopAllMusic}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold self-start sm:self-auto shadow-md"
          >
            <Icons.Pause className="w-4 h-4 text-rose-400" />
            Stop All Audio
          </button>
        )}
      </header>

      {/* Now Playing Hero Deck */}
      <Card className="relative overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/90 p-6 sm:p-8">
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors duration-700 ${
          isMusicPlaying ? 'bg-indigo-600/25' : 'bg-transparent'
        }`}></div>

        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
          {/* Animated Spinning Vinyl / Visualizer */}
          <div className="relative shrink-0">
            <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-1000 ${
              isMusicPlaying ? 'animate-[spin_12s_linear_infinite]' : ''
            }`}>
              {/* Vinyl grooves */}
              <div className="absolute inset-2 rounded-full border border-slate-700/40"></div>
              <div className="absolute inset-5 rounded-full border border-slate-700/30"></div>
              <div className="absolute inset-8 rounded-full border border-slate-700/20"></div>
              
              {/* Vinyl center label */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-primary to-teal-400 flex items-center justify-center shadow-inner text-white font-bold text-xs">
                <Icons.Music className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Glowing ring when active */}
            {isMusicPlaying && (
              <span className="absolute -inset-1.5 rounded-full border-2 border-indigo-400/40 animate-pulse pointer-events-none"></span>
            )}
          </div>

          {/* Track Info & Controls */}
          <div className="flex-1 text-center md:text-left min-w-0 w-full">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMusicPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                {isMusicPlaying ? 'Streaming In Background' : 'Audio Standby'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white truncate mb-1">
              {nowPlayingTitle}
            </h3>
            <p className="text-slate-400 text-sm mb-5 max-w-lg">
              {nowPlayingDesc}
            </p>

            {/* Sound Wave Frequency Bars Animation */}
            {isMusicPlaying && (
              <div className="flex items-center justify-center md:justify-start gap-1 mb-5 h-6">
                {[40, 75, 55, 90, 60, 80, 45, 95, 70, 85, 50, 65, 80, 55, 90, 60, 75, 45].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [`${height * 0.3}%`, `${height}%`, `${height * 0.4}%`],
                    }}
                    transition={{
                      duration: 0.8 + (i % 5) * 0.15,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-gradient-to-t from-indigo-500 to-teal-400 rounded-full"
                  />
                ))}
              </div>
            )}

            {/* Master Volume & Sleep Timer Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 pt-1">
              {/* Master Volume */}
              <div className="flex items-center gap-2.5 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/60">
                <Icons.Volume className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={masterVolume}
                  onChange={(e) => setMasterMusicVolume(parseFloat(e.target.value))}
                  className="w-24 sm:w-28 accent-indigo-500 cursor-pointer h-1.5"
                  title="Master Volume"
                />
                <span className="text-[11px] font-semibold text-slate-300 w-8">
                  {Math.round(masterVolume * 100)}%
                </span>
              </div>

              {/* Sleep Timer Options */}
              <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-400 text-[11px] font-medium mr-1">Sleep Timer:</span>
                {[null, 15, 25, 45].map((mins) => (
                  <button
                    key={mins === null ? 'off' : mins}
                    onClick={() => setSleepTimer(mins)}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all ${
                      sleepTimerMinutes === mins
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {mins === null ? 'Off' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preset Soundscapes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Icons.Sparkles className="w-5 h-5 text-indigo-400" />
              Focus Presets
            </h3>
            <p className="text-xs text-slate-400">One-click balanced acoustic environments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <motion.div
                key={preset.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyPreset(preset.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/15'
                    : 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shadow-md`}>
                    <SoundIconComponent iconName={preset.icon} className="w-5 h-5" />
                  </div>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Playing
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                      Play <Icons.Play className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Multi-Track Custom Ambient Mixer */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Icons.Sliders className="w-5 h-5 text-teal-400" />
            Ambient Mixer Board
          </h3>
          <p className="text-xs text-slate-400">
            Blend multiple natural sounds and lo-fi chords simultaneously with individual volume faders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {Object.entries(soundMixer).map(([soundKey, sound]) => {
            return (
              <div
                key={soundKey}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  sound.enabled
                    ? 'bg-slate-800/80 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                {/* Toggle button */}
                <button
                  onClick={() => toggleAmbientSound(soundKey)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    sound.enabled
                      ? 'bg-gradient-to-br from-indigo-500 to-teal-400 text-white shadow-md shadow-indigo-500/25 scale-105'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title={sound.enabled ? "Mute sound" : "Activate sound"}
                >
                  <SoundIconComponent iconName={sound.icon} className="w-6 h-6" />
                </button>

                {/* Sound Name & Volume Slider */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-bold truncate ${sound.enabled ? 'text-white' : 'text-slate-300'}`}>
                      {sound.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {sound.enabled ? `${Math.round(sound.volume * 100)}%` : 'Off'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    disabled={!sound.enabled}
                    value={sound.volume}
                    onChange={(e) => setAmbientVolume(soundKey, parseFloat(e.target.value))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                      sound.enabled
                        ? 'accent-indigo-400 bg-slate-700'
                        : 'accent-slate-600 bg-slate-800 opacity-40 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Science & Benefits Insight Card */}
      <Card className="bg-gradient-to-br from-indigo-950/30 to-slate-900/60 border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0 text-indigo-400">
            <Icons.Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              Why Ambient Study Soundscapes Work
              <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Cognitive Science
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>14Hz Alpha waves</strong> stimulate the frequency associated with calm, focused awareness. 
              <strong> Brown noise</strong> provides stochastic acoustic masking that dampens sudden environmental distractions, 
              while <strong>mellow chord progressions</strong> maintain a baseline of dopamine release without cognitive lyrical overload.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MusicView;

