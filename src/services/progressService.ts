import { UserProgress, NodeStatus, RoadmapNode, DailyTaskLog, ProgressStats, GoalProbabilityStats } from "../types/roadmap";
import {
  loadUserProgress,
  saveUserProgress,
  setNodeStatus as setNodeStatusLocal,
  addDailyTaskLog as addDailyTaskLogLocal,
  deleteDailyTaskLog as deleteDailyTaskLogLocal,
  calculateStats,
  calculateGoalProbability,
} from "../utils/storage";
import {
  fetchProgressFromSupabase,
  syncNodeStatusToSupabase,
  syncDailyTaskLogToSupabase,
  deleteDailyTaskLogFromSupabase,
} from "../utils/supabaseStorage";
import { isSupabaseConfigured } from "../lib/supabase";

export class ProgressService {
  /**
   * Load user progress with hybrid local + Supabase sync
   */
  static async loadProgress(): Promise<UserProgress> {
    const local = loadUserProgress();
    if (!isSupabaseConfigured()) {
      return local;
    }

    try {
      const remote = await fetchProgressFromSupabase();
      if (!remote) return local;

      // Merge local and remote
      const merged: UserProgress = {
        nodeStatuses: { ...local.nodeStatuses, ...remote.nodeStatuses },
        dailyLogs: remote.dailyLogs.length > 0 ? remote.dailyLogs : local.dailyLogs,
        lastUpdated: new Date().toISOString(),
      };
      saveUserProgress(merged);
      return merged;
    } catch (err) {
      console.warn("ProgressService load remote fallback to local:", err);
      return local;
    }
  }

  /**
   * Update node status and push to local & Supabase
   */
  static updateNodeStatus(
    current: UserProgress,
    nodeId: string,
    status: NodeStatus
  ): UserProgress {
    const updated = setNodeStatusLocal(current, nodeId, status);
    if (isSupabaseConfigured()) {
      syncNodeStatusToSupabase(nodeId, status);
    }
    return updated;
  }

  /**
   * Log daily task, analyze alignment, and sync to Supabase
   */
  static logDailyTask(
    current: UserProgress,
    taskText: string,
    hoursSpent: number | undefined,
    roadmapId: string,
    activeNodes: RoadmapNode[],
    gapItemId?: string
  ): UserProgress {
    const updated = addDailyTaskLogLocal(
      current,
      taskText,
      hoursSpent,
      roadmapId,
      activeNodes,
      gapItemId
    );

    if (isSupabaseConfigured() && updated.dailyLogs.length > 0) {
      syncDailyTaskLogToSupabase(updated.dailyLogs[0]);
    }
    return updated;
  }

  /**
   * Delete daily task log
   */
  static removeDailyTaskLog(current: UserProgress, logId: string): UserProgress {
    const updated = deleteDailyTaskLogLocal(current, logId);
    if (isSupabaseConfigured()) {
      deleteDailyTaskLogFromSupabase(logId);
    }
    return updated;
  }

  /**
   * Get completion statistics
   */
  static getStats(nodes: RoadmapNode[], progress: UserProgress): ProgressStats {
    return calculateStats(nodes, progress);
  }

  /**
   * Get Target Goal Achievement Probability
   */
  static getGoalProbability(
    nodes: RoadmapNode[],
    progress: UserProgress,
    roadmapId: string
  ): GoalProbabilityStats {
    return calculateGoalProbability(nodes, progress, roadmapId);
  }
}
