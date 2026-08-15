import { useState } from "react";
import type { Domain } from "../data/levels";
import { StatusBadge } from "./StatusBadge";
import { ProjectBadge } from "./ProjectBadge";
import { CodeBlock } from "./CodeBlock";

interface DomainSectionProps {
  domain: Domain;
  defaultOpen?: boolean;
}

const DOMAIN_ICONS: Record<string, string> = {
  Frontend: "🖥️",
  Backend: "⚙️",
  DevOps: "🚀",
  Security: "🔒",
};

const DOMAIN_COLORS: Record<string, string> = {
  Frontend: "border-violet-300 dark:border-violet-800/60",
  Backend: "border-cyan-300 dark:border-cyan-800/60",
  DevOps: "border-emerald-300 dark:border-emerald-800/60",
  Security: "border-orange-300 dark:border-orange-800/60",
};

function RequirementCard({
  req,
  index,
}: {
  req: Domain["requirements"][0];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/50 overflow-hidden shadow-2xs">
      {/* Requirement header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <span className="font-mono text-xs text-slate-400 dark:text-gray-500 flex-shrink-0 mt-0.5 w-5 text-right font-bold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-sm text-slate-800 dark:text-gray-200 leading-relaxed flex-1 font-medium">
          {req.text}
        </span>
        <span className="text-xs text-slate-400 dark:text-gray-500 flex-shrink-0 mt-0.5">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Answer + code — expandable */}
      {open && (
        <div className="border-t border-slate-200 dark:border-gray-700/50 px-3 pb-3 pt-3 space-y-3 fade-in bg-slate-50/50 dark:bg-transparent">
          {/* Answer */}
          <p className="text-sm text-slate-800 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900/50 rounded-lg px-3 py-2 border-l-4 border-blue-600 shadow-2xs">
            {req.answer}
          </p>

          {/* Code example */}
          {req.code && (
            <CodeBlock code={req.code} language={req.language ?? "ts"} />
          )}
        </div>
      )}
    </div>
  );
}

export function DomainSection({
  domain,
  defaultOpen = false,
}: DomainSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border ${DOMAIN_COLORS[domain.name]} bg-white dark:bg-gray-900/40 overflow-hidden shadow-xs`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{DOMAIN_ICONS[domain.name]}</span>
          <span className="font-bold text-slate-900 dark:text-gray-100">{domain.name}</span>
          <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-semibold">
            {domain.requirements.length} topics
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={domain.status} />
          <span className="text-slate-400 dark:text-gray-500 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 fade-in">
          {/* Two-column: Requirements+Answers left | Real examples right */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-4">
            {/* LEFT — Requirements with expandable answers */}
            <div className="space-y-3 min-w-0">
              <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">
                Requirements & Answers
              </h4>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Click any requirement to reveal the answer + code example.
              </p>
              <div className="space-y-2">
                {domain.requirements.map((req, i) => (
                  <RequirementCard key={i} req={req} index={i} />
                ))}
              </div>

              {/* Keywords */}
              <div className="pt-1">
                <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                  Keywords to know
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {domain.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-block bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-xs font-mono px-2 py-0.5 rounded-md border border-slate-300 dark:border-gray-700 font-semibold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Real project examples with full code */}
            <div className="space-y-3 min-w-0">
              <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest">
                Real Examples in Projects
              </h4>

              {/* Application context note */}
              <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-gray-800/30 rounded-lg px-3 py-2 border border-slate-200 dark:border-gray-700/50">
                {domain.applicationNote}
              </p>

              {/* Project ref cards — code expanded by default */}
              {domain.projectRefs.length > 0 && (
                <div className="space-y-2">
                  {domain.projectRefs.map((ref_, i) => (
                    <ProjectBadge key={i} ref_={ref_} defaultOpen={true} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gaps — full width below */}
          {domain.gaps && domain.gaps.length > 0 && (
            <div className="border-t border-slate-200 dark:border-gray-800 pt-3">
              <h4 className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">
                ⚠ Gaps
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {domain.gaps.map((gap, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-red-900 dark:text-red-300/80 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2 border border-red-200 dark:border-red-900/40 font-medium"
                  >
                    <span className="text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0 font-bold">✗</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
