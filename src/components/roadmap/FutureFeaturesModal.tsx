interface FutureFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FutureFeaturesModal({
  isOpen,
  onClose,
}: FutureFeaturesModalProps) {
  if (!isOpen) return null;

  const plannedFeatures = [
    {
      number: "3",
      title: "Tài khoản & Đăng nhập (OAuth)",
      status: "Giai đoạn 2",
      badgeColor: "bg-blue-950 text-blue-300 border-blue-800",
      description: "Đăng nhập qua GitHub / Google OAuth để đồng bộ tiến độ học tập trên nhiều thiết bị và đám mây.",
      architecturalNotes: "Thiết kế bảng `users` và `user_progress` trong PostgreSQL hoặc Supabase Auth."
    },
    {
      number: "5",
      title: "Custom Roadmap Editor (Trình vẽ roadmap)",
      status: "Giai đoạn 2",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-800",
      description: "Công cụ canvas kéo-thả (sử dụng React Flow / Excalidraw) cho phép bạn tự vẽ sơ đồ học tập cá nhân hoặc cho team.",
      architecturalNotes: "Node data model dạng JSON graph (X/Y coordinates, node types, edges array)."
    },
    {
      number: "9",
      title: "AI Tutor & Automated Course Generation",
      status: "Giai đoạn 3",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-800",
      description: "Tích hợp Gemini / OpenAI API để hỏi đáp ngữ cảnh ngay tại từng node, tự động tạo bài quiz kiểm tra kiến thức.",
      architecturalNotes: "RAG pipeline gửi node context + user question -> Streaming response."
    },
    {
      number: "10 & 11",
      title: "Cộng đồng & Skill-Gap Analysis cho Teams",
      status: "Giai đoạn 3",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
      description: "Cho phép đóng góp roadmap mở (community open-source) và tạo bảng so sánh khoảng cách kỹ năng (skill-gap) cho team.",
      architecturalNotes: "Team workspace dashboard, skill matrix overlay."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              Lộ Trình Phát Triển Phần Mềm
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🚀 Ghi Chú Tính Năng Nâng Cao (Advanced Features)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Notice */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
          <strong>Lưu ý:</strong> Phiên bản hiện tại đã hoàn thiện 100% tính năng cốt lõi phục vụ **sử dụng cá nhân** (Interactive Diagram, Progress Persistence LocalStorage, Node Inspector, Learning Resources, Projects, Q&A). Các tính năng phức tạp bên dưới đã được quy hoạch kiến trúc cho các phiên bản tiếp theo.
        </div>

        {/* Feature List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {plannedFeatures.map((item) => (
            <div
              key={item.number}
              className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">#{item.number}</span>
                  {item.title}
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {item.description}
              </p>
              <div className="text-[11px] font-mono text-gray-400 bg-gray-900 p-2.5 rounded-lg border border-gray-800">
                <strong className="text-cyan-400">Gợi ý kiến trúc: </strong>
                {item.architecturalNotes}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
          >
            Đã hiểu, tiếp tục học tập
          </button>
        </div>
      </div>
    </div>
  );
}
