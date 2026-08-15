/**
 * sync-to-markdown.ts
 *
 * Generates / updates the career-roadmap markdown files from levels.ts.
 * The viz-app (levels.ts) is the single source of truth.
 * Run with:  pnpm tsx scripts/sync-to-markdown.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { LEVELS, GAP_ITEMS, TRACK_SUMMARIES } from "../src/data/levels.js";
import type { Level } from "../src/data/levels.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../../career-roadmap");
mkdirSync(OUT_DIR, { recursive: true });

const STATUS_EMOJI: Record<string, string> = {
  exceeded: "✅",
  met: "🟡",
  partial: "🟠",
  "not-met": "🔴",
};

const DOMAIN_ICON: Record<string, string> = {
  Frontend: "🖥️",
  Backend: "⚙️",
  DevOps: "🚀",
  Security: "🔒",
};

const PROJECT_ICON: Record<string, string> = {
  "todo-app": "📋",
  "foresight-mini": "🔬",
  "foresight-2": "🏭",
};

function codeBlock(code: string, lang = "ts"): string {
  return `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\``;
}

function slug(level: Level): string {
  const names: Record<number, string> = {
    1: "level-1-fresher",
    2: "level-2-junior",
    3: "level-3-mid",
    4: "level-4-senior",
    5: "level-5-staff-lead",
    6: "level-6-principal-consultant",
  };
  return names[level.id] ?? `level-${level.id}`;
}

// ── Requirements file (the "what you need to know") ───────────────────────────

function buildRequirementsFile(level: Level): string {
  const s = slug(level);
  const lines: string[] = [];

  lines.push(`# ${level.title} — ${level.subtitle}`);
  lines.push("");
  lines.push(`> **Experience**: ${level.experience}  `);
  lines.push(`> **Overall status**: ${level.overallStatus}`);
  lines.push("");
  lines.push(
    `> Self-answer each bullet point before viewing the [answers / detailed explanations](./${s}-answers.md).`,
  );
  lines.push("");

  for (const domain of level.domains) {
    lines.push(`## ${DOMAIN_ICON[domain.name]} ${domain.name}`);
    lines.push("");
    lines.push(`*Status: ${STATUS_EMOJI[domain.status]} ${domain.status}*`);
    lines.push("");
    lines.push("**Requirements**");
    for (const req of domain.requirements) {
      lines.push(`- ${req.text}`);
    }
    lines.push("");
    lines.push(`**Keywords**: ${domain.keywords.join(", ")}.`);
    lines.push("");
    lines.push(`**Application**: ${domain.applicationNote}`);
    lines.push("");

    if (domain.gaps && domain.gaps.length > 0) {
      lines.push("**Gaps / Next steps**");
      for (const gap of domain.gaps) {
        lines.push(`- ⚠ ${gap}`);
      }
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("## ✔ How to Self-Check Mastery");
  lines.push("");
  lines.push(level.selfCheck);
  lines.push("");

  return lines.join("\n");
}

// ── Answers file (the "how + why + real code") ────────────────────────────────

function buildAnswersFile(level: Level): string {
  const s = slug(level);
  const lines: string[] = [];

  lines.push(`# ${level.title} — Answers / Detailed Explanations`);
  lines.push("");
  lines.push(
    `This file answers every bullet point from [${s}.md](./${s}.md). Each requirement has:`,
  );
  lines.push("- **Answer** — what it is, why it matters");
  lines.push("- **Code example** — concrete runnable demonstration");
  lines.push(
    "- **Real examples** — code pulled directly from the reference projects",
  );
  lines.push("");

  for (const domain of level.domains) {
    lines.push(`---`);
    lines.push("");
    lines.push(`## ${DOMAIN_ICON[domain.name]} ${domain.name}`);
    lines.push("");

    // Requirements with answers
    for (let i = 0; i < domain.requirements.length; i++) {
      const req = domain.requirements[i];
      lines.push(`### ${String(i + 1).padStart(2, "0")}. ${req.text}`);
      lines.push("");
      lines.push(req.answer);
      lines.push("");
      if (req.code) {
        lines.push(codeBlock(req.code, req.language ?? "ts"));
        lines.push("");
      }
    }

    // Keywords recap
    lines.push(`**Keywords**: \`${domain.keywords.join("`, `")}\``);
    lines.push("");

    // Real project examples
    if (domain.projectRefs.length > 0) {
      lines.push("### 📂 Real Examples in Projects");
      lines.push("");
      lines.push(`> ${domain.applicationNote}`);
      lines.push("");

      for (const ref of domain.projectRefs) {
        const icon = PROJECT_ICON[ref.project];
        lines.push(`#### ${icon} \`${ref.project}\` — ${ref.label}`);
        lines.push("");
        if (ref.path) {
          lines.push(`*Path*: \`${ref.path}\``);
          lines.push("");
        }
        lines.push(ref.note);
        lines.push("");
        if (ref.codeSnippet) {
          lines.push(codeBlock(ref.codeSnippet, ref.language ?? "ts"));
          lines.push("");
        }
      }
    }

    // Gaps
    if (domain.gaps && domain.gaps.length > 0) {
      lines.push("### ⚠ Gaps / Next Steps");
      lines.push("");
      for (const gap of domain.gaps) {
        lines.push(`- ${gap}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ── Gap analysis file ─────────────────────────────────────────────────────────

function buildGapAnalysisFile(): string {
  const lines: string[] = [];

  lines.push("# Gap Analysis — Personal Assessment");
  lines.push("");
  lines.push(
    "Auto-generated from `viz-app/src/data/levels.ts`. Edit the source there, then re-run `pnpm tsx scripts/sync-to-markdown.ts`.",
  );
  lines.push("");

  // Track summaries
  lines.push("## Track Summaries");
  lines.push("");
  lines.push("| Track | Estimated Level | Status | Notes |");
  lines.push("|-------|----------------|--------|-------|");
  for (const t of TRACK_SUMMARIES) {
    lines.push(
      `| ${t.track} | ${t.estimatedLevel} | ${STATUS_EMOJI[t.status]} ${t.status} | ${t.notes} |`,
    );
  }
  lines.push("");

  // Gap items
  const statusOrder: Record<string, number> = {
    "in-progress": 0,
    todo: 1,
    done: 2,
  };
  const sorted = [...GAP_ITEMS].sort(
    (a, b) =>
      (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3) ||
      a.priority - b.priority,
  );

  const statusEmoji: Record<string, string> = {
    "in-progress": "🔄",
    todo: "⬜",
    done: "✅",
  };

  lines.push("## Gap Items");
  lines.push("");

  const byStatus: Record<string, typeof GAP_ITEMS> = {
    "in-progress": [],
    todo: [],
    done: [],
  };
  for (const item of sorted) byStatus[item.status]?.push(item);

  for (const status of ["in-progress", "todo", "done"]) {
    const items = byStatus[status];
    if (!items?.length) continue;
    lines.push(
      `### ${statusEmoji[status]} ${status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    );
    lines.push("");
    for (const item of items) {
      lines.push(
        `**P${item.priority} — ${item.title}** *(${item.project.map((p: string) => `\`${p}\``).join(", ")})*`,
      );
      lines.push(`${item.description}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ── Write files ───────────────────────────────────────────────────────────────

function write(filename: string, content: string) {
  const path = join(OUT_DIR, filename);
  writeFileSync(path, content, "utf8");
  console.log(`  ✓ ${filename}`);
}

console.log("\n🔄 Syncing viz-app/levels.ts → career-roadmap/\n");

for (const level of LEVELS) {
  const s = slug(level);
  write(`${s}.md`, buildRequirementsFile(level));
  write(`${s}-answers.md`, buildAnswersFile(level));
}

write("gap-analysis.md", buildGapAnalysisFile());

console.log("\n✅ Done. All markdown files updated.\n");
