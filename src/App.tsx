import { useState, useEffect } from "react";
import { LEVELS } from "./data/levels";
import { LevelDetail } from "./components/LevelDetail";
import { BackendRoadmapView } from "./components/roadmap/BackendRoadmapView";
import { DailyCalendarView } from "./components/calendar/DailyCalendarView";
import { MasterOverviewView } from "./components/MasterOverviewView";
import { UserProgress } from "./types/roadmap";

export type View =
  | { type: "roadmap"; id: string }
  | { type: "calendar" }
  | { type: "level"; id: number }
  | { type: "overview" };

function viewToPath(view: View): string {
  switch (view.type) {
    case "overview":
      return "/overview";
    case "calendar":
      return "/daily-schedule";
    case "roadmap":
      return `/roadmap/${view.id}`;
    case "level":
      return `/level/${view.id}`;
  }
}

function pathToView(path: string): View {
  const clean = path.replace(/^#/, "").replace(/\/$/, "") || "/overview";
  if (clean.startsWith("/roadmap/")) {
    const id = clean.replace("/roadmap/", "");
    return { type: "roadmap", id: id || "core" };
  }
  if (clean.startsWith("/level/")) {
    const idNum = parseInt(clean.replace("/level/", ""), 10);
    return { type: "level", id: isNaN(idNum) ? 1 : idNum };
  }
  if (clean === "/daily-schedule" || clean === "/calendar") {
    return { type: "calendar" };
  }
  return { type: "overview" };
}

export default function App() {
  const [view, setView] = useState<View>(() => {
    return pathToView(window.location.pathname);
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("roadmap_theme") as "dark" | "light") || "light";
  });
  const [progress, setProgress] = useState<UserProgress>({
    nodeStatuses: {},
    dailyLogs: [],
    lastUpdated: new Date().toISOString(),
  });

  const navigate = (newView: View) => {
    setView(newView);
    const targetPath = viewToPath(newView);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setView(pathToView(window.location.pathname));
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("roadmap_theme", next);
  };

  const currentLevel =
    view.type === "level" ? LEVELS.find((l) => l.id === view.id) : null;

  const roadmapsNav = [
    { id: "core", icon: "⚡", title: "1. Core (Backend/Fullstack)" },
    { id: "dropshipping-plan", icon: "🛒", title: "2. Dropshipping 6-Month Plan" },
  ];

  return (
    <div className={`flex h-screen bg-gray-950 overflow-hidden ${theme === "light" ? "light-theme" : ""}`}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-200 ${
          sidebarOpen ? "w-64" : "w-14"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              title="Toggle sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="font-bold text-base text-slate-900 dark:text-white leading-tight truncate">
                  Roadmap
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          {sidebarOpen && (
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all flex items-center gap-1 flex-shrink-0 font-bold shadow-2xs"
              title="Chuyển đổi giao diện Sáng / Tối"
            >
              {theme === "dark" ? "☀️ Sáng" : "🌙 Tối"}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
          {/* SECTION 1: GENERAL OVERVIEW (Top Priority) */}
          {sidebarOpen && (
            <div className="px-2 pt-1 pb-1">
              <p className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                General Overview
              </p>
            </div>
          )}
          <button
            onClick={() => navigate({ type: "overview" })}
            className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm transition-colors text-left
              ${view.type === "overview" ? "bg-gray-700 text-white font-bold" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <span className="text-base flex-shrink-0">📌</span>
            {sidebarOpen && <span className="font-medium">Overview (ROADMAP.md)</span>}
          </button>

          {/* SECTION 2: ROADMAPS */}
          {sidebarOpen && (
            <div className="px-2 pt-3 pb-1 border-t border-gray-800/60">
              <p className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Roadmaps
              </p>
            </div>
          )}

          {roadmapsNav.map((rm) => {
            const isFullstack = rm.id === "core";
            const isActive = view.type === "roadmap" && view.id === rm.id;

            return (
              <div key={rm.id} className="space-y-0.5">
                <button
                  onClick={() => navigate({ type: "roadmap", id: rm.id })}
                  className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm transition-all text-left font-medium
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-950 to-teal-950 text-cyan-200 border border-cyan-500/60 shadow-md font-bold"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  title={rm.title}
                >
                  <span className="text-base flex-shrink-0">{rm.icon}</span>
                  {sidebarOpen && (
                    <span className="truncate flex-1">{rm.title}</span>
                  )}
                </button>

                {/* Sub-levels nested under Fullstack Developer */}
                {isFullstack && sidebarOpen && (
                  <div className="pl-6 space-y-0.5 border-l border-gray-800/80 ml-4 py-1">
                    <p className="text-[10px] font-mono text-gray-500 font-semibold uppercase px-2 mb-1">
                      Levels (1 - 6)
                    </p>
                    {LEVELS.map((level) => {
                      const active = view.type === "level" && view.id === level.id;
                      const colorDot: Record<string, string> = {
                        green: "bg-emerald-400",
                        yellow: "bg-amber-400",
                        orange: "bg-orange-400",
                        red: "bg-red-400",
                      };
                      return (
                        <button
                          key={level.id}
                          onClick={() => navigate({ type: "level", id: level.id })}
                          className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors text-left
                            ${
                              active
                                ? "bg-gray-800 text-white font-bold"
                                : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                            }`}
                          title={`${level.title} — ${level.subtitle}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full flex-shrink-0 ${colorDot[level.statusColor]}`}
                          />
                          <span className="truncate">
                            {level.title} <span className="text-gray-600">·</span>{" "}
                            {level.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* SECTION 3: DAILY EXECUTION */}
          {sidebarOpen && (
            <div className="px-2 pt-3 pb-1 border-t border-gray-800/60">
              <p className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Daily Execution
              </p>
            </div>
          )}

          <button
            onClick={() => navigate({ type: "calendar" })}
            className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm transition-all text-left font-semibold
              ${
                view.type === "calendar"
                  ? "bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-300 border border-emerald-500/60 shadow-md font-bold"
                  : "text-gray-200 bg-emerald-950/20 hover:bg-gray-800 border border-emerald-900/40"
              }`}
            title="Lịch trình & Checklist hàng ngày (01/08/2026 - 31/01/2027)"
          >
            <span className="text-base flex-shrink-0">📅</span>
            {sidebarOpen && <span className="truncate flex-1">Daily Schedule (Aug'26-Jan'27)</span>}
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {view.type === "calendar" && (
            <DailyCalendarView
              progress={progress}
              onProgressChange={setProgress}
            />
          )}
          {view.type === "roadmap" && (
            <BackendRoadmapView
              initialRoadmapId={view.id}
              onSelectRoadmap={(id) => navigate({ type: "roadmap", id })}
            />
          )}
          {view.type === "overview" && <MasterOverviewView onNavigate={(v) => navigate(v)} />}
          {view.type === "level" && currentLevel && (
            <LevelDetail level={currentLevel} />
          )}
        </div>
      </main>
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="fade-in space-y-8">
      {/* Hero */}
      <div className="border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Roadmap
        </h1>
        <p className="text-gray-400 text-lg mb-1">
          Career Roadmap — Level 1 → Principal / Consultant
        </p>
        <p className="text-gray-600 text-sm font-mono">
          Synced with todo-app · foresight-mini · foresight-2 · as of August 2026
        </p>
      </div>

      {/* How to Use */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
        <h2 className="text-sm font-mono font-semibold text-gray-400 uppercase tracking-widest mb-3">
          How to Use This Roadmap System
        </h2>
        <ol className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <span className="font-mono font-bold text-cyan-400">1.</span>
            <span>Chọn 1 trong 2 Master Roadmaps (Core / Dropship) ở phần <strong>ROADMAPS</strong> trên cùng sidebar menu.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold text-emerald-400">2.</span>
            <span>Click <strong>📅 Daily Schedule (Aug'26-Jan'27)</strong> để xem & tích checklist khung giờ thực hiện hàng ngày (06:30 - 23:00), có 1 ngày nghỉ/tuần.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-mono font-bold text-cyan-400">3.</span>
            <span>Click các <strong>Level 1 - 6</strong> bên dưới mục Core Roadmap để xem yêu cầu chi tiết từng cấp bậc vị trí công việc.</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
