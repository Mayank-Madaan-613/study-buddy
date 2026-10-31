// Web Audio API Ambient Soundscape & Lo-Fi Generator Engine
// Provides 100% offline procedural ambient sounds (Rain, Campfire, Waves, Wind, Brown Noise, Binaural Alpha Beats)
// and curated Lo-Fi study audio streams.

let audioCtx = null;

export const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// --- Noise Buffer Helpers ---
let pinkNoiseBuffer = null;
let brownNoiseBuffer = null;
let whiteNoiseBuffer = null;

const createNoiseBuffers = (ctx) => {
  if (pinkNoiseBuffer && brownNoiseBuffer && whiteNoiseBuffer) return;
  
  const bufferSize = ctx.sampleRate * 5; // 5 seconds looped buffer
  whiteNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  pinkNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  brownNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

  const whiteOut = whiteNoiseBuffer.getChannelData(0);
  const pinkOut = pinkNoiseBuffer.getChannelData(0);
  const brownOut = brownNoiseBuffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let lastBrown = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    whiteOut[i] = white;

    // Pink noise (Paul Kellet's filtered white noise algorithm)
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    pinkOut[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;

    // Brown noise (integrated white noise)
    lastBrown = (lastBrown + (0.02 * white)) / 1.02;
    brownOut[i] = lastBrown * 3.5;
  }
};

// Store active audio nodes for procedural soundscapes
const activeSounds = {
  rain: null,
  campfire: null,
  waves: null,
  wind: null,
  brownNoise: null,
  binaural: null,
  lofiChords: null,
};

// --- Procedural Generators ---

// 1. Rain Generator
const startRain = (ctx, masterGain) => {
  createNoiseBuffers(ctx);
  const source = ctx.createBufferSource();
  source.buffer = pinkNoiseBuffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(1100, ctx.currentTime);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(300, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, ctx.currentTime);

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(masterGain);
  source.start();

  return {
    source,
    gainNode: gain,
    stop: () => {
      try { source.stop(); } catch (e) {}
    }
  };
};

// 2. Campfire Generator (Warm low-rumble with crackles)
const startCampfire = (ctx, masterGain) => {
  createNoiseBuffers(ctx);
  const source = ctx.createBufferSource();
  source.buffer = brownNoiseBuffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(350, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();

  // Procedural crackle pops
  let crackleTimer = null;
  const playCrackle = () => {
    if (!activeSounds.campfire) return;
    try {
      const osc = ctx.createOscillator();
      const crackleGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 1800, ctx.currentTime);
      crackleGain.gain.setValueAtTime(0.08 + Math.random() * 0.12, ctx.currentTime);
      crackleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(crackleGain);
      crackleGain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}

    const nextTime = 120 + Math.random() * 550;
    crackleTimer = setTimeout(playCrackle, nextTime);
  };
  playCrackle();

  return {
    source,
    gainNode: gain,
    stop: () => {
      if (crackleTimer) clearTimeout(crackleTimer);
      try { source.stop(); } catch (e) {}
    }
  };
};

// 3. Ocean Waves Generator (Pink noise swelling with an LFO)
const startWaves = (ctx, masterGain) => {
  createNoiseBuffers(ctx);
  const source = ctx.createBufferSource();
  source.buffer = pinkNoiseBuffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(350, ctx.currentTime);

  const swellGain = ctx.createGain();
  swellGain.gain.setValueAtTime(0.2, ctx.currentTime);

  // LFO for wave swells (0.12 Hz ~ 8-second swell cycle)
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(0.18, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(swellGain.gain);
  lfo.start();

  source.connect(filter);
  filter.connect(swellGain);
  swellGain.connect(masterGain);
  source.start();

  return {
    source,
    lfo,
    gainNode: swellGain,
    stop: () => {
      try { lfo.stop(); source.stop(); } catch (e) {}
    }
  };
};

// 4. Forest Wind Generator (Slow bandpass sweep)
const startWind = (ctx, masterGain) => {
  createNoiseBuffers(ctx);
  const source = ctx.createBufferSource();
  source.buffer = pinkNoiseBuffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(450, ctx.currentTime);
  filter.Q.setValueAtTime(3.0, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);

  // Slow LFO for wind gusting
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(250, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();

  return {
    source,
    lfo,
    gainNode: gain,
    stop: () => {
      try { lfo.stop(); source.stop(); } catch (e) {}
    }
  };
};

// 5. Brown Noise (Deep study focus)
const startBrownNoise = (ctx, masterGain) => {
  createNoiseBuffers(ctx);
  const source = ctx.createBufferSource();
  source.buffer = brownNoiseBuffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(400, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, ctx.currentTime);

  source.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(masterGain);
  source.start();

  return {
    source,
    gainNode: gain,
    stop: () => {
      try { source.stop(); } catch (e) {}
    }
  };
};

// 6. Binaural Beats (14Hz Alpha wave focus: Left 216Hz, Right 230Hz)
const startBinaural = (ctx, masterGain) => {
  const oscL = ctx.createOscillator();
  const oscR = ctx.createOscillator();
  oscL.type = 'sine';
  oscR.type = 'sine';
  oscL.frequency.setValueAtTime(216, ctx.currentTime); // Left
  oscR.frequency.setValueAtTime(230, ctx.currentTime); // Right (+14Hz alpha difference)

  const merger = ctx.createChannelMerger(2);
  const gainL = ctx.createGain();
  const gainR = ctx.createGain();
  gainL.gain.setValueAtTime(0.09, ctx.currentTime);
  gainR.gain.setValueAtTime(0.09, ctx.currentTime);

  oscL.connect(gainL);
  gainL.connect(merger, 0, 0); // Left channel

  oscR.connect(gainR);
  gainR.connect(merger, 0, 1); // Right channel

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  merger.connect(gain);
  gain.connect(masterGain);

  oscL.start();
  oscR.start();

  return {
    oscL,
    oscR,
    gainNode: gain,
    stop: () => {
      try { oscL.stop(); oscR.stop(); } catch (e) {}
    }
  };
};

// 7. Generative Lo-Fi Ambient Chords
// Loops mellow jazz chords (Dm9 -> G13 -> Cmaj9 -> Am7) using warm electric piano synthesis
let lofiChordInterval = null;
const startLofiChords = (ctx, masterGain) => {
  const chords = [
    [293.66, 349.23, 440.0, 523.25, 659.25], // Dm9: D4, F4, A4, C5, E5
    [196.0, 246.94, 349.23, 440.0, 659.25],  // G13: G3, B3, F4, A4, E5
    [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9: C4, E4, G4, B4, D5
    [220.0, 261.63, 329.63, 392.0, 523.25],  // Am9: A3, C4, E4, G4, C5
  ];

  let chordIndex = 0;
  const lofiGain = ctx.createGain();
  lofiGain.gain.setValueAtTime(0.18, ctx.currentTime);
  lofiGain.connect(masterGain);

  const playNextChord = () => {
    if (!activeSounds.lofiChords) return;
    const notes = chords[chordIndex];
    chordIndex = (chordIndex + 1) % chords.length;

    notes.forEach((freq, i) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.6 - 0.3), ctx.currentTime); // tape flutter

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, ctx.currentTime);

        const now = ctx.currentTime + i * 0.04;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(lofiGain);

        osc.start(now);
        osc.stop(now + 4.0);
      } catch (e) {}
    });
  };

  playNextChord();
  lofiChordInterval = setInterval(playNextChord, 4200);

  return {
    gainNode: lofiGain,
    stop: () => {
      if (lofiChordInterval) clearInterval(lofiChordInterval);
    }
  };
};

export const SoundEngine = {
  // Master gain
  masterGain: null,

  init() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
    }
  },

  setMasterVolume(val) {
    const ctx = getAudioContext();
    if (this.masterGain && ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), ctx.currentTime);
    }
  },

  toggleSound(soundKey, enable, volume = 0.5) {
    const ctx = getAudioContext();
    if (!ctx) return;
    this.init();

    if (enable) {
      if (activeSounds[soundKey]) return; // already active

      switch (soundKey) {
        case 'rain':
          activeSounds.rain = startRain(ctx, this.masterGain);
          break;
        case 'campfire':
          activeSounds.campfire = startCampfire(ctx, this.masterGain);
          break;
        case 'waves':
          activeSounds.waves = startWaves(ctx, this.masterGain);
          break;
        case 'wind':
          activeSounds.wind = startWind(ctx, this.masterGain);
          break;
        case 'brownNoise':
          activeSounds.brownNoise = startBrownNoise(ctx, this.masterGain);
          break;
        case 'binaural':
          activeSounds.binaural = startBinaural(ctx, this.masterGain);
          break;
        case 'lofiChords':
          activeSounds.lofiChords = startLofiChords(ctx, this.masterGain);
          break;
        default:
          break;
      }
      this.setSoundVolume(soundKey, volume);
    } else {
      if (activeSounds[soundKey]) {
        activeSounds[soundKey].stop();
        activeSounds[soundKey] = null;
      }
    }
  },

  setSoundVolume(soundKey, val) {
    const ctx = getAudioContext();
    if (activeSounds[soundKey]?.gainNode && ctx) {
      activeSounds[soundKey].gainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, val)),
        ctx.currentTime
      );
    }
  },

  stopAll() {
    Object.keys(activeSounds).forEach((key) => {
      if (activeSounds[key]) {
        activeSounds[key].stop();
        activeSounds[key] = null;
      }
    });
  }
};

