export interface GapItem {
  id: string;
  roadmapId: "core" | "dropshipping-plan";
  label: string;
  description: string;
}

/**
 * Concrete, closeable units of work — sourced from
 * workspace/career-roadmap/gap-analysis.md (P1-P11) and the dropship
 * 6-month plan's monthly goals. A daily log should point at one of these
 * (or "none") instead of relying purely on free-text keyword matching,
 * so "aligned" means "closed a named gap", not just "mentioned a topic".
 */
export const GAP_ITEMS: GapItem[] = [
  { id: "P1", roadmapId: "core", label: "P1 — Automated Tests", description: "Unit tests cho services/auth.service.ts + integration tests (supertest) cho /api/auth/*, /api/todos" },
  { id: "P2", roadmapId: "core", label: "P2 — Versioned DB Migrations", description: "node-pg-migrate hoặc Prisma up/down migrations thay cho db/init.sql chạy 1 lần" },
  { id: "P3", roadmapId: "core", label: "P3 — Redis Caching Layer", description: "Cache /api/todos/stats theo userId, invalidate khi todo items thay đổi" },
  { id: "P4", roadmapId: "core", label: "P4 — Structured Logging (pino)", description: "Thay console.log/console.error bằng pino JSON logging + request ID" },
  { id: "P5", roadmapId: "core", label: "P5 — CI Upgrades", description: "Thêm tsc --noEmit, test run, lint, node_modules caching vào ci.yml" },
  { id: "P6", roadmapId: "core", label: "P6 — Frontend Auth Integration", description: "Login UI + token persistence cho fe-vite/fe-nextjs" },
  { id: "P7", roadmapId: "core", label: "P7 — Senior/Staff Artifacts", description: "Postmortem, RFC 10M users, technical due-diligence report" },
  { id: "P8", roadmapId: "core", label: "P8 — Security Headers (helmet)", description: "helmet() trong src/app.ts — CSP, HSTS, X-Frame-Options" },
  { id: "P9", roadmapId: "core", label: "P9 — npm audit Remediation", description: "Fix 3 lỗ hổng transitive (@apollo/server, brace-expansion, uuid) + Dependabot" },
  { id: "P10", roadmapId: "core", label: "P10 — Least-Privilege DB Role", description: "App role riêng thay vì kết nối bằng postgres/postgres superuser" },
  { id: "P11", roadmapId: "core", label: "P11 — Dockerfile HEALTHCHECK", description: "Thêm HEALTHCHECK directive khớp với /health endpoint" },
  { id: "ds-m1", roadmapId: "dropshipping-plan", label: "Month 1 — Niche Research & Financial Rules", description: "Unit economics 3x COGS, supplier vetting, cap ads $300" },
  { id: "ds-m2", roadmapId: "dropshipping-plan", label: "Month 2 — Store Setup & Trust Building", description: "Shopify/Woo CRO, load < 2.0s, Stripe/PayPal, legal policies" },
  { id: "ds-m3", roadmapId: "dropshipping-plan", label: "Month 3 — Creative Testing & Ad Campaigns", description: "10 creatives, $5-10/ngày, quy tắc Kill Adset $15" },
  { id: "ds-m4", roadmapId: "dropshipping-plan", label: "Month 4 — Q4 Peak Season & Auto-Fulfillment", description: "DSers/CJ API auto order, tracking 24h, scale 20%/ngày" },
  { id: "ds-m5", roadmapId: "dropshipping-plan", label: "Month 5 — Retention & Email Automation", description: "Klaviyo flows, upsell app, daily P&L sheet" },
  { id: "ds-m6", roadmapId: "dropshipping-plan", label: "Month 6 — Profitability Audit & Scale Decision", description: "Full P&L audit, verify Net Profit >= $0" },
];

export function getGapItemsForRoadmap(roadmapId: string): GapItem[] {
  return GAP_ITEMS.filter((g) => g.roadmapId === roadmapId);
}
