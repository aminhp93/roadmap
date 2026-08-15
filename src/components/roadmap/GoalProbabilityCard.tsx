import { GoalProbabilityStats } from "../../types/roadmap";

interface GoalProbabilityCardProps {
  stats: GoalProbabilityStats;
  roadmapTitle: string;
}

export function GoalProbabilityCard({
  stats,
  roadmapTitle,
}: GoalProbabilityCardProps) {
  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-bold text-white text-base sm:text-lg">
              Đánh Giá Xác Suất Đạt Target (Goal Achievement Probability)
            </h3>
          </div>
          <p className="text-xs text-gray-400">
            Dự báo khả năng thành công dựa trên số Node cốt lõi đã học & mức độ đúng hướng của công việc hàng ngày.
          </p>
        </div>

        {/* Probability Score Pill */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${stats.statusColor} shadow-lg self-start sm:self-auto`}>
          <div className="text-right font-mono">
            <div className="text-2xl font-extrabold leading-none">
              {stats.probabilityPercentage}%
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Xác Suất: {stats.statusLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Meter Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden border border-gray-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 shadow-md ${
              stats.probabilityPercentage >= 80
                ? "bg-gradient-to-r from-emerald-500 to-teal-300"
                : stats.probabilityPercentage >= 60
                ? "bg-gradient-to-r from-cyan-500 to-blue-400"
                : stats.probabilityPercentage >= 35
                ? "bg-gradient-to-r from-amber-500 to-yellow-300"
                : "bg-gradient-to-r from-rose-600 to-orange-500"
            }`}
            style={{ width: `${stats.probabilityPercentage}%` }}
          />
        </div>
      </div>

      {/* Factors & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-800/80 text-xs font-mono">
        {/* Factors Breakdown */}
        <div className="space-y-1.5 bg-gray-950/60 p-3 rounded-xl border border-gray-800">
          <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">
            📊 Các Yếu Tố Phân Tích:
          </span>
          <div className="flex items-center justify-between text-gray-300">
            <span>• Node cốt lõi (Essential):</span>
            <span className="font-bold text-cyan-400">
              {stats.essentialCompletedCount}/{stats.totalEssentialCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span>• Số ngày làm việc Aligned:</span>
            <span className="font-bold text-emerald-400">
              +{stats.alignedLogsCount} ngày
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span>• Số ngày làm việc Off-Track:</span>
            <span className="font-bold text-rose-400">
              -{stats.offTrackLogsCount} ngày
            </span>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-1.5 bg-gray-950/60 p-3 rounded-xl border border-gray-800">
          <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1">
            💡 Khuyến Nghị Tăng Xác Suất:
          </span>
          <ul className="space-y-1 text-gray-300 leading-relaxed">
            {stats.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-yellow-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
