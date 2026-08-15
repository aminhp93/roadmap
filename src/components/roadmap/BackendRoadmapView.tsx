import { useState, useEffect } from "react";
import { NodeStatus, UserProgress, RoadmapNode } from "../../types/roadmap";
import { RoadmapService } from "../../services/roadmapService";
import { ProgressService } from "../../services/progressService";

import { RoadmapSelector } from "./RoadmapSelector";
import { RoadmapHeader } from "./RoadmapHeader";
import { GoalProbabilityCard } from "./GoalProbabilityCard";
import { DailyTaskLogger } from "./DailyTaskLogger";
import { RoadmapCanvas } from "./RoadmapCanvas";
import { NodeDrawer } from "./NodeDrawer";
import { FutureFeaturesModal } from "./FutureFeaturesModal";

interface BackendRoadmapViewProps {
  initialRoadmapId?: string;
  onSelectRoadmap?: (id: string) => void;
}

export function BackendRoadmapView({
  initialRoadmapId = "core",
  onSelectRoadmap,
}: BackendRoadmapViewProps) {
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(initialRoadmapId);
  const [progress, setProgress] = useState<UserProgress>({
    nodeStatuses: {},
    dailyLogs: [],
    lastUpdated: new Date().toISOString(),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);

  // Load progress on mount
  useEffect(() => {
    ProgressService.loadProgress().then(setProgress);
  }, []);

  // Sync active roadmap ID when prop changes
  useEffect(() => {
    if (initialRoadmapId && initialRoadmapId !== activeRoadmapId) {
      setActiveRoadmapId(initialRoadmapId);
      setSelectedNodeId(null);
    }
  }, [initialRoadmapId]);

  // Query roadmap details via RoadmapService
  const { title: activeTitle, topics: activeTopics } =
    RoadmapService.getRoadmap(activeRoadmapId);
  const activeNodes = RoadmapService.getNodes(activeRoadmapId);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [showAlignmentTools, setShowAlignmentTools] = useState(false);

  const selectedNode = activeNodes.find((n) => n.id === selectedNodeId) || null;
  const stats = ProgressService.getStats(activeNodes, progress);
  const probabilityStats = ProgressService.getGoalProbability(
    activeNodes,
    progress,
    activeRoadmapId
  );

  const handleSelectRoadmap = (newId: string) => {
    setActiveRoadmapId(newId);
    if (onSelectRoadmap) onSelectRoadmap(newId);
    setSelectedNodeId(null);
    setSearchQuery("");
  };

  const handleStatusChange = (nodeId: string, status: NodeStatus) => {
    const updated = ProgressService.updateNodeStatus(progress, nodeId, status);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    if (window.confirm("Bạn có chắc chắn muốn reset toàn bộ tiến độ học tập về ban đầu?")) {
      const resetState: UserProgress = {
        nodeStatuses: {},
        dailyLogs: [],
        lastUpdated: new Date().toISOString(),
      };
      setProgress(resetState);
      localStorage.removeItem("roadmap_user_progress_v1");
    }
  };

  const handleImportProgress = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed && parsed.nodeStatuses) {
        setProgress(parsed);
        alert("Đã nhập dữ liệu tiến độ thành công!");
      }
    } catch {
      alert("File JSON không hợp lệ.");
    }
  };

  return (
    <div className="space-y-6 fade-in relative">
      {/* 1. Header with Search & Filter Toolbar */}
      <RoadmapHeader
        stats={stats}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExport={() => {
          const blob = new Blob([JSON.stringify(progress, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `roadmap-progress-${new Date().toISOString().split("T")[0]}.json`;
          a.click();
        }}
        onImport={handleImportProgress}
        onReset={handleResetProgress}
        onOpenFutureFeatures={() => setIsFutureModalOpen(true)}
        onSyncSupabase={() => ProgressService.loadProgress().then(setProgress)}
      />

      {/* 3. Toggle Button for Công Cụ Đối Chiếu (Hidden by Default) */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAlignmentTools((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-xs font-mono text-cyan-300 font-semibold transition-all shadow-sm"
        >
          <span>
            {showAlignmentTools
              ? "▼ Ẩn công cụ đối chiếu công việc & xác suất Target"
              : "► Hiện công cụ đối chiếu công việc & xác suất Target (Đang ẩn)"}
          </span>
        </button>
      </div>

      {/* 4. Alignment Tools (Goal Probability & Daily Task Logger) - Hidden by default */}
      {showAlignmentTools && (
        <div className="space-y-6 fade-in border border-cyan-900/40 p-4 rounded-2xl bg-cyan-950/10">
          <GoalProbabilityCard
            stats={probabilityStats}
            roadmapTitle={activeTitle}
          />
          <DailyTaskLogger
            roadmapId={activeRoadmapId}
            roadmapTitle={activeTitle}
            activeNodes={activeNodes}
            progress={progress}
            onProgressChange={setProgress}
          />
        </div>
      )}

      {/* 5. Main Interactive Diagram Canvas */}
      <RoadmapCanvas
        topics={activeTopics}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        getNodeStatus={(id) => progress.nodeStatuses[id] || "pending"}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />

      {/* 6. Side Inspector Drawer */}
      {selectedNode && (
        <NodeDrawer
          node={selectedNode}
          status={progress.nodeStatuses[selectedNode.id] || "pending"}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedNodeId(null)}
        />
      )}

      {/* 7. Notes / Future Features Modal */}
      <FutureFeaturesModal
        isOpen={isFutureModalOpen}
        onClose={() => setIsFutureModalOpen(false)}
      />
    </div>
  );
}
