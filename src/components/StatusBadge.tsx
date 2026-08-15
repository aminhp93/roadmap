import type { TrackStatus } from "../data/levels";

interface StatusBadgeProps {
  status: TrackStatus;
  label?: string;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  TrackStatus,
  { bg: string; text: string; dot: string; emoji: string }
> = {
  exceeded: {
    bg: "bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800",
    text: "text-emerald-900 dark:text-emerald-400 font-bold",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    emoji: "✅",
  },
  met: {
    bg: "bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-400 font-bold",
    dot: "bg-blue-600 dark:bg-blue-400",
    emoji: "🔵",
  },
  partial: {
    bg: "bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-400 font-bold",
    dot: "bg-amber-600 dark:bg-amber-400",
    emoji: "🟡",
  },
  "not-met": {
    bg: "bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800",
    text: "text-red-900 dark:text-red-400 font-bold",
    dot: "bg-red-600 dark:bg-red-400",
    emoji: "🔴",
  },
};

const STATUS_LABEL: Record<TrackStatus, string> = {
  exceeded: "Exceeded",
  met: "Met",
  partial: "Partial",
  "not-met": "Not Met",
};

export function StatusBadge({ status, label, size = "sm" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const text = label ?? STATUS_LABEL[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono font-medium shadow-2xs
      ${size === "sm" ? "text-xs" : "text-sm"}
      ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {text}
    </span>
  );
}

interface LevelStatusBadgeProps {
  color: string;
  label: string;
}

export function LevelStatusBadge({ color, label }: LevelStatusBadgeProps) {
  const colorMap: Record<string, string> = {
    green: "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold",
    yellow: "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold",
    orange: "bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800 font-bold",
    red: "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800 font-bold",
  };
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-mono shadow-2xs ${colorMap[color] ?? colorMap.red}`}
    >
      {label}
    </span>
  );
}
