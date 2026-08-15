import type { GapItem, TrackSummary } from "../data/levels";

interface GapAnalysisProps {
  gaps: GapItem[];
  tracks: TrackSummary[];
}

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    color: "text-red-400",
    bg: "bg-red-950 border-red-800",
    dot: "bg-red-400",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-amber-400",
    bg: "bg-amber-950 border-amber-800",
    dot: "bg-amber-400",
  },
  done: {
    label: "Done",
    color: "text-emerald-400",
    bg: "bg-emerald-950 border-emerald-800",
    dot: "bg-emerald-400",
  },
};

const TRACK_STATUS_COLORS: Record<string, string> = {
  exceeded: "text-emerald-400 bg-emerald-950 border-emerald-800",
  met: "text-blue-400 bg-blue-950 border-blue-800",
  partial: "text-amber-400 bg-amber-950 border-amber-800",
  "not-met": "text-red-400 bg-red-950 border-red-800",
};

const PROJECT_COLORS: Record<string, string> = {
  "todo-app": "bg-violet-900/40 text-violet-300 border-violet-700",
  "foresight-mini": "bg-cyan-900/40   text-cyan-300   border-cyan-700",
  "foresight-2": "bg-rose-900/40   text-rose-300   border-rose-700",
};

export function GapAnalysis({ gaps, tracks }: GapAnalysisProps) {
  const done = gaps.filter((g) => g.status === "done").length;
  const total = gaps.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Gap Analysis</h2>
        <p className="text-gray-500 text-sm">
          Current state of todo-app as of August 2026. Check off items as you
          complete them.
        </p>
      </div>

      {/* Track Summary */}
      <div>
        <h3 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest mb-3">
          By Engineering Track
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {tracks.map((t) => (
            <div
              key={t.track}
              className="rounded-xl border border-gray-700 bg-gray-900/40 p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold text-gray-100">{t.track}</span>
                <span
                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${TRACK_STATUS_COLORS[t.status]}`}
                >
                  {t.estimatedLevel}
                </span>
              </div>
              <p className="text-sm text-gray-400">{t.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest">
            Gaps Remaining
          </h3>
          <span className="text-xs font-mono text-gray-500">
            {done}/{total} resolved · {pct}%
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="space-y-3">
          {gaps.map((gap) => {
            const s = STATUS_CONFIG[gap.status];
            return (
              <div
                key={gap.priority}
                className={`rounded-xl border p-4 ${s.bg}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-gray-500 mt-0.5 flex-shrink-0 w-5 text-right">
                    {gap.priority}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-gray-100 text-sm">
                        {gap.title}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-mono flex-shrink-0 ${s.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-2">
                      {gap.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {gap.project.map((p) => (
                        <span
                          key={p}
                          className={`text-xs font-mono px-2 py-0.5 rounded-full border ${PROJECT_COLORS[p]}`}
                        >
                          {p === "todo-app"
                            ? "📋"
                            : p === "foresight-mini"
                              ? "🔬"
                              : "🏭"}{" "}
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
