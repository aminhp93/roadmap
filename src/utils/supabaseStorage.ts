import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { UserProgress, NodeStatus, DailyTaskLog } from "../types/roadmap";

export async function fetchProgressFromSupabase(): Promise<UserProgress | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // 1. Fetch Node Statuses
    const { data: statusData, error: statusError } = await supabase
      .from("user_node_progress")
      .select("node_id, status");

    if (statusError) {
      console.warn("Supabase fetch user_node_progress error:", statusError);
      return null;
    }

    const nodeStatuses: Record<string, NodeStatus> = {};
    if (statusData) {
      statusData.forEach((row) => {
        nodeStatuses[row.node_id] = row.status as NodeStatus;
      });
    }

    // 2. Fetch Daily Task Logs
    const { data: logsData, error: logsError } = await supabase
      .from("daily_task_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (logsError) {
      console.warn("Supabase fetch daily_task_logs error:", logsError);
    }

    const dailyLogs: DailyTaskLog[] = (logsData || []).map((row) => ({
      id: row.id,
      date: row.created_at ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      createdAt: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      taskText: row.task_text,
      hoursSpent: row.hours_spent ? parseFloat(row.hours_spent) : undefined,
      roadmapId: row.roadmap_id,
      matchedNodeId: row.matched_node_id,
      matchedNodeTitle: row.matched_node_title,
      alignmentStatus: row.alignment_status as "aligned" | "off-track",
      feedbackMessage: row.feedback_message,
      gapItemId: row.gap_item_id || undefined,
    }));

    return {
      nodeStatuses,
      dailyLogs,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Failed to fetch progress from Supabase:", err);
    return null;
  }
}

export async function syncNodeStatusToSupabase(
  nodeId: string,
  status: NodeStatus
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("user_node_progress").upsert(
      {
        user_id: "default_user",
        node_id: nodeId,
        status: status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, node_id" }
    );

    if (error) {
      console.error("Supabase upsert status error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to sync node status to Supabase:", err);
    return false;
  }
}

export async function syncDailyTaskLogToSupabase(log: DailyTaskLog): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("daily_task_logs").upsert({
      id: log.id,
      user_id: "default_user",
      roadmap_id: log.roadmapId,
      task_text: log.taskText,
      hours_spent: log.hoursSpent,
      alignment_status: log.alignmentStatus,
      matched_node_id: log.matchedNodeId,
      matched_node_title: log.matchedNodeTitle,
      feedback_message: log.feedbackMessage,
      gap_item_id: log.gapItemId,
    });

    if (error) {
      console.error("Supabase insert daily log error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to sync daily log to Supabase:", err);
    return false;
  }
}

export async function deleteDailyTaskLogFromSupabase(logId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("daily_task_logs")
      .delete()
      .eq("id", logId);

    if (error) {
      console.error("Supabase delete daily log error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete daily log from Supabase:", err);
    return false;
  }
}
