import { useState } from "react";
import type { Level } from "../data/levels";
import { LevelStatusBadge } from "./StatusBadge";
import { DomainSection } from "./DomainSection";

interface LevelDetailProps {
  level: Level;
}

export function LevelDetail({ level }: LevelDetailProps) {
  const [openAll, setOpenAll] = useState(false);

  return (
    <div className="fade-in space-y-6">
      {/* Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{level.title}</h2>
            <span className="text-2xl font-light text-slate-400 dark:text-gray-400">—</span>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-200">
              {level.subtitle}
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-mono font-semibold">{level.experience}</p>
        </div>
        <LevelStatusBadge
          color={level.statusColor}
          label={level.overallStatus}
        />
      </div>

      {/* Domain status strip */}
      <div className="grid grid-cols-4 gap-2">
        {level.domains.map((d) => {
          const colorMap: Record<string, string> = {
            exceeded: "bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 font-bold",
            met: "bg-blue-100 dark:bg-blue-900/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-300 font-bold",
            partial: "bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 font-bold",
            "not-met": "bg-red-100 dark:bg-red-900/60 border-red-300 dark:border-red-700 text-red-900 dark:text-red-300 font-bold",
          };
          const iconMap: Record<string, string> = {
            Frontend: "🖥️",
            Backend: "⚙️",
            DevOps: "🚀",
            Security: "🔒",
          };
          return (
            <div
              key={d.name}
              className={`rounded-lg border px-3 py-2 text-center shadow-2xs ${colorMap[d.status]}`}
            >
              <div className="text-lg mb-0.5">{iconMap[d.name]}</div>
              <div className="text-xs font-mono">{d.name}</div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">
          Domains
        </h3>
        <button
          onClick={() => setOpenAll((o) => !o)}
          className="text-xs font-mono text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 transition-colors border border-slate-300 dark:border-gray-700 rounded px-2.5 py-1 bg-white dark:bg-gray-800 font-semibold"
        >
          {openAll ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Domains */}
      <div className="space-y-3">
        {level.domains.map((d) => (
          <DomainSection key={d.name} domain={d} defaultOpen={openAll} />
        ))}
      </div>

      {/* Self Check */}
      <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-4 shadow-xs">
        <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest mb-2">
          🎯 Self-Check Mastery
        </h4>
        <p className="text-sm text-slate-800 dark:text-gray-300 leading-relaxed font-medium">
          {level.selfCheck}
        </p>
      </div>
    </div>
  );
}
