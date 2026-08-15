import { useState, useEffect } from "react";
import {
  DAILY_TIME_SLOTS,
  REST_DAY_EXEMPT_SLOT_IDS,
  generateDateRange,
  generateICSCalendarContent,
  getGoogleCalendarLink,
} from "../../data/dailySchedule";
import { UserProgress } from "../../types/roadmap";
import { ProgressService } from "../../services/progressService";
import { RoadmapService } from "../../services/roadmapService";

interface DailyCalendarViewProps {
  progress: UserProgress;
  onProgressChange: (updated: UserProgress) => void;
}

export function DailyCalendarView({
  progress,
  onProgressChange,
}: DailyCalendarViewProps) {
  const startDate = "2026-08-01";
  const endDate = "2027-01-31";
  const allDates = generateDateRange(startDate, endDate);

  const [selectedDate, setSelectedDate] = useState<string>("2026-08-11");
  const [checkedSlots, setCheckedSlots] = useState<Record<string, Record<string, boolean>>>({});
  const [jsVideoProgress, setJsVideoProgress] = useState<number>(12); // default demo 12/110 videos

  // Storage key for daily schedule checklist state
  const CHECKLIST_STORAGE_KEY = "roadmap_daily_schedule_checklist_v1";
  const JS_VIDEO_STORAGE_KEY = "roadmap_js_video_progress_v1";

  useEffect(() => {
    try {
      const savedChecklist = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (savedChecklist) {
        setCheckedSlots(JSON.parse(savedChecklist));
      }
      const savedVideos = localStorage.getItem(JS_VIDEO_STORAGE_KEY);
      if (savedVideos) {
        setJsVideoProgress(parseInt(savedVideos, 10));
      }
    } catch (e) {
      console.warn("Failed to load daily schedule checklist state:", e);
    }
  }, []);

  const saveChecklistState = (updated: Record<string, Record<string, boolean>>) => {
    setCheckedSlots(updated);
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleToggleSlot = (dateStr: string, slotId: string) => {
    const dateState = checkedSlots[dateStr] || {};
    const isCurrentlyChecked = Boolean(dateState[slotId]);
    const nextChecked = !isCurrentlyChecked;

    const updated = {
      ...checkedSlots,
      [dateStr]: {
        ...dateState,
        [slotId]: nextChecked,
      },
    };
    saveChecklistState(updated);

    // If checking a learning slot (Backend or Dropship), automatically log to DailyTaskLogger
    if (nextChecked) {
      const slot = DAILY_TIME_SLOTS.find((s) => s.id === slotId);
      if (slot && (slot.category === "backend" || slot.category === "dropship")) {
        const roadmapId = slot.roadmapId || "backend";
        const activeNodes = RoadmapService.getNodes(roadmapId);
        const updatedProgress = ProgressService.logDailyTask(
          progress,
          slot.title,
          slot.durationMinutes / 60,
          roadmapId,
          activeNodes
        );
        onProgressChange(updatedProgress);
      }
    }
  };

  const handleDownloadICS = () => {
    const content = generateICSCalendarContent();
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Schedule_Aug_Oct_2026.ics";
    a.click();
  };

  const handleIncrementVideo = () => {
    if (jsVideoProgress < 110) {
      const next = jsVideoProgress + 1;
      setJsVideoProgress(next);
      localStorage.setItem(JS_VIDEO_STORAGE_KEY, next.toString());
    }
  };

  // Sunday is the weekly rest day — Backend/Dropship slots pause to avoid
  // a 6-month grind with zero days off.
  const isRestDay = new Date(`${selectedDate}T00:00:00`).getDay() === 0;

  // Calculate day completion stats
  const dayCheckedMap = checkedSlots[selectedDate] || {};
  const totalSlots = DAILY_TIME_SLOTS.length;
  const completedSlots = DAILY_TIME_SLOTS.filter((s) => dayCheckedMap[s.id] || s.defaultChecked).length;
  const dayPercentage = Math.round((completedSlots / totalSlots) * 100);

  // Month navigation
  const activeMonth = selectedDate.substring(0, 7); // YYYY-MM

  return (
    <div className="space-y-8 fade-in">
      {/* 1. Header Banner & Google Calendar Export Controls */}
      <div className="border border-slate-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black p-6 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📅</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Daily Schedule Checklist
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                01/08/2026 — 31/01/2027
              </span>
            </div>
            <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">
              Lịch trình 6 tháng: Đi làm 08:30-17:30 (T2-T6), Tập thể dục 30p, Code đóng Gap-Item (1h) & Dropship (2h). Chủ Nhật là ngày nghỉ khỏi Backend/Dropship.
            </p>
          </div>

          {/* Sync & Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadICS}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-md transition-all"
              title="Tải file .ics để Import trực tiếp vào Google Calendar hoặc Apple Calendar"
            >
              <span>📥 Export .ics Calendar</span>
            </button>
          </div>
        </div>

        {/* Quick Month Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-gray-800/80 overflow-x-auto no-scrollbar">
          <span className="text-xs font-mono text-slate-500 dark:text-gray-500 uppercase font-bold mr-1">
            Tháng:
          </span>
          {[
            { id: "2026-08", label: "Tháng 8 (M1)", firstDate: "2026-08-01" },
            { id: "2026-09", label: "Tháng 9 (M2)", firstDate: "2026-09-01" },
            { id: "2026-10", label: "Tháng 10 (M3)", firstDate: "2026-10-01" },
            { id: "2026-11", label: "Tháng 11 (M4)", firstDate: "2026-11-01" },
            { id: "2026-12", label: "Tháng 12 (M5)", firstDate: "2026-12-01" },
            { id: "2027-01", label: "Tháng 1'27 (M6)", firstDate: "2027-01-01" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedDate(m.firstDate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border shadow-2xs ${
                activeMonth === m.id
                  ? "bg-cyan-600 dark:bg-cyan-950 text-white dark:text-cyan-300 border-cyan-600 dark:border-cyan-700"
                  : "bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-gray-400 border-slate-300 dark:border-gray-800 hover:bg-slate-200 dark:hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Date Navigation Bar & Daily Progress Gauge */}
      <div className="bg-white dark:bg-gray-900/90 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800/80 pb-4">
          {/* Date Selector Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const idx = allDates.indexOf(selectedDate);
                if (idx > 0) setSelectedDate(allDates[idx - 1]);
              }}
              disabled={selectedDate === startDate}
              className="p-2 rounded-xl bg-slate-900 dark:bg-gray-950 border border-slate-800 text-white dark:text-gray-300 hover:bg-slate-800 disabled:opacity-40 transition-colors font-bold text-xs shadow-2xs"
            >
              ◀ Ngày trước
            </button>

            <input
              type="date"
              min={startDate}
              max={endDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 dark:bg-gray-950 border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-mono text-slate-900 dark:text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 shadow-2xs"
            />

            <button
              onClick={() => {
                const idx = allDates.indexOf(selectedDate);
                if (idx < allDates.length - 1) setSelectedDate(allDates[idx + 1]);
              }}
              disabled={selectedDate === endDate}
              className="p-2 rounded-xl bg-slate-900 dark:bg-gray-950 border border-slate-800 text-white dark:text-gray-300 hover:bg-slate-800 disabled:opacity-40 transition-colors font-bold text-xs shadow-2xs"
            >
              Ngày sau ▶
            </button>
          </div>

          {/* Daily Progress Counter */}
          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <div className="text-xs text-slate-500 dark:text-gray-400 font-semibold">Tiến độ hoàn thành ngày:</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {completedSlots}/{totalSlots} Nhiệm vụ ({dayPercentage}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-gray-950 rounded-full overflow-hidden border border-slate-300 dark:border-gray-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-500"
            style={{ width: `${dayPercentage}%` }}
          />
        </div>
      </div>

      {/* 3. Secondary/Optional Tracker: 110 JavaScript Tips Video Series (weekend input, not the evening action slot) */}
      <div className="bg-purple-50 dark:bg-gradient-to-r dark:from-violet-950/60 dark:via-purple-950/40 dark:to-gray-900 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-5 shadow-sm dark:shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <h3 className="font-bold text-purple-950 dark:text-white text-base">
                Chuỗi 110 Video Tips JavaScript (Tài Liệu Phụ — Xem Cuối Tuần)
              </h3>
            </div>
            <p className="text-xs text-purple-900/80 dark:text-purple-300/80 font-medium">
              Không còn chiếm khung giờ 19:30-20:30 (khung đó giờ dành để code đóng Gap-Item). Xem video này vào cuối tuần/lúc rảnh. Đã xem {jsVideoProgress} / 110 video.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold font-mono text-purple-900 dark:text-purple-300">
              {jsVideoProgress} <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">/ 110</span>
            </div>
            <button
              onClick={handleIncrementVideo}
              disabled={jsVideoProgress >= 110}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              +1 Video Đã Xem
            </button>
          </div>
        </div>

        {/* Video Progress Bar */}
        <div className="w-full h-2 bg-purple-100 dark:bg-gray-950 rounded-full overflow-hidden border border-purple-200 dark:border-purple-950">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((jsVideoProgress / 110) * 100))}%` }}
          />
        </div>
      </div>

      {/* 4. Main Time-Block Schedule Checklist */}
      <div className="space-y-3">
        <h2 className="text-base font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>⏰</span> Khung Giờ Cố Định & Checklist Ngày {selectedDate}:
        </h2>

        {isRestDay && (
          <div className="rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 shadow-2xs font-medium">
            <span className="text-base">🌤️</span>
            <span>Chủ Nhật — ngày nghỉ khỏi Backend/Dropship. Chỉ giữ Tập thể dục & Đi làm/nghỉ như bình thường, không cần ép log 2 track kia hôm nay.</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {DAILY_TIME_SLOTS.map((slot) => {
            const isChecked = Boolean(dayCheckedMap[slot.id] || slot.defaultChecked);
            const isRestExempt = isRestDay && REST_DAY_EXEMPT_SLOT_IDS.includes(slot.id);
            const gCalLink = getGoogleCalendarLink(
              slot.title,
              slot.timeRange.split(" - ")[0],
              slot.timeRange.split(" - ")[1],
              slot.description
            );

            const categoryStyles: Record<string, string> = {
              fitness: "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-300",
              work: "border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 text-slate-900 dark:text-gray-300",
              backend: "border-cyan-300 dark:border-cyan-800/80 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-950 dark:text-cyan-300",
              dropship: "border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-300",
              rest: "border-slate-200 dark:border-gray-800/60 bg-slate-100 dark:bg-gray-950/40 text-slate-700 dark:text-gray-400",
            };

            return (
              <div
                key={slot.id}
                className={`border rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                  isRestExempt
                    ? "border-slate-200 dark:border-gray-800/40 bg-slate-100 dark:bg-gray-950/30 opacity-60"
                    : isChecked
                    ? "bg-emerald-100/70 dark:bg-gray-900/80 border-emerald-400 dark:border-emerald-700/60 opacity-95"
                    : categoryStyles[slot.category] || "border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isRestExempt}
                    onChange={() => handleToggleSlot(selectedDate, slot.id)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-gray-700 text-cyan-600 focus:ring-cyan-500 bg-white dark:bg-gray-950 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-gray-950 border border-slate-300 dark:border-gray-800 text-cyan-900 dark:text-cyan-400">
                        {slot.timeRange}
                      </span>
                      <h3
                        className={`text-sm sm:text-base ${
                          isChecked ? "line-through text-slate-500 dark:text-gray-500 font-medium" : "text-slate-900 dark:text-white font-bold"
                        }`}
                      >
                        {slot.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                      {slot.description}
                    </p>
                    {slot.matchedNodeTitle && (
                      <div className="text-[11px] font-mono text-cyan-800 dark:text-cyan-400 pt-0.5 font-bold">
                        🎯 Aligned Node: {slot.matchedNodeTitle}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Add to Google Calendar Link */}
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <a
                    href={gCalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-gray-950 hover:bg-slate-800 dark:hover:bg-gray-800 border border-slate-800 dark:border-gray-800 text-white dark:text-cyan-400 transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Thêm nhắc nhở khung giờ này vào Google Calendar"
                  >
                    <span>📅 Add Google Cal</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
