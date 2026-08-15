import { useState } from "react";
import { RoadmapNode, NodeStatus } from "../../types/roadmap";

interface NodeDrawerProps {
  node: RoadmapNode | null;
  status: NodeStatus;
  onStatusChange: (nodeId: string, status: NodeStatus) => void;
  onClose: () => void;
}

type TabType = "overview" | "resources" | "guides" | "projects" | "interview" | "ai";

export function NodeDrawer({
  node,
  status,
  onStatusChange,
  onClose,
}: NodeDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  if (!node) return null;

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(promptText);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const resourceBadge: Record<string, { label: string; color: string }> = {
    docs: { label: "Official Docs", color: "bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700 font-bold" },
    video: { label: "Video", color: "bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-bold" },
    course: { label: "Course", color: "bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700 font-bold" },
    article: { label: "Article", color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold" },
  };

  const projectDifficulty: Record<string, string> = {
    Beginner: "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold",
    Intermediate: "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold",
    Advanced: "bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold",
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col fade-in backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 dark:border-gray-800 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-1">
              {node.category}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {node.title}
            </h2>
            {node.subtitle && (
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono mt-0.5 font-medium">
                {node.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-bold"
            title="Đóng (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Status Toggle Switcher */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-gray-400 tracking-wider font-bold">
            Trạng thái học tập của bạn:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "completed", label: "✓ Done", style: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600 hover:bg-emerald-200 font-bold" },
              { id: "in-progress", label: "⏳ Learning", style: "bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-600 hover:bg-amber-200 font-bold" },
              { id: "skipped", label: "↷ Skipped", style: "bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-300 dark:border-gray-700 hover:bg-slate-200 font-semibold" },
              { id: "pending", label: "○ To Learn", style: "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-300 dark:border-gray-700 hover:bg-slate-200 font-semibold" },
            ].map((btn) => {
              const isCurrent = status === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => onStatusChange(node.id, btn.id as NodeStatus)}
                  className={`text-xs font-medium py-2 rounded-lg border transition-all shadow-2xs ${btn.style} ${
                    isCurrent ? "ring-2 ring-cyan-500 font-bold scale-[1.02]" : "opacity-80"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-gray-800 gap-1 overflow-x-auto pt-2 no-scrollbar">
          {[
            { id: "overview", label: "📖 Overview" },
            { id: "resources", label: `🔗 Links (${node.resources?.length || 0})` },
            { id: "guides", label: `💡 Guides (${node.guides?.length || 0})` },
            { id: "projects", label: `🛠️ Projects (${node.projects?.length || 0})` },
            { id: "interview", label: `❓ Q&A (${node.interviewQA?.length || 0})` },
            { id: "ai", label: "🤖 AI Assistant" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-cyan-600 dark:border-cyan-400 text-cyan-900 dark:text-white bg-slate-100 dark:bg-gray-800/50 font-bold"
                  : "border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2">
                Mô tả chi tiết
              </h3>
              <p className="text-sm text-slate-800 dark:text-gray-200 leading-relaxed bg-slate-50 dark:bg-gray-950/60 p-4 rounded-xl border border-slate-200 dark:border-gray-800 font-medium">
                {node.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2">
                Chủ đề cốt lõi cần nắm (Key Topics)
              </h3>
              <ul className="space-y-1.5">
                {node.keyTopics.map((topic, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-slate-800 dark:text-gray-300 bg-slate-50 dark:bg-gray-800/40 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-800 font-medium"
                  >
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {node.codeSnippet && (
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2">
                  Minh họa Code / Strategy ({node.codeSnippet.language})
                </h3>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                  <code>{node.codeSnippet.code}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Learning Resources */}
        {activeTab === "resources" && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
              Tài nguyên & Liên kết đề xuất
            </h3>
            {node.resources && node.resources.length > 0 ? (
              node.resources.map((res, idx) => {
                const badge = resourceBadge[res.type] || resourceBadge.article;
                return (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700/60 hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-cyan-500/50 transition-all shadow-2xs group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-gray-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors truncate">
                        {res.title}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block truncate">
                        {res.url}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300">↗</span>
                    </div>
                  </a>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 dark:text-gray-400 italic">Chưa có liên kết tài nguyên cho node này.</p>
            )}
          </div>
        )}

        {/* Tab 3: Guides */}
        {activeTab === "guides" && (
          <div className="space-y-4">
            {node.guides && node.guides.length > 0 ? (
              node.guides.map((guide, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/40 space-y-3 shadow-2xs"
                >
                  <h4 className="font-bold text-sm text-cyan-900 dark:text-cyan-300 flex items-center gap-2">
                    <span>💡</span> {guide.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                    {guide.summary}
                  </p>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-cyan-800 dark:text-cyan-400 font-bold uppercase tracking-wider">
                      Điểm mấu chốt:
                    </span>
                    <ul className="space-y-1">
                      {guide.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="text-xs text-slate-700 dark:text-gray-300 flex items-start gap-1.5 font-medium">
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-gray-400 italic">Chưa có bài hướng dẫn riêng cho node này.</p>
            )}
          </div>
        )}

        {/* Tab 4: Practical Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {node.projects && node.projects.length > 0 ? (
              node.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">🛠️ {proj.title}</h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        projectDifficulty[proj.difficulty]
                      }`}
                    >
                      {proj.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">{proj.description}</p>
                  <div>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400 font-bold block mb-1">
                      Tính năng thực hành:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proj.keyFeatures.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700"
                        >
                          + {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-gray-400 italic">Chưa có bài tập dự án riêng cho node này.</p>
            )}
          </div>
        )}

        {/* Tab 5: Interview Q&A */}
        {activeTab === "interview" && (
          <div className="space-y-4">
            {node.interviewQA && node.interviewQA.length > 0 ? (
              node.interviewQA.map((qa, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 space-y-2 shadow-2xs">
                  <div className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300 flex items-start gap-2">
                    <span>❓</span>
                    <span>{qa.question}</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-gray-300 pl-6 pt-1 border-l-2 border-amber-500 leading-relaxed font-medium">
                    <strong className="text-slate-900 dark:text-white">Gợi ý trả lời: </strong>
                    {qa.answer}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-gray-400 italic">Chưa có bộ câu hỏi phỏng vấn riêng cho node này.</p>
            )}
          </div>
        )}

        {/* Tab 6: AI Tutor Prompt Helper */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 space-y-2 shadow-2xs">
              <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <span>🤖</span> AI Tutor Prompt Assistant
              </h4>
              <p className="text-xs text-slate-700 dark:text-gray-300 font-medium">
                Copy các câu prompt ngắn bên dưới để dán vào ChatGPT / Gemini hoặc AI Assistant của bạn để học nhanh chủ đề này:
              </p>
            </div>

            <div className="space-y-3">
              {(node.aiPrompts || [
                `Hãy đóng vai một Senior Backend Engineer và giải thích khái niệm ${node.title} bằng ví dụ thực tế trong sản xuất.`,
                `Tạo 3 câu hỏi trắc nghiệm kèm lời giải chi tiết để kiểm tra kiến thức về ${node.title}.`
              ]).map((promptText, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 flex items-start justify-between gap-3 group hover:border-indigo-500 transition-all shadow-2xs"
                >
                  <p className="text-xs text-slate-800 dark:text-gray-200 leading-relaxed font-mono font-medium">
                    "{promptText}"
                  </p>
                  <button
                    onClick={() => handleCopyPrompt(promptText)}
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-900/60 dark:hover:bg-indigo-700 text-white dark:text-indigo-200 text-xs font-mono font-bold border border-indigo-600 dark:border-indigo-700 flex-shrink-0 transition-colors shadow-2xs"
                  >
                    {copiedPrompt === promptText ? "✓ Copied" : "Copy Prompt"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
