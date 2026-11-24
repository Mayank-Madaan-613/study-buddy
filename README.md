# 🎓 StudySpace (Study-Buddy)

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Dark & Light Mode](https://img.shields.io/badge/Theme-Dark%20%7C%20Light-8B5CF6?style=for-the-badge&logo=shadow&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Web Audio](https://img.shields.io/badge/Web_Audio_API-Synthesized_Soundscapes-38bdf8?style=for-the-badge&logo=audio&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

<p align="center">
  <strong>An elegant productivity dashboard designed to supercharge your study sessions.</strong>
  <br />
  StudySpace unifies a science-backed focus timer, ambient study soundscapes & lo-fi beats, consistency-driven habit tracking, interactive progress analytics, full dark & light mode personalization, and a real-time Gemini-powered AI Study Tutor into a single high-performance workspace.
  <br /><br />
  <a href="https://study-buddy-m2f7.vercel.app/" target="_blank"><strong>🚀 Explore Live Deployment »</strong></a>
</p>

</div>

---

## 🌟 What's New in the Latest Release

* 🔔 **Native Desktop Browser Notifications:** Real-time system notifications for Pomodoro timer intervals. Receive instant desktop/system banners when focus sprints or break intervals complete, even when switching to another browser tab or reading PDFs in another window. Includes one-click permission toggle in Pomodoro view and settings modal.
* 🌓 **Dynamic Dark & Light Theme Engine:** One-click instant theme toggle in desktop and mobile headers with synchronized CSS variables, smooth 300ms transitions, and persistent storage in `localStorage`. Default dark mode with an elegant, glare-free light mode.
* 🔍 **On-Page SEO & Structured Metadata:** Complete on-page search engine optimization with Open Graph cards, Twitter metadata, Canonical URL, SoftwareApplication & WebSite JSON-LD structured schema, and a dedicated `sitemap.xml` for indexability.
* 📱 **Full Mobile Optimization:** Fluid responsive layouts for small screens, featuring collapsible navigation drawers, mobile-friendly audio and timer pills, and responsive touch controls.
* 🎧 **Ambient Study Audio & Lo-Fi Soundscapes:** Dedicated music tab with 100% offline procedural ambient audio generators (Rain, Campfire, Ocean Waves, Forest Wind, Brown Noise, and 14Hz Alpha Binaural Beats) plus mellow electric piano jazz chords.
* 🎚️ **Multi-Track Soundboard Mixer:** Layer multiple soundscapes simultaneously with independent volume faders (e.g. blend rain + campfire + lo-fi chords).
* 🔄 **Persistent Audio Playback Across Views:** Audio runs in the background continuously while using the Pomodoro timer, Habit tracker, or AI chat, complete with a sidebar mini-player and sleep timer.
* 🧠 **Live Gemini AI Tutor Integration:** Powered by Google's `gemini-3.5-flash` model with automatic fallback to `gemini-3.1-flash-lite` and `gemini-flash-latest`. Features multi-turn conversational memory and 4,096-token output support.
* 🛠️ **One-Click Active Recall Tools:** Instant presets for generating 3-question quizzes, Feynman technique simplifications, 7-day revision plans, and summary notes.
* ⏱️ **Persistent Background Focus Timer:** The timer runs in a global `StudyContext`—it never resets or interrupts when navigating between views.
* 🔔 **Web Audio Harmonic Synthesizer:** Gentle, polyphonic marimba chimes synthesized via the Web Audio API upon timer completion and habit check-offs (100% offline, zero audio asset downloads).
* 📑 **Live Browser Tab Countdown:** Dynamic document title updates with your active countdown (e.g. `(24:45) 🎯 Focus | StudySpace`) and playing status.
* 🎨 **Interactive Glassmorphic Modals:** Replaced native browser `prompt()` and `confirm()` dialogs with custom Framer Motion modal windows.
* 📊 **Smart Dashboard Quick-Actions:** Check off today's habits directly from the analytics dashboard and start focus sessions in one click.
* 🍞 **Floating Toast Notifications:** Celebratory animated feedback toasts for completed sessions, goal milestones, and user actions.

---

## 🏗️ System Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              StudySpace                                │
│                         (Vite + React 18 SPA)                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        ┌───────────────────┐               ┌───────────────────┐
        │   StudyContext    │               │   Gemini Engine   │
        │  (Global State)   │               │   (gemini.js)     │
        └─────────┬─────────┘               └─────────┬─────────┘
                  │                                   │
      ┌───────────┼───────────┬───────────┐           │
      ▼           ▼           ▼           ▼           ▼
 ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────────────┐
 │ Pomodoro│ │ Ambient │ │ Habits  │ │Activity │ │ Google Gemini API │
 │  Timer  │ │ Audio   │ │ Tracker │ │  Logs   │ │ (Multi-turn chat, │
 └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │  Study Utilities) │
      │           │           │           │      └───────────────────┘
      └───────────┼───────────┴───────────┘
                  ▼
       ┌─────────────────────┐
       │ Browser LocalStorage│
       │ (Persistent Sync)   │
       └─────────────────────┘
```

---

## ✨ Comprehensive Feature Matrix

### 🎧 1. Study Audio & Ambient Soundscapes
* **100% Offline Procedural Sound Engine:** Synthesizes natural acoustics and musical frequencies via the Web Audio API without needing external audio downloads.
* **Ambient Sound Channels:**
  * 🎹 **Lo-Fi Jazz Chords:** Generative mellow electric piano progressions with soft tape flutter.
  * 🌧️ **Gentle Rain:** Calming pink noise filtered to simulate raindrops.
  * 🔥 **Crackling Fire:** Warm low-frequency rumble with randomized micro-pops.
  * 🌊 **Ocean Waves:** LFO-modulated tidal swells.
  * 🍃 **Forest Wind:** Resonant bandpass breeze through trees.
  * 🎧 **Deep Brown Noise:** Distraction-masking frequency ideal for deep work and ADHD focus.
  * 🧠 **14Hz Alpha Beats:** Dual-frequency stereo binaural beats to induce cognitive flow state.
* **Curated 1-Click Presets:** *Lo-Fi Rain Lounge*, *Deep Alpha Flow*, *Cozy Fireplace*, *Ocean Horizon*, and *Forest Sanctuary*.
* **Multi-Sound Mixer Board:** Adjust individual channel faders and master volume simultaneously.
* **Background Continuity:** Never stops when switching to the Timer, Habits, or AI Chat tabs.
* **Sleep / Study Timer:** Automatically stop music after 15, 25, or 45 minutes.

### 💬 2. AI StudyBot (Google Gemini Powered)
* **Pedagogical Instruction System:** Tuned with custom study-partner system instructions to deliver step-by-step guidance, analogies, and active recall tests.
* **Non-Lossy Markdown Engine:** Full custom parsing for multi-line code blocks (` ``` `), numbered question sequences (`1. `), bullet points, and inline styling without dropped text.
* **Active Recall Utilities:**
  * 🎯 **Quiz Me:** Creates 3-question multiple-choice quizzes with explanations.
  * 💡 **Explain Like I'm 12:** Breaks down tough topics using the Feynman Technique.
  * 📅 **7-Day Study Plan:** Outlines daily Pomodoro-aligned study roadmaps.
  * 📝 **Key Summary:** Extracts high-yield formulas and concepts from notes.
* **Control & Resilience:** Includes an in-app "Stop" button, copy-to-clipboard for responses, clear conversation modal, and a 20-second `AbortController` timeout safeguard.

### ⏱️ 3. Persistent Pomodoro Focus Timer
* **Uninterrupted Study Flow:** Runs continuously in the background across view switches.
* **Native Desktop Notifications:** Browser HTML5 alerts notify you the moment a study sprint or break interval finishes, even when the browser is minimized or running in the background.
* **Dynamic Tab Countdown:** Displays active time left in the browser tab title.
* **Task Tagging:** Input study topics (e.g. *Organic Chemistry*, *React Hooks*). Finished sessions automatically record into Recent Activity with exact durations.
* **Audio Cues:** Web Audio API sound generator with harmonic arpeggio chimes. Includes a global mute/unmute control.
* **Sidebar Mini-Player:** View remaining time and toggle pause/play from any screen in the dashboard.
* **Configurable Intervals:** Adjust Focus, Short Break, and Long Break presets through an intuitive settings modal.

### 📅 4. Consistency Habit Tracker
* **Weekly Matrix:** Sunday-to-Saturday checklist with an active glowing ring around today's current day.
* **Streaks & Progress:** Automatic streak calculation (`🔥 X-Day Streak`) and percentage completion bars.
* **Categorization:** Tag habits under *Learning*, *Study*, *Health*, *Wellness*, or *Coding*.
* **Custom Modals:** Modern dialogs for adding habits (frequency sliders, category picker) and confirming deletions.
* **Behavioral Insights:** Smart habit-stacking guidance to build lasting academic routines.

### 📊 5. Smart Analytics Dashboard
* **Dynamic Metrics:** Live computation of Total Study Hours, Tasks Completed, Pomodoro Sprints, and Focus Benchmark Score.
* **Interactive Chart:** Weekly distribution of study hours using Recharts, with smooth gradients, custom tooltips, and timeframe toggles (*This Week* vs. *Last Week*).
* **Today's Habit Checklist:** Mark off habits directly from the overview card.
* **Filterable Activity Feed:** Categorized history of focus sprints and completed milestones.

### 🎨 6. Dark & Light Theme Architecture
* **Theme Switching Engine:** Easily switch between deep glassmorphic dark mode and a crisp, high-contrast light mode using the header sun/moon button.
* **CSS Variable Driven:** Powered by custom root CSS properties (`--bg-base`, `--glass-bg`, `--text-base`, `--scrollbar-thumb`) ensuring instantaneous, glitch-free re-styling.
* **Auto-Persistence:** Preserves user theme preference across browser sessions using `localStorage`.

### 🌐 7. SEO & Search Engine Optimization
* **Structured Data (JSON-LD):** Implements `WebSite` and `SoftwareApplication` schema for Google search rich snippets and enhanced indexing.
* **Social Previews:** Integrated Open Graph (`og:*`) and Twitter Card meta tags for previews on Discord, Twitter/X, LinkedIn, and messaging apps.
* **XML Sitemap:** Included `sitemap.xml` listing primary app entry points and routes for fast crawler discovery.

---

## 🛠️ Technology Stack & Libraries

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component architecture, hooks, and context |
| **Bundler & Dev Server** | [Vite 5](https://vitejs.dev/) | Ultra-fast HMR and production bundling |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Dark glassmorphism, responsive grid, radial glows |
| **AI Integration** | [Google Gemini API](https://ai.google.dev/) | Real-time generative study tutor via REST API |
| **Audio Synthesis** | Web Audio API | Ambient soundscapes, binaural beats, and notification chimes |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth layout transitions, tab springs, modals |
| **Charts** | [Recharts](https://recharts.org/) | Responsive analytics and study consistency graphs |
| **Environment** | `dotenv` | Secure `.env` variable loading into Vite build |

---

## 📁 Project Directory Map

```text
STUDY-BUDDY/
├── public/
│   └── favicon.jpg             # Application favicon
├── src/
│   ├── components/
│   │   ├── Button.jsx          # Reusable motion button component
│   │   ├── Card.jsx            # Glassmorphic card container with hover physics
│   │   ├── Icons.jsx           # SVG Heroicon icon library
│   │   ├── Layout.jsx          # Main navigation, mobile drawer & mini-players
│   │   └── ToastContainer.jsx   # Animated toast notification stack
│   ├── context/
│   │   └── StudyContext.jsx    # Global state management & audio/timer sync
│   ├── services/
│   │   └── gemini.js           # Gemini API client, fallbacks & prompt utilities
│   ├── utils/
│   │   ├── ambientAudio.js     # Procedural soundscape & lo-fi chord engine
│   │   └── sound.js            # Web Audio API chime synthesis
│   ├── views/
│   │   ├── Home.jsx            # Landing view & tool showcase
│   │   ├── Dashboard.jsx       # Study metrics, Recharts overview & quick-check
│   │   ├── Pomodoro.jsx        # Circular timer ring, task tags & presets
│   │   ├── Habits.jsx          # Weekly habit grid & streak tracking
│   │   ├── Music.jsx           # Study soundscapes, binaural beats & mixer
│   │   └── Chat.jsx            # AI StudyBot interface & active recall presets
│   ├── App.jsx                 # Provider root & view switcher
│   ├── index.css               # Tailwind directives, scrollbar & glass styles
│   └── main.jsx                # React root mount point
├── .env                        # Local API credentials (git-ignored)
├── .gitignore                  # Prevents committing .env, node_modules, and dist
├── index.html                  # HTML entry point with SEO meta & JSON-LD
├── sitemap.xml                 # XML sitemap for search engine crawlers
├── package.json                # Project dependencies and run scripts
├── tailwind.config.js          # Theme palette and font family extensions
└── vite.config.js              # Vite config with dotenv & define definitions
```

---

## 🌐 Live Deployment

Try out the live web application on Vercel:
👉 **[https://study-buddy-m2f7.vercel.app/](https://study-buddy-m2f7.vercel.app/)**

---

## 🚀 Quickstart & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher)
* [npm](https://www.npmjs.com/) or `pnpm`
* A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/study-buddy.git
cd study-buddy
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure environment variables
Create a `.env` file in the root directory:
```env
Gemini_api_key=your_gemini_api_key_here
```
> [!NOTE]
> The `.env` file is excluded in `.gitignore` and is loaded securely through `dotenv` in `vite.config.js`. Your key is never hardcoded in the codebase.

### Step 4: Run the development server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📦 Build & Deployment

* **Generate production bundle:**
  ```bash
  npm run build
  ```
* **Preview production build locally:**
  ```bash
  npm run preview
  ```

---

## 🔒 Security & Privacy

* **Zero-Leak API Key Handling:** The API key is loaded dynamically from `.env` using `dotenv` inside `vite.config.js` and defined securely for build-time compilation.
* **Client-Side Data Storage:** All study metrics, timer logs, habit history, and chat messages are stored locally in your browser's `localStorage`—no personal data is sent to external databases.
* **Git Safeguard:** Version control rules in `.gitignore` ensure credentials and build artifacts are never tracked.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
