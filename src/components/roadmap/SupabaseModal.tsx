import { useState, useEffect } from "react";
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured,
  getSupabaseClient,
} from "../../lib/supabase";

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete: () => void;
}

export function SupabaseModal({
  isOpen,
  onClose,
  onSyncComplete,
}: SupabaseModalProps) {
  const [urlInput, setUrlInput] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSavedSupabaseConfig();
      setUrlInput(config.url);
      setKeyInput(config.key);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMessage("Đang kiểm tra kết nối với Supabase Backend...");

    saveSupabaseConfig(urlInput, keyInput);
    const client = getSupabaseClient();

    if (!client) {
      setIsTesting(false);
      setStatusMessage("❌ Lỗi: URL hoặc Anon Key không hợp lệ.");
      return;
    }

    try {
      // Test querying user_node_progress
      const { error } = await client.from("user_node_progress").select("id").limit(1);

      if (error && error.code !== "PGRST116") {
        console.warn("Supabase test error:", error);
        setStatusMessage(
          `⚠️ Kết nối thành công tới Supabase, nhưng chưa tạo bảng database. Vui lòng chạy đoạn SQL bên dưới trong Supabase SQL Editor!`
        );
      } else {
        setStatusMessage("✅ Kết nối Supabase Backend thành công 100%! Đã lưu cấu hình.");
        onSyncComplete();
      }
    } catch (err: any) {
      setStatusMessage(`❌ Lỗi kết nối: ${err.message || "Không thể kết nối"}`);
    } finally {
      setIsTesting(false);
    }
  };

  const sqlSchemaSnippet = `-- Run this script in Supabase Dashboard -> SQL Editor:
CREATE TABLE IF NOT EXISTS public.user_node_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  node_id TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, node_id)
);

CREATE TABLE IF NOT EXISTS public.daily_task_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  roadmap_id TEXT NOT NULL,
  task_text TEXT NOT NULL,
  hours_spent NUMERIC,
  alignment_status TEXT NOT NULL,
  matched_node_id TEXT,
  matched_node_title TEXT,
  feedback_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_task_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all" ON public.user_node_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all" ON public.daily_task_logs FOR ALL USING (true) WITH CHECK (true);`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl space-y-4 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Supabase Backend Cloud Sync
              </h2>
              <p className="text-xs text-gray-400">
                Đồng bộ tiến độ học tập & daily task logs lên Supabase Cloud Database.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono leading-relaxed ${
              statusMessage.includes("✅")
                ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                : statusMessage.includes("⚠️")
                ? "bg-amber-950/60 border-amber-700 text-amber-300"
                : "bg-rose-950/60 border-rose-700 text-rose-300"
            }`}
          >
            {statusMessage}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono uppercase text-gray-400">
              Supabase Project URL:
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono uppercase text-gray-400">
              Supabase Anon Key:
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={isTesting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs transition-all disabled:opacity-50"
          >
            {isTesting ? "Đang kiểm tra kết nối..." : "💾 Lưu Cấu Hình & Thử Kết Nối Supabase"}
          </button>
        </form>

        {/* SQL Script Accordion */}
        <div className="flex-1 overflow-y-auto space-y-2 pt-2 border-t border-gray-800">
          <label className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            💡 Script Khởi Tạo Database Schema (Supabase SQL Editor):
          </label>
          <pre className="p-3 rounded-xl bg-black border border-gray-800 text-[10px] font-mono text-gray-300 overflow-x-auto">
            <code>{sqlSchemaSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
