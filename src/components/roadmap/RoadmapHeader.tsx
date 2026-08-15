import { useRef, useState } from "react";
import { ProgressStats } from "../../types/roadmap";
import { isSupabaseConfigured } from "../../lib/supabase";
import { SupabaseModal } from "./SupabaseModal";

interface RoadmapHeaderProps {
  stats: ProgressStats;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (f: string) => void;
  onExport: () => void;
  onImport: (json: string) => void;
  onReset: () => void;
  onOpenFutureFeatures: () => void;
  onSyncSupabase?: () => void;
}

export function RoadmapHeader({
  stats,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  onImport,
  onReset,
  onOpenFutureFeatures,
  onSyncSupabase,
}: RoadmapHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const isSupabaseConnected = isSupabaseConfigured();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
        {/* Search Bar */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm node, công nghệ (VD: Postgres, JWT, Docker, Redis)..."
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Tất cả" },
            { id: "completed", label: "✓ Done" },
            { id: "in-progress", label: "⏳ Learning" },
            { id: "pending", label: "○ To Learn" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => onStatusFilterChange(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap border ${
                statusFilter === btn.id
                  ? "bg-gray-800 text-white border-cyan-500 font-bold"
                  : "bg-gray-950 text-gray-400 border-gray-800 hover:text-gray-200"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supabase Sync Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSyncComplete={() => {
          if (onSyncSupabase) onSyncSupabase();
          setIsSupabaseModalOpen(false);
        }}
      />
    </div>
  );
}
