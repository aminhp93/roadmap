# AGENTS.md — AI Agent Instructions for Roadmap Visualizer (viz-app)

You are an expert principal-level frontend engineer and AI agent working on **viz-app**, an interactive web application for visual career roadmaps, daily schedule execution, and skill-gap tracking.

---

## 1. Project Overview & Architecture

`viz-app` is a Vite + React + TypeScript + Tailwind CSS Single-Page Application (SPA) designed to visualize and execute a 6-month strategic career and business plan (Core Backend/Fullstack + Dropship 6-Month Plan).

### Core Components & Layout:
- **`src/App.tsx`**: Main application shell, state management, theme switcher, HTML5 History API Path Router, and sidebar navigation.
- **`src/components/MasterOverviewView.tsx`**: Master Overview dashboard rendered directly from the master strategy (`ROADMAP.md`).
- **`src/components/roadmap/BackendRoadmapView.tsx` & `RoadmapCanvas.tsx`**: SVG/DOM interactive diagram canvas, search & filter toolbar, and optional Target Probability & Daily Task Logger cards.
- **`src/components/roadmap/NodeDrawer.tsx`**: Right-side inspector drawer containing node details, status switcher (Done/Learning/Skipped/To Learn), code snippets, resource links, guides, practical projects, Q&A, and AI tutor prompts.
- **`src/components/calendar/DailyCalendarView.tsx`**: Interactive 6-month daily schedule checklist (01/08/2026 – 31/01/2027), month switcher, date navigation, Gap-Item logger, and `.ics` Google Calendar export.
- **`src/components/LevelDetail.tsx` & `DomainSection.tsx`**: Skill matrix accordions for Level 1 (Fresher) through Level 6 (Principal / Consultant).

---

## 2. Single Source of Truth Data Model

All data is statically defined in TypeScript under `src/data/`:
- **`src/data/levels.ts`**: Level 1 to Level 6 domains, requirements, code examples, project references, and gap items.
- **`src/data/strategicRoadmaps.ts`**: High-level strategic roadmap definitions (Core & Dropshipping 6-Month Plan).
- **`src/data/backendRoadmap.ts`**: Nodes, categories, and connections for the visual roadmap canvas.
- **`src/data/dailySchedule.ts`**: Time-block schedule slots, rest day rules, and `.ics` calendar generator logic.
- **`src/data/gapItems.ts`**: Catalog of specific output Gap Items (`P1–P11` for Core, `ds-m1–m6` for Dropship).

*Note*: The CLI script `npm run sync` (`scripts/sync-to-markdown.ts`) exports data from `src/data/` to markdown documentation files.

---

## 3. Strict Development Guidelines

### Routing & Navigation
- Use **HTML5 History API Path Routing** via `window.history.pushState` (no `#` hash symbol in URLs).
- Supported URL paths:
  - `/overview` ➔ Master Overview
  - `/roadmap/core` ➔ Core Backend/Fullstack Visual Roadmap
  - `/roadmap/dropshipping-plan` ➔ Dropship 6-Month Plan Visual Roadmap
  - `/daily-schedule` ➔ Daily Execution Schedule Checklist
  - `/level/:id` ➔ Level 1 to 6 Details (e.g., `/level/4`)

### Styling & Theme Rules
- Support both **Light Mode** (`.light-theme`) and **Dark Mode** seamlessly.
- **DO NOT** use blunt `!important` global background/text overrides in `src/index.css` that corrupt component text, badges, or buttons.
- Use explicit, responsive Tailwind classes (e.g., `bg-white dark:bg-gray-900 text-slate-900 dark:text-white border-slate-200 dark:border-gray-800`).
- Ensure high contrast for all buttons, badges, time pills, and accordion headers in both Light and Dark modes.

---

## 4. Verification Commands

Run these commands from `viz-app/`:

- **Development Server**: `npm run dev` (runs Vite dev server on http://localhost:5173)
- **Type Checking & Production Build**: `npm run build` (runs `tsc --noEmit && vite build`)
- **Sync Data to Markdown**: `npm run sync` (runs `scripts/sync-to-markdown.ts`)

*Rule*: Always run `npm run build` before finalizing any task to ensure type safety and zero build errors.
