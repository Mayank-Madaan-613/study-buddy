# 🎓 StudySpace (Study-Buddy)

An elegant, glassmorphic productivity dashboard designed to supercharge your study sessions. **StudySpace** unifies essential academic and productivity tools—including a science-backed Pomodoro focus timer, consistency-driven habit tracker, dynamic progress analytics, and a real-time **Gemini-powered AI Study Tutor**—into a cohesive, modern workspace.

Built with a dark-mode glassmorphic UI, responsive layout, fluid Framer Motion animations, and local storage persistence.

---

## ✨ Features

### 💬 Real-Time AI StudyBot (Powered by Google Gemini)
* **Live AI Tutor:** Integrated with Google Gemini models (`gemini-3.5-flash` with automatic fallback to `gemini-3.1-flash-lite` and `gemini-flash-latest`) for pedagogical explanations.
* **Multi-Turn Context Memory:** Remembers previous conversation context throughout your study session.
* **Dedicated Study Utility Presets:**
  * 🎯 **Quiz Me:** Instantly creates 3-question active recall multiple-choice quizzes with detailed answer rationales.
  * 💡 **Explain Like I'm 12:** Breaks down complex academic concepts using the Feynman Technique and real-world analogies.
  * 📅 **7-Day Study Plan:** Formulates actionable, step-by-step revision schedules with scheduled Pomodoro focus blocks.
  * 📝 **Key Summary:** Condenses notes, formulas, and textbook excerpts into high-yield takeaways.
* **Non-Lossy Markdown Engine:** Full support for syntax-highlighted code blocks, bold headings, bullet lists, and numbered steps with 1-click clipboard copy.
* **Resilient Architecture:** 20-second timeout control (`AbortController`), in-app "Stop" generation button, and graceful rate-limit handling.

### ⏱️ Persistent Focus Pomodoro Timer
* **Global Background Execution:** Built on a unified `StudyContext`—the timer continues running seamlessly even when switching between Dashboard, Habits, or AI Chat views.
* **Tab Countdown Title:** Browser tab title dynamically updates in real-time with your remaining session time (e.g. `(24:45) 🎯 Focus | StudySpace`).
* **Session Task Tagging:** Enter what you're working on (e.g., *Programming*, *Calculus*, *Review Notes*). Completed sessions are automatically logged to your Recent Activity feed.
* **Synthesized Audio Chimes:** Uses the Web Audio API to play gentle, harmonic marimba chimes upon completion (no external MP3 assets, 100% offline-ready).
* **Sidebar Mini-Controller:** Control your focus session from anywhere in the application.
* **Custom Presets & Settings:** Customize Focus, Short Break, and Long Break durations via the timer settings modal.

### 📅 Interactive Habit Tracker
* **Zero-Interruption Modals:** Custom glassmorphic modals for creating new habits and confirming deletions (no native browser prompts).
* **Weekly Consistency Grid:** Interactive Sunday-to-Saturday checklist with an active glowing highlight on today's current day.
* **Streak & Goal Tracking:** Live streak counters (`🔥 X-Day Streak`) and visual percentage progress bars towards weekly targets.
* **Category Tagging:** Organize habits across *Learning*, *Study*, *Health*, *Wellness*, and *Coding*.
* **Behavioral AI Insights:** Research-backed habit stacking recommendations.

### 📊 Dynamic Analytics & Dashboard
* **Real-Time Metrics:** Live computation of Total Study Hours, Tasks Completed, Pomodoro Sprints, and Focus Benchmark Scores.
* **Interactive Weekly Chart:** Visual day-by-day distribution of study hours powered by Recharts with custom tooltips and gradient styling (*This Week* vs. *Last Week*).
* **Today's Habit Quick-Check:** Mark off today's habits directly from the dashboard without navigating away.
* **Filterable Activity Feed:** Real-time log of focus sessions and habit completions, filterable by *All*, *Study*, and *Habits*.

---

## 🛠️ Technology Stack

* **Framework:** [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
* **AI Engine:** [Google Gemini API](https://ai.google.dev/) via `@google/generative-ai` & native REST fallback
* **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with custom glassmorphism and ambient glow effects
* **Animations:** [Framer Motion](https://www.framer.com/motion/) for view transitions, tabs, and interactive modals
* **Data Visualization:** [Recharts](https://recharts.org/) for study analytics
* **Audio:** Web Audio API synthesized harmonic oscillators
* **Environment Configuration:** `dotenv` + Vite `define`

---

## 📁 Project Structure

```text
STUDY-BUDDY/
├── public/
│   └── favicon.jpg           # Application favicon
├── src/
│   ├── components/
│   │   ├── Button.jsx        # Motion-enabled accessible buttons
│   │   ├── Card.jsx          # Glassmorphic card container
│   │   ├── Icons.jsx         # Custom SVG Heroicons-style icons
│   │   ├── Layout.jsx        # Responsive sidebar, navigation & mini-player
│   │   └── ToastContainer.jsx # Toast notification alert stack
│   ├── context/
│   │   └── StudyContext.jsx  # Global state, timer engine, & localStorage sync
│   ├── services/
│   │   └── gemini.js         # Gemini API client, fallbacks, & study utilities
│   ├── utils/
│   │   └── sound.js          # Web Audio API notification chimes
│   ├── views/
│   │   ├── Home.jsx          # Welcome view & feature overview
│   │   ├── Dashboard.jsx     # Analytics, charts, & quick checklist
│   │   ├── Pomodoro.jsx      # Focus timer with customizable presets
│   │   ├── Habits.jsx        # Weekly habit tracker & category filters
│   │   └── Chat.jsx          # AI StudyBot interface & prompt tools
│   ├── App.jsx               # Root provider & view routing
│   ├── index.css             # Tailwind base, utilities & glass-panel styling
│   └── main.jsx              # Application DOM entry point
├── .env                      # Local environment variables (API keys)
├── .gitignore                # Excludes .env, dist, and node_modules
├── index.html                # HTML entry point with Inter font
├── package.json              # Project dependencies & scripts
├── tailwind.config.js        # Custom palette & typography configuration
└── vite.config.js            # Vite build configuration with dotenv loading
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
* [npm](https://www.npmjs.com/) or `pnpm`
* A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/study-buddy.git
cd study-buddy
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure your API key
Create a `.env` file in the root directory (this file is excluded by `.gitignore` to keep your key secure):
```env
Gemini_api_key=your_actual_gemini_api_key_here
```

### 4. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 Security & Environment Practices

* **API Key Protection:** The Gemini API key is loaded exclusively from the `.env` file via `dotenv` in `vite.config.js` and is never hardcoded in version control.
* **Git Safeguard:** `.gitignore` explicitly prevents `.env` and local environment files from being committed to Git.
* **Client Isolation:** The application runs client-side with all state stored in your browser's `localStorage`.

---

## 📦 Production Build

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
