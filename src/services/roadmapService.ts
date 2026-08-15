import { RoadmapTopic, RoadmapNode } from "../types/roadmap";
import { STRATEGIC_ROADMAPS_DATA } from "../data/strategicRoadmaps";

export interface RoadmapInfo {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
}

export class RoadmapService {
  /**
   * List all available Master Roadmaps metadata
   */
  static getMasterRoadmaps(): RoadmapInfo[] {
    return [
      {
        id: "core",
        title: "1. Core (Backend/Fullstack Mastery)",
        category: "Career & Technical Mastery",
        icon: "⚡",
        description: "roadmap.sh chuẩn quốc tế + Node.js deep-dive Senior/Lead + Core-Platform Architecture — thực hành qua dự án Core.",
      },
      {
        id: "dropshipping-plan",
        title: "2. Dropshipping 6-Month Plan",
        category: "Business Execution",
        icon: "🛒",
        description: "Kế hoạch 6 tháng kinh doanh E-commerce: Unit Economics 3x COGS, Cap $300, CRO, Net Profit >= $0",
      },
    ];
  }

  /**
   * Get roadmap topics and title by ID
   */
  static getRoadmap(roadmapId: string): { title: string; topics: RoadmapTopic[] } {
    if (STRATEGIC_ROADMAPS_DATA[roadmapId]) {
      const data = STRATEGIC_ROADMAPS_DATA[roadmapId];
      return {
        title: data.title,
        topics: data.topics,
      };
    }

    // Default fallback to core roadmap
    return {
      title: STRATEGIC_ROADMAPS_DATA["core"].title,
      topics: STRATEGIC_ROADMAPS_DATA["core"].topics,
    };
  }

  /**
   * Get flattened nodes for a specific roadmap
   */
  static getNodes(roadmapId: string): RoadmapNode[] {
    const { topics } = this.getRoadmap(roadmapId);
    return topics.flatMap((topic) => topic.nodes);
  }

  /**
   * Search across all nodes in a roadmap by query string
   */
  static searchNodes(nodes: RoadmapNode[], query: string): RoadmapNode[] {
    if (!query || !query.trim()) return nodes;
    const q = query.toLowerCase().trim();
    return nodes.filter(
      (node) =>
        node.title.toLowerCase().includes(q) ||
        (node.subtitle && node.subtitle.toLowerCase().includes(q)) ||
        node.description.toLowerCase().includes(q) ||
        node.keyTopics.some((t) => t.toLowerCase().includes(q))
    );
  }
}
