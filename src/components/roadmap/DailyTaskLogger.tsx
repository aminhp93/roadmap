import { useState } from "react";
import { RoadmapNode, DailyTaskLog, UserProgress } from "../../types/roadmap";
import { analyzeTaskAlignment, addDailyTaskLog, deleteDailyTaskLog } from "../../utils/storage";
import { getGapItemsForRoadmap } from "../../data/gapItems";

interface DailyTaskLoggerProps {
  roadmapId: string;
  roadmapTitle: string;
  activeNodes: RoadmapNode[];
  progress: UserProgress;
  onProgressChange: (updated: UserProgress) => void;
}

export function DailyTaskLogger({
  roadmapId,
  roadmapTitle,
  activeNodes,
  progress,
  onProgressChange,
}: DailyTaskLoggerProps) {
  const [taskInput, setTaskInput] = useState("");
  const [hoursInput, setHoursInput] = useState<string>("");
  const [gapItemId, setGapItemId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  const gapItems = getGapItemsForRoadmap(roadmapId);

  // Live alignment preview as user types
  const liveAnalysis = taskInput.trim()
    ? analyzeTaskAlignment(taskInput, activeNodes)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    const hours = hoursInput ? parseFloat(hoursInput) : undefined;
    const updated = addDailyTaskLog(
      progress,
      taskInput,
      hours,
      roadmapId,
      activeNodes,
      gapItemId || undefined
    );
    onProgressChange(updated);

    setTaskInput("");
    setHoursInput("");
    setGapItemId("");
  };

  const handleDelete = (logId: string) => {
    const updated = deleteDailyTaskLog(progress, logId);
    onProgressChange(updated);
  };

  // Filter logs for current active roadmap
  const roadmapLogs = (progress.dailyLogs || []).filter(
    (log) => log.roadmapId === roadmapId
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Logger Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h3 className="font-bold text-white text-base sm:text-lg">
            Đối Chiếu Công Việc Hàng Ngày (Daily Task Alignment)
          </h3>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
            Phản Hồi Tức Thì
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-gray-400 hover:text-white underline font-mono"
        >
          {isOpen ? "Ẩn công cụ ▲" : "Mở công cụ ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5 fade-in">
          {/* Instruction */}
          <p className="text-xs text-gray-300 leading-relaxed">
            Nhập việc bạn đã/đang làm hôm nay vào bên dưới. Hệ thống sẽ tự động phân tích từ khóa và đối chiếu với Lộ Trình <strong className="text-cyan-400">"{roadmapTitle}"</strong> để phản hồi ngay xem việc bạn làm có giúp đạt mục tiêu không hay đang bị lệch hướng! <strong className="text-amber-300">Chọn thêm Gap-Item bên dưới nếu có</strong> — khớp từ khóa chỉ nói lên "liên quan chủ đề", còn Gap-Item mới là bằng chứng bạn đóng được 1 việc cụ thể, đúng chuẩn.
          </p>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-9">
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                  Nội dung công việc hôm nay:
                </label>
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Ví dụ: Dùng EXPLAIN ANALYZE tối ưu PostgreSQL index, hoặc Sửa bug UI..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                  Thời gian (giờ):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  placeholder="VD: 2.5"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {gapItems.length > 0 && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                  Gap-Item đóng được (khuyến nghị — tiêu chuẩn thật, không phải keyword match):
                </label>
                <select
                  value={gapItemId}
                  onChange={(e) => setGapItemId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">— Không gắn Gap-Item cụ thể —</option>
                  {gapItems.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                {gapItemId && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    {gapItems.find((g) => g.id === gapItemId)?.description}
                  </p>
                )}
              </div>
            )}

            {/* Live Instant Alignment Feedback Card */}
            {liveAnalysis && (
              <div
                className={`p-4 rounded-xl border transition-all fade-in ${
                  liveAnalysis.alignmentStatus === "aligned"
                    ? "bg-emerald-950/40 border-emerald-600/60 text-emerald-200"
                    : "bg-rose-950/50 border-rose-600/80 text-rose-200 shadow-lg shadow-rose-950/40 animate-pulse"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">
                    {liveAnalysis.alignmentStatus === "aligned" ? "✅" : "⚠️"}
                  </span>
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm">
                      {liveAnalysis.alignmentStatus === "aligned"
                        ? "KHỚP LỘ TRÌNH CHIẾN LƯỢC"
                        : "CẢNH BÁO LỆCH LỘ TRÌNH (FEEDBACK NGAY)"}
                    </div>
                    <p className="text-xs leading-relaxed">{liveAnalysis.feedbackMessage}</p>

                    {liveAnalysis.alignmentStatus === "off-track" && (
                      <div className="mt-2 pt-2 border-t border-rose-800/40 text-[11px] font-mono text-rose-300">
                        💡 <strong>Gợi ý hành động:</strong> Hãy ưu tiên chọn làm 1 trong các Node sau để bám sát mục tiêu:
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-300">
                          {activeNodes.slice(0, 3).map((n) => (
                            <li key={n.id}>
                              <strong className="text-cyan-300">{n.title}</strong> ({n.category})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!taskInput.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold font-mono transition-all disabled:opacity-50"
            >
              + Ghi Nhận Công Việc & Lưu Tiến Độ
            </button>
          </form>

          {/* Daily Logs History Table */}
          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span>Lịch Sử Đối Chiếu Hôm Nay ({roadmapLogs.length})</span>
              <span className="text-[10px] text-gray-500">Auto-saved to LocalStorage</span>
            </h4>

            {roadmapLogs.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {roadmapLogs.map((log) => {
                  const isAligned = log.alignmentStatus === "aligned";
                  return (
                    <div
                      key={log.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        isAligned
                          ? "bg-gray-950/80 border-emerald-900/50 text-gray-200"
                          : "bg-rose-950/20 border-rose-900/50 text-gray-300"
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              isAligned
                                ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                                : "bg-rose-950 text-rose-300 border-rose-700"
                            }`}
                          >
                            {isAligned ? "✓ Aligned" : "⚠ Off-Track"}
                          </span>
                          {log.gapItemId && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-amber-950 text-amber-300 border-amber-700">
                              🎯 {log.gapItemId}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-gray-400">
                            {log.date} {log.createdAt}
                          </span>
                          {log.hoursSpent && (
                            <span className="text-[10px] font-mono bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded">
                              ⏱ {log.hoursSpent}h
                            </span>
                          )}
                        </div>

                        <div className="font-medium text-white">{log.taskText}</div>

                        {log.matchedNodeTitle && (
                          <div className="text-[11px] font-mono text-emerald-400">
                            🎯 Node đóng góp: {log.matchedNodeTitle}
                          </div>
                        )}
                        {!isAligned && (
                          <div className="text-[11px] font-mono text-rose-400">
                            ⚠️ {log.feedbackMessage}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-gray-500 hover:text-rose-400 text-xs p-1"
                        title="Xóa log này"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-950/50 border border-gray-800 text-center text-xs text-gray-500 italic">
                Chưa có công việc nào được ghi nhận cho lộ trình này. Hãy nhập công việc đầu tiên ở trên!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
