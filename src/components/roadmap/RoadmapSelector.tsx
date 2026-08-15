interface RoadmapSelectorProps {
  selectedRoadmapId: string;
  onSelectRoadmap: (id: string) => void;
}

export function RoadmapSelector({
  selectedRoadmapId,
  onSelectRoadmap,
}: RoadmapSelectorProps) {
  const options = [
    {
      id: "core",
      title: "1. Core (Backend/Fullstack)",
      icon: "⚡",
      category: "Career & Technical Mastery",
      desc: "roadmap.sh chuẩn quốc tế + V8/Libuv/Streams Senior track + Core-Platform Architecture — thực hành qua dự án Core.",
    },
    {
      id: "dropshipping-plan",
      title: "2. Dropshipping 6-Month Plan",
      icon: "🛒",
      category: "Business Execution",
      desc: "Kế hoạch 6 tháng kinh doanh E-commerce: Unit Economics 3x COGS, Cap $300, CRO, Net Profit >= $0",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedRoadmapId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectRoadmap(opt.id)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-gray-800/90 border-cyan-500 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/30 scale-[1.01]"
                  : "bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 hover:border-gray-700 opacity-80 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                    {opt.category}
                  </span>
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-1">
                  {opt.title}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                  {opt.desc}
                </p>
              </div>

              {isSelected && (
                <div className="mt-2 text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <span>✓ Active Roadmap</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
