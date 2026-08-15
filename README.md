# 🚀 Interactive Career & Business Roadmap Visualizer (`viz-app`)

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

A modern, highly dynamic web application designed to visualize, track, and execute a 6-month strategic career and business roadmap. Built for software engineers and entrepreneurs executing dual-track goals (Core Backend/Fullstack & Dropship Business).

---

## ✨ Key Features

- 📌 **Master Overview (`/overview`)**:
  - Displays strategic objectives, Core Track milestones, Dropship 6-Month Plan (`ds-m1` to `ds-m6`), Gap Items (`P1`–`P11`), and daily execution rules directly aligned with `ROADMAP.md`.

- ⚡ **Interactive Visual Roadmap (`/roadmap/core` & `/roadmap/dropshipping-plan`)**:
  - SVG & DOM interactive canvas with zoom/pan capabilities, node category filtering, search toolbar, and progress percentage gauges.
  - Right-side **Node Inspector Drawer**: Comprehensive key topics, code snippets, practical project exercises, Q&A interview prep, and AI tutor prompt helpers.

- 📅 **Daily Schedule Checklist (`/daily-schedule`)**:
  - Interactive time-block checklist covering **August 2026 – January 2027**.
  - Automatic time tracking & Gap-Item logging into persistent storage.
  - **Export `.ics` Calendar**: Download schedule files for direct import into Google Calendar or Apple Calendar.

- 🎯 **Level 1 to Level 6 Career Matrix (`/level/1` – `/level/6`)**:
  - Detailed skill breakdown across 4 domains (*Frontend, Backend, DevOps, Security*) for Freshers, Juniors, Mids, Seniors, Staff Leads, and Principals.
  - Expandable requirements, answers, code snippets, real project references, and self-check mastery criteria.

- 🌓 **High-Contrast Dual Theme System**:
  - Seamless toggle between Light Mode and Dark Mode with high-contrast UI components, badges, and accordions.

- 🔗 **Clean URL Path Routing**:
  - Built with HTML5 History API Routing for clean URLs without `#` hash symbols.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (>= 18.x)
- `npm` or `pnpm`

### 2. Installation
```bash
# Navigate to viz-app directory
cd viz-app

# Install dependencies
npm install
```

### 3. Development
```bash
# Start Vite local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build & Verification
```bash
# Type-check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

### 5. Sync Data to Markdown
```bash
# Sync data model from src/data/ to markdown documentation
npm run sync
```

---

## 🛠 Project Structure

```
viz-app/
├── src/
│   ├── components/
│   │   ├── calendar/
│   │   │   └── DailyCalendarView.tsx   # 6-Month Daily Schedule Checklist & .ics Export
│   │   ├── roadmap/
│   │   │   ├── BackendRoadmapView.tsx  # Visual Roadmap View wrapper
│   │   │   ├── DailyTaskLogger.tsx     # Daily task logger modal/widget
│   │   │   ├── NodeDrawer.tsx          # Right-side node inspector drawer
│   │   │   └── RoadmapCanvas.tsx       # Interactive SVG/DOM roadmap canvas
│   │   ├── DomainSection.tsx           # Domain accordion (Frontend, Backend, DevOps, Security)
│   │   ├── LevelDetail.tsx             # Level header, status strip & self-check
│   │   ├── MasterOverviewView.tsx      # Master Overview page
│   │   ├── ProjectBadge.tsx            # Project code reference badge
│   │   └── StatusBadge.tsx             # Status indicators
│   ├── data/
│   │   ├── backendRoadmap.ts           # Visual roadmap node definitions & connections
│   │   ├── dailySchedule.ts            # Daily time slots & .ics calendar generator
│   │   ├── gapItems.ts                 # Output Gap Item catalog (P1-P11, ds-m1-m6)
│   │   ├── levels.ts                   # Skill requirements for Level 1 to 6
│   │   └── strategicRoadmaps.ts        # Strategic roadmap high-level metadata
│   ├── services/
│   │   ├── progressService.ts          # Storage & progress tracking logic
│   │   └── roadmapService.ts           # Roadmap data query services
│   ├── App.tsx                         # App shell, router, sidebar & header
│   └── index.css                       # Global CSS & Tailwind imports
├── AGENTS.md                           # AI Agent development instructions
├── CLAUDE.md                           # Claude Code CLI instructions
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📝 License

UNLICENSED — Personal Career & Business Development Platform.
