export type NodeStatus = "completed" | "in-progress" | "skipped" | "pending";

export type ResourceType = "article" | "video" | "course" | "docs";

export interface LearningResource {
  title: string;
  url: string;
  type: ResourceType;
  provider?: string;
  free?: boolean;
}

export interface PracticalProject {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  keyFeatures: string[];
}

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface QuickGuide {
  title: string;
  summary: string;
  keyTakeaways: string[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  recommended?: boolean;
  essential?: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
  keyTopics: string[];
  resources?: LearningResource[];
  guides?: QuickGuide[];
  projects?: PracticalProject[];
  interviewQA?: InterviewQA[];
  aiPrompts?: string[];
  connections?: string[]; // IDs of nodes this node connects to
}

export interface RoadmapTopic {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  nodes: RoadmapNode[];
}

export interface DailyTaskLog {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  taskText: string;
  hoursSpent?: number;
  roadmapId: string;
  matchedNodeId?: string;
  matchedNodeTitle?: string;
  alignmentStatus: "aligned" | "off-track";
  feedbackMessage: string;
  /** ID from src/data/gapItems.ts (e.g. "P1", "ds-m3") this log closes. Undefined = not tied to a named gap item — a signal the task may be low-value busywork. */
  gapItemId?: string;
}

export interface UserProgress {
  nodeStatuses: Record<string, NodeStatus>;
  dailyLogs: DailyTaskLog[];
  lastUpdated: string;
  notes?: Record<string, string>;
}

export interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  skipped: number;
  pending: number;
  percentage: number;
}

export interface GoalProbabilityStats {
  probabilityPercentage: number;
  statusLevel: "Rất Cao" | "Khá Cao" | "Trung Bình" | "Thấp";
  statusColor: string;
  essentialCompletedCount: number;
  totalEssentialCount: number;
  alignedLogsCount: number;
  offTrackLogsCount: number;
  recommendations: string[];
}

