# CLAUDE.md — Claude Code Instructions for viz-app

@AGENTS.md

## Project Overview
`viz-app` is an interactive visual roadmap, daily execution checklist, and career skill visualizer built with React 18, Vite 5, TypeScript 5, and Tailwind CSS 3.

## Quick Commands
- `npm run dev` — Start Vite development server (http://localhost:5173)
- `npm run build` — TypeScript typecheck and Vite production build (`tsc --noEmit && vite build`)
- `npm run preview` — Preview production build locally
- `npm run sync` — Sync data model to markdown files (`scripts/sync-to-markdown.ts`)

## Coding Guidelines
1. **Clean Routing**: Use HTML5 History API Path Routing (`/overview`, `/roadmap/core`, `/daily-schedule`, `/level/:id`). No hash `#` URLs.
2. **Dual Theme Support**: Ensure high contrast for both Light Mode and Dark Mode using clean Tailwind `dark:...` classes. Avoid global `!important` CSS overrides.
3. **Type Safety**: Strictly typed TypeScript data models in `src/data/` and `src/types/roadmap.ts`.
4. **Build Check**: Always verify with `npm run build` after making code changes.
