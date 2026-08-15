import { useRef, useLayoutEffect, useState } from "react";
import { RoadmapTopic, NodeStatus } from "../../types/roadmap";

interface RoadmapCanvasProps {
  topics: RoadmapTopic[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  getNodeStatus: (nodeId: string) => NodeStatus;
  searchQuery?: string;
  statusFilter?: string;
}

export function RoadmapCanvas({
  topics,
  selectedNodeId,
  onSelectNode,
  getNodeStatus,
  searchQuery = "",
  statusFilter = "all",
}: RoadmapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<
    Array<{ x1: number; y1: number; x2: number; y2: number; active: boolean; isDotted?: boolean }>
  >([]);

  // Calculate SVG connector paths without line overlaps
  useLayoutEffect(() => {
    function updateConnections() {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines: Array<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        active: boolean;
        isDotted?: boolean;
      }> = [];

      // 1. Vertical Spine connections between consecutive topic main boxes
      for (let i = 0; i < topics.length - 1; i++) {
        const fromEl = document.getElementById(`topic-main-${topics[i].id}`);
        const toEl = document.getElementById(`topic-main-${topics[i + 1].id}`);

        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();

          newLines.push({
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.bottom - containerRect.top,
            x2: toRect.left + toRect.width / 2 - containerRect.left,
            y2: toRect.top - containerRect.top,
            active: true,
            isDotted: false,
          });
        }
      }

      // 2. Horizontal Branching connections from topic main box to child nodes
      topics.forEach((topic) => {
        const mainEl = document.getElementById(`topic-main-${topic.id}`);
        if (!mainEl) return;
        const mainRect = mainEl.getBoundingClientRect();

        topic.nodes.forEach((node) => {
          const nodeEl = document.getElementById(`node-${node.id}`);
          if (!nodeEl) return;
          const nodeRect = nodeEl.getBoundingClientRect();

          const isNodeOnRight = nodeRect.left > mainRect.left;

          const x1 = isNodeOnRight
            ? mainRect.right - containerRect.left
            : mainRect.left - containerRect.left;
          const y1 = mainRect.top + mainRect.height / 2 - containerRect.top;

          const x2 = isNodeOnRight
            ? nodeRect.left - containerRect.left
            : nodeRect.right - containerRect.left;
          const y2 = nodeRect.top + nodeRect.height / 2 - containerRect.top;

          const isDone = getNodeStatus(node.id) === "completed";

          newLines.push({
            x1,
            y1,
            x2,
            y2,
            active: isDone,
            isDotted: true,
          });
        });
      });

      setLines(newLines);
    }

    updateConnections();
    window.addEventListener("resize", updateConnections);
    const timer = setTimeout(updateConnections, 250);

    return () => {
      window.removeEventListener("resize", updateConnections);
      clearTimeout(timer);
    };
  }, [topics, selectedNodeId, getNodeStatus, searchQuery, statusFilter]);

  const statusBadges: Record<
    NodeStatus,
    { icon: string; bg: string; text: string; ring: string }
  > = {
    completed: {
      icon: "✓",
      bg: "bg-purple-600 text-white",
      text: "text-purple-300",
      ring: "ring-2 ring-purple-500",
    },
    "in-progress": {
      icon: "⏳",
      bg: "bg-amber-500 text-black font-bold",
      text: "text-amber-300",
      ring: "ring-2 ring-amber-400 animate-pulse",
    },
    skipped: {
      icon: "↷",
      bg: "bg-gray-700 text-gray-300",
      text: "text-gray-400",
      ring: "",
    },
    pending: {
      icon: "✓",
      bg: "bg-purple-600 text-white opacity-80",
      text: "text-gray-300",
      ring: "",
    },
  };

  return (
    <div ref={containerRef} className="relative w-full pb-28 pt-4">
      {/* SVG Connecting Lines (Clean Spine & Horizontal Branch Lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {lines.map((line, idx) => {
          if (line.isDotted) {
            // Horizontal Branch Line (Curved bezier to child item)
            const midX = (line.x1 + line.x2) / 2;
            const pathD = `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`;
            return (
              <path
                key={idx}
                d={pathD}
                fill="none"
                stroke={line.active ? "#a855f7" : "#475569"}
                strokeWidth={line.active ? "2.5" : "2"}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
            );
          } else {
            // Central Vertical Spine Line
            return (
              <line
                key={idx}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#38bdf8"
                strokeWidth="3"
                className="opacity-80"
              />
            );
          }
        })}
      </svg>

      {/* Structured Top-to-Bottom Flow Layout */}
      <div className="space-y-16 relative z-10 max-w-5xl mx-auto">
        {topics.map((topic, topicIdx) => {
          // Filter visible nodes based on search & status
          const visibleNodes = topic.nodes.filter((node) => {
            const status = getNodeStatus(node.id);
            const matchesQuery =
              !searchQuery ||
              node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              node.keyTopics.some((t) =>
                t.toLowerCase().includes(searchQuery.toLowerCase())
              );

            const matchesStatus =
              statusFilter === "all" ||
              (statusFilter === "completed" && status === "completed") ||
              (statusFilter === "in-progress" && status === "in-progress") ||
              (statusFilter === "skipped" && status === "skipped") ||
              (statusFilter === "pending" && status === "pending");

            return matchesQuery && matchesStatus;
          });

          if (visibleNodes.length === 0 && (searchQuery || statusFilter !== "all")) {
            return null;
          }

          // Alternate left and right branching per topic for clean balanced layout
          const isLeftBranching = topicIdx % 2 !== 0;

          return (
            <div
              key={topic.id}
              className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 relative"
            >
              {/* Left Branch Column (if alternate) */}
              {isLeftBranching ? (
                <div className="w-full md:w-80 space-y-2.5 flex flex-col items-end order-2 md:order-1">
                  {visibleNodes.map((node) => {
                    const status = getNodeStatus(node.id);
                    const isSelected = node.id === selectedNodeId;
                    const badge = statusBadges[status];

                    return (
                      <button
                        key={node.id}
                        id={`node-${node.id}`}
                        onClick={() => onSelectNode(node.id)}
                        className={`w-full max-w-xs text-right rounded-xl px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-gray-900 border-2 transition-all duration-200 shadow-md relative flex items-center justify-between gap-2 group cursor-pointer ${
                          isSelected
                            ? "border-purple-600 ring-4 ring-purple-500/30 scale-105 font-bold"
                            : "border-gray-900 hover:border-purple-600"
                        }`}
                      >
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug flex-1 text-left">
                          {node.title}
                        </span>

                        {/* Status Checkmark Badge (Right Edge) */}
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${badge.bg}`}
                        >
                          {badge.icon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Empty spacer when right branching */
                <div className="hidden md:block w-80 order-1" />
              )}

              {/* Central Main Topic Block (Yellow Box like roadmap.sh) */}
              <div className="flex flex-col items-center order-1 md:order-2 z-10">
                <button
                  id={`topic-main-${topic.id}`}
                  className="w-64 sm:w-72 rounded-2xl px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold border-2 border-gray-950 shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center text-sm sm:text-base tracking-tight flex items-center justify-center gap-2"
                >
                  <span className="text-xl">{topic.icon}</span>
                  <span className="truncate">{topic.title.replace(/^\d+\.\s*/, "")}</span>
                </button>
              </div>

              {/* Right Branch Column (if not left branching) */}
              {!isLeftBranching ? (
                <div className="w-full md:w-80 space-y-2.5 flex flex-col items-start order-3">
                  {visibleNodes.map((node) => {
                    const status = getNodeStatus(node.id);
                    const isSelected = node.id === selectedNodeId;
                    const badge = statusBadges[status];

                    return (
                      <button
                        key={node.id}
                        id={`node-${node.id}`}
                        onClick={() => onSelectNode(node.id)}
                        className={`w-full max-w-xs text-left rounded-xl px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-gray-900 border-2 transition-all duration-200 shadow-md relative flex items-center justify-between gap-2 group cursor-pointer ${
                          isSelected
                            ? "border-purple-600 ring-4 ring-purple-500/30 scale-105 font-bold"
                            : "border-gray-900 hover:border-purple-600"
                        }`}
                      >
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug flex-1">
                          {node.title}
                        </span>

                        {/* Status Checkmark Badge (Right Edge) */}
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${badge.bg}`}
                        >
                          {badge.icon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Empty spacer when left branching */
                <div className="hidden md:block w-80 order-3" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
