import { UserProgress, NodeStatus, ProgressStats, RoadmapNode, DailyTaskLog } from "../types/roadmap";

const STORAGE_KEY = "roadmap_user_progress_v1";

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        nodeStatuses: {},
        dailyLogs: [],
        lastUpdated: new Date().toISOString(),
        notes: {},
      };
    }
    const parsed = JSON.parse(raw);
    return {
      nodeStatuses: parsed.nodeStatuses || {},
      dailyLogs: parsed.dailyLogs || [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      notes: parsed.notes || {},
    };
  } catch (err) {
    console.error("Failed to load progress from localStorage:", err);
    return {
      nodeStatuses: {},
      dailyLogs: [],
      lastUpdated: new Date().toISOString(),
      notes: {},
    };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    const updated = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save progress to localStorage:", err);
  }
}

export function setNodeStatus(
  currentProgress: UserProgress,
  nodeId: string,
  status: NodeStatus
): UserProgress {
  const updated: UserProgress = {
    ...currentProgress,
    nodeStatuses: {
      ...currentProgress.nodeStatuses,
      [nodeId]: status,
    },
    lastUpdated: new Date().toISOString(),
  };
  saveUserProgress(updated);
  return updated;
}

export function analyzeTaskAlignment(
  taskText: string,
  activeNodes: RoadmapNode[]
): {
  alignmentStatus: "aligned" | "off-track";
  matchedNode?: RoadmapNode;
  feedbackMessage: string;
} {
  const normalizedTask = taskText.toLowerCase().trim();

  if (!normalizedTask) {
    return {
      alignmentStatus: "off-track",
      feedbackMessage: "Vui lòng nhập mô tả công việc hàng ngày.",
    };
  }

  // Find matching node
  for (const node of activeNodes) {
    const titleMatch = normalizedTask.includes(node.title.toLowerCase());
    const subtitleMatch = node.subtitle && normalizedTask.includes(node.subtitle.toLowerCase());
    const topicMatch = node.keyTopics.some((topic) =>
      normalizedTask.includes(topic.toLowerCase()) || topic.toLowerCase().includes(normalizedTask)
    );

    if (titleMatch || subtitleMatch || topicMatch) {
      return {
        alignmentStatus: "aligned",
        matchedNode: node,
        feedbackMessage: `✅ Tuyệt vời! Công việc hôm nay đóng góp trực tiếp vào node: "${node.title}". Hãy duy trì đà này!`,
      };
    }
  }

  // Generic keyword check
  const genericKeywords = ["read", "hoc", "code", "refactor", "test", "docker", "postgres", "api", "jwt", "kafka", "redis", "fastapi", "nextjs", "aws", "shopify", "ads", "auth", "ci/cd"];
  const matchedKeyword = genericKeywords.find((kw) => normalizedTask.includes(kw));

  if (matchedKeyword) {
    // Partial match hint
    const partialNode = activeNodes.find((n) =>
      n.keyTopics.some((t) => t.toLowerCase().includes(matchedKeyword))
    );
    if (partialNode) {
      return {
        alignmentStatus: "aligned",
        matchedNode: partialNode,
        feedbackMessage: `✅ Có liên quan! Công việc có chứa từ khóa liên quan đến "${partialNode.title}".`,
      };
    }
  }

  return {
    alignmentStatus: "off-track",
    feedbackMessage: `⚠️ CẢNH BÁO PHẢN HỒI NGAY: Công việc bạn làm hôm nay KHÔNG nằm trong các node chiến lược của Lộ Trình này! Bạn đang bị cuốn vào công việc bảo trì/sự vụ không tạo đột phá. Cần điều chỉnh ngay!`,
  };
}

export function addDailyTaskLog(
  currentProgress: UserProgress,
  taskText: string,
  hoursSpent: number | undefined,
  roadmapId: string,
  activeNodes: RoadmapNode[],
  gapItemId?: string
): UserProgress {
  const analysis = analyzeTaskAlignment(taskText, activeNodes);
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  // Pointing at a named gap item (P1-P11 / ds-m1-m6) is a stronger,
  // harder-to-fake alignment signal than free-text keyword matching —
  // it overrides an "off-track" keyword verdict.
  const alignmentStatus = gapItemId ? "aligned" : analysis.alignmentStatus;
  const feedbackMessage = gapItemId
    ? `✅ Đóng gap-item ${gapItemId} — có tiêu chuẩn cụ thể để đối chiếu, không chỉ trùng từ khóa.`
    : analysis.feedbackMessage;

  const newLog: DailyTaskLog = {
    id: `log-${Date.now()}`,
    date: dateStr,
    createdAt: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    taskText,
    hoursSpent,
    roadmapId,
    matchedNodeId: analysis.matchedNode?.id,
    matchedNodeTitle: analysis.matchedNode?.title,
    alignmentStatus,
    feedbackMessage,
    gapItemId,
  };

  // Auto update node status to in-progress if aligned
  let updatedStatuses = { ...currentProgress.nodeStatuses };
  if (analysis.matchedNode && updatedStatuses[analysis.matchedNode.id] !== "completed") {
    updatedStatuses[analysis.matchedNode.id] = "in-progress";
  }

  const updated: UserProgress = {
    ...currentProgress,
    nodeStatuses: updatedStatuses,
    dailyLogs: [newLog, ...(currentProgress.dailyLogs || [])],
    lastUpdated: now.toISOString(),
  };

  saveUserProgress(updated);
  return updated;
}

export function deleteDailyTaskLog(
  currentProgress: UserProgress,
  logId: string
): UserProgress {
  const updated: UserProgress = {
    ...currentProgress,
    dailyLogs: (currentProgress.dailyLogs || []).filter((log) => log.id !== logId),
    lastUpdated: new Date().toISOString(),
  };
  saveUserProgress(updated);
  return updated;
}

export function calculateStats(
  allNodes: RoadmapNode[],
  progress: UserProgress
): ProgressStats {
  const total = allNodes.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      skipped: 0,
      pending: 0,
      percentage: 0,
    };
  }

  let completed = 0;
  let inProgress = 0;
  let skipped = 0;

  for (const node of allNodes) {
    const status = progress.nodeStatuses[node.id] || "pending";
    if (status === "completed") completed++;
    else if (status === "in-progress") inProgress++;
    else if (status === "skipped") skipped++;
  }

  const pending = total - (completed + inProgress + skipped);
  const percentage = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    inProgress,
    skipped,
    pending,
    percentage,
  };
}

export function calculateGoalProbability(
  allNodes: RoadmapNode[],
  progress: UserProgress,
  roadmapId: string
): import("../types/roadmap").GoalProbabilityStats {
  const essentialNodes = allNodes.filter((n) => n.essential);
  const totalEssential = essentialNodes.length || 1;

  let essentialCompleted = 0;
  for (const node of essentialNodes) {
    if (progress.nodeStatuses[node.id] === "completed") {
      essentialCompleted++;
    }
  }

  const overallStats = calculateStats(allNodes, progress);

  // Daily log alignment stats for this roadmap
  const roadmapLogs = (progress.dailyLogs || []).filter(
    (log) => log.roadmapId === roadmapId
  );
  const alignedLogsCount = roadmapLogs.filter(
    (l) => l.alignmentStatus === "aligned"
  ).length;
  const offTrackLogsCount = roadmapLogs.filter(
    (l) => l.alignmentStatus === "off-track"
  ).length;

  // Base score calculation
  const essentialRatio = essentialCompleted / totalEssential;
  const overallRatio = overallStats.completed / (allNodes.length || 1);

  let rawScore = essentialRatio * 60 + overallRatio * 25;

  // Daily log alignment bonus / penalty
  if (alignedLogsCount > 0) {
    rawScore += Math.min(15, alignedLogsCount * 5);
  }
  if (offTrackLogsCount > 0) {
    rawScore -= Math.min(15, offTrackLogsCount * 4);
  }

  // Base starting probability for beginning journey
  if (rawScore < 15 && overallStats.completed === 0) {
    rawScore = 15;
  }

  const probabilityPercentage = Math.min(
    98,
    Math.max(5, Math.round(rawScore))
  );

  let statusLevel: "Rất Cao" | "Khá Cao" | "Trung Bình" | "Thấp" = "Thấp";
  let statusColor = "text-rose-400 border-rose-800 bg-rose-950/40";

  if (probabilityPercentage >= 80) {
    statusLevel = "Rất Cao";
    statusColor = "text-emerald-300 border-emerald-700 bg-emerald-950/50";
  } else if (probabilityPercentage >= 60) {
    statusLevel = "Khá Cao";
    statusColor = "text-cyan-300 border-cyan-700 bg-cyan-950/50";
  } else if (probabilityPercentage >= 35) {
    statusLevel = "Trung Bình";
    statusColor = "text-amber-300 border-amber-700 bg-amber-950/50";
  }

  // Generate actionable recommendations
  const recommendations: string[] = [];
  const nextEssential = essentialNodes.find(
    (n) => progress.nodeStatuses[n.id] !== "completed"
  );

  if (nextEssential) {
    recommendations.push(
      `Tập trung hoàn thành Node cốt lõi: "${nextEssential.title}" để tăng +15% xác suất đạt Target.`
    );
  }

  if (offTrackLogsCount > alignedLogsCount) {
    recommendations.push(
      `Cảnh báo: Số ngày làm việc lệch lộ trình (${offTrackLogsCount}) nhiều hơn số ngày đúng hướng. Cần điều chỉnh công việc daily ngay!`
    );
  } else if (roadmapLogs.length === 0) {
    recommendations.push(
      `Nhập công việc hàng ngày vào Daily Task Logger để tăng điểm thưởng alignment và xác suất đạt mục tiêu!`
    );
  }

  return {
    probabilityPercentage,
    statusLevel,
    statusColor,
    essentialCompletedCount: essentialCompleted,
    totalEssentialCount: totalEssential,
    alignedLogsCount,
    offTrackLogsCount,
    recommendations,
  };
}

export function exportProgressJSON(progress: UserProgress): void {
  const blob = new Blob([JSON.stringify(progress, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `roadmap-progress-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProgressJSON(
  jsonText: string
): UserProgress | null {
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed && typeof parsed === "object" && parsed.nodeStatuses) {
      saveUserProgress(parsed);
      return parsed as UserProgress;
    }
    return null;
  } catch (err) {
    console.error("Failed to parse progress JSON:", err);
    return null;
  }
}
