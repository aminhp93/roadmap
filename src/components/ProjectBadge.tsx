import { useState } from "react";
import type { ProjectRef } from "../data/levels";
import { CodeBlock } from "./CodeBlock";

interface ProjectBadgeProps {
  ref_: ProjectRef;
  defaultOpen?: boolean;
}

const PROJECT_COLORS: Record<
  string,
  { bg: string; border: string; text: string; accent: string; btn: string }
> = {
  "todo-app": {
    bg: "bg-purple-50 dark:bg-violet-950",
    border: "border-purple-200 dark:border-violet-700",
    text: "text-purple-900 dark:text-violet-300",
    accent: "text-purple-700 dark:text-violet-400 font-bold",
    btn: "bg-purple-600 dark:bg-violet-900/60 hover:bg-purple-500 dark:hover:bg-violet-800/60 text-white dark:text-violet-300 border-purple-600 dark:border-violet-700",
  },
  "foresight-mini": {
    bg: "bg-cyan-50 dark:bg-cyan-950",
    border: "border-cyan-200 dark:border-cyan-700",
    text: "text-cyan-900 dark:text-cyan-300",
    accent: "text-cyan-700 dark:text-cyan-400 font-bold",
    btn: "bg-cyan-600 dark:bg-cyan-900/60 hover:bg-cyan-500 dark:hover:bg-cyan-800/60 text-white dark:text-cyan-300 border-cyan-600 dark:border-cyan-700",
  },
  "foresight-2": {
    bg: "bg-rose-50 dark:bg-rose-950",
    border: "border-rose-200 dark:border-rose-700",
    text: "text-rose-900 dark:text-rose-300",
    accent: "text-rose-700 dark:text-rose-400 font-bold",
    btn: "bg-rose-600 dark:bg-rose-900/60 hover:bg-rose-500 dark:hover:bg-rose-800/60 text-white dark:text-rose-300 border-rose-600 dark:border-rose-700",
  },
};

const PROJECT_ICONS: Record<string, string> = {
  "todo-app": "📋",
  "foresight-mini": "🔬",
  "foresight-2": "🏭",
};

export function ProjectBadge({ ref_, defaultOpen = false }: ProjectBadgeProps) {
  const colors = PROJECT_COLORS[ref_.project] ?? PROJECT_COLORS["todo-app"];
  const [showCode, setShowCode] = useState(defaultOpen);

  return (
    <div className={`rounded-lg border text-sm shadow-2xs ${colors.bg} ${colors.border}`}>
      {/* Header row */}
      <div className="flex items-start gap-2 p-3">
        <span className="text-base leading-none mt-0.5 flex-shrink-0">
          {PROJECT_ICONS[ref_.project]}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className={`font-mono text-xs mb-0.5 ${colors.accent}`}
          >
            {ref_.project}
          </div>
          <div className={`font-mono text-xs mb-1 truncate font-semibold ${colors.text}`}>
            {ref_.label}
          </div>
          <div className="text-slate-700 dark:text-gray-300 text-xs leading-relaxed font-medium">
            {ref_.note}
          </div>
          {ref_.path && (
            <div className="mt-1.5">
              <code className="text-xs text-slate-800 dark:text-gray-300 bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 px-1.5 py-0.5 rounded font-mono font-bold">
                {ref_.path}
              </code>
            </div>
          )}
        </div>
        {/* Toggle code button */}
        {ref_.codeSnippet && (
          <button
            onClick={() => setShowCode((s) => !s)}
            className={`flex-shrink-0 flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded border transition-colors shadow-2xs ${colors.btn}`}
            title={showCode ? "Hide code" : "Show code"}
          >
            <span>{showCode ? "▲" : "{ }"}</span>
          </button>
        )}
      </div>

      {/* Code snippet */}
      {showCode && ref_.codeSnippet && (
        <div className="px-3 pb-3">
          <CodeBlock
            code={ref_.codeSnippet}
            language={ref_.language ?? "ts"}
            filename={ref_.label}
          />
        </div>
      )}
    </div>
  );
}
