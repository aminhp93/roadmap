import React from "react";
import { View } from "../App";

interface MasterOverviewViewProps {
  onNavigate: (view: View) => void;
}

export function MasterOverviewView({ onNavigate }: MasterOverviewViewProps) {
  return (
    <div className="fade-in space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Hero Master Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl">📌</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                ROADMAP — Core & Dropship
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                Synced with ROADMAP.md
              </span>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl">
              File tham chiếu chung bức tranh tổng quan chính. Fullstack & Backend đã hợp nhất thành 1 track duy nhất: <strong className="text-cyan-700 font-bold">Core</strong>. Đang duy trì 2 trụ cột chính: <strong className="text-cyan-700 font-bold">Core (Kỹ thuật)</strong> & <strong className="text-amber-700 font-bold">Dropship (Kinh doanh)</strong>.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => onNavigate({ type: "roadmap", id: "core" })}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition-all shadow-sm flex items-center justify-between gap-3"
            >
              <span>⚡ Xem Roadmap Core</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onNavigate({ type: "roadmap", id: "dropshipping-plan" })}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs transition-all shadow-sm flex items-center justify-between gap-3"
            >
              <span>🛒 Xem Dropship 6M Plan</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onNavigate({ type: "calendar" })}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-all shadow-sm flex items-center justify-between gap-3"
            >
              <span>📅 Xem Daily Schedule</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Daily Usage Guide Box */}
        <div className="mt-6 pt-5 border-t border-slate-200 bg-white/80 p-4 rounded-xl space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-800">
            💡 Quy Tắc Thực Hiện Hàng Ngày:
          </div>
          <ol className="space-y-1.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-700 font-bold">1.</span>
              <span>Mở <strong>Daily Schedule</strong> → tích các khung giờ đã làm trong ngày.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-700 font-bold">2.</span>
              <span>Log việc thật vào Daily Task Logger, <strong>luôn gắn 1 Gap-Item ID cụ thể (P1–P11 hoặc ds-m1–m6)</strong> — đóng được Gap-Item mới tính là đạt chuẩn.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-700 font-bold">3.</span>
              <span>Cuối tuần: đối chiếu lại mục <strong>Standard / Self-Check</strong> bên dưới — nếu không trả lời được, chưa tính là "đạt", dù tốn bao nhiêu giờ.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* 2. Track 1: CORE — Backend/Fullstack Mastery */}
      <div className="border border-slate-200 rounded-2xl bg-white p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h2 className="text-xl font-bold text-slate-900">
                1. CORE — Backend/Fullstack Mastery (qua dự án Core)
              </h2>
            </div>
            <p className="text-xs text-cyan-700 font-mono font-semibold mt-1">
              Level hiện tại: Middle (early Senior) Backend / Junior Frontend / Junior-Middle DevOps / Middle Security
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
            Primary Tech Track
          </span>
        </div>

        {/* Goal Card */}
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 space-y-1">
          <div className="text-xs font-mono font-bold text-cyan-800 uppercase tracking-widest">
            🎯 Mục Tiêu Cốt Lõi:
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            Chuyển từ Frontend/Mid-Fullstack lên <strong className="text-cyan-900 font-bold">Senior/Lead Fullstack Engineer</strong>, đo bằng khả năng làm chủ kiến trúc dự án Core (đối chiếu Foresight), không đo bằng số giờ xem video.
          </p>
        </div>

        {/* Keywords Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
            📚 Nhóm Kiến Thức Trọng Tâm (Keywords)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Nhóm</th>
                  <th className="p-3">Trọng Tâm Kiến Thức</th>
                  <th className="p-3">Vị Trí Trong App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">Foundation</td>
                  <td className="p-3">Internet/HTTP, Linux CLI, Process/Memory</td>
                  <td className="p-3 text-slate-600">Roadmap Core → Topic 1-2</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">Databases</td>
                  <td className="p-3">Postgres (index, EXPLAIN ANALYZE, ACID), Redis caching</td>
                  <td className="p-3 text-slate-600">Roadmap Core → Topic 4</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">API & Security</td>
                  <td className="p-3">REST/GraphQL, JWT rotation, OWASP Top 10</td>
                  <td className="p-3 text-slate-600">Roadmap Core → Topic 5-6</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">DevOps</td>
                  <td className="p-3">Docker multi-stage, CI/CD, K8s (Senior+)</td>
                  <td className="p-3 text-slate-600">Roadmap Core → Topic 7</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">System Design</td>
                  <td className="p-3">Monolith→Microservices, Kafka/RabbitMQ, CAP</td>
                  <td className="p-3 text-slate-600">Roadmap Core → Topic 8</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">Node.js Career</td>
                  <td className="p-3">V8/Libuv, Cluster/Worker Threads, Next.js RSC</td>
                  <td className="p-3 text-slate-600">Lộ Trình Senior Fullstack</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-cyan-700">Core-Platform</td>
                  <td className="p-3">ADR, AuthN/AuthZ dùng chung, IDP CLI, Feature Flags</td>
                  <td className="p-3 text-slate-600">Lộ Trình Core-Platform</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Requirements & Gap Items P1-P11 */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
            ⚠️ Yêu Cầu & Danh Sách Gap Items (P1 – P11)
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-800">
            <p>
              Xem chi tiết tại <button onClick={() => onNavigate({ type: "level", id: 4 })} className="text-cyan-700 font-bold underline font-mono">gap-analysis.md (Level 4 Senior)</button>. Đây là danh sách công việc cụ thể cần làm để đóng Gap:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                • <strong className="text-cyan-700">P1–P3</strong>: Unit/Integration Testing, Redis Session Rotation
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                • <strong className="text-cyan-700">P4–P6</strong>: Pino Logging, Helmet Security Headers, DB Roles
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                • <strong className="text-cyan-700">P7–P9</strong>: Healthcheck Container, DB Migration Scripts
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                • <strong className="text-cyan-700">P10–P11</strong>: OpenTelemetry Tracing, CI/CD Pipeline
              </div>
            </div>
          </div>
        </div>

        {/* Projects Reference */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
            📂 Các Dự Án Thực Hành & Tham Chiếu
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 font-mono">📁 /Users/aminhp93/working/core</div>
              <p className="text-slate-600">Dự án chính để thực hành, clone đơn giản hóa từ Foresight.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-amber-800 font-mono">🏭 /Users/aminhp93/working/foresight</div>
              <p className="text-slate-600">Tham chiếu kiến trúc mature (đọc để hiểu, không copy nguyên).</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Track 2: DROPSHIP — 6-Month Plan */}
      <div className="border border-slate-200 rounded-2xl bg-white p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <h2 className="text-xl font-bold text-slate-900">
                2. DROPSHIP — 6-Month Plan (01/08/2026 → 31/01/2027)
              </h2>
            </div>
            <p className="text-xs text-amber-700 font-mono font-semibold mt-1">
              Mục tiêu dài hạn (06/2027): Tự vận hành 1 mình, lời 10tr/tháng.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            Business Track
          </span>
        </div>

        {/* Goal Card */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
          <div className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest">
            🎯 Mục Tiêu Cốt Lõi:
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong className="text-amber-900 font-bold">Net Profit ≥ $0 trước 31/01/2027 (không bị lỗ tài chính)</strong>. Tích lũy tư duy làm chủ và quy trình vận hành E-commerce A-Z.
          </p>
        </div>

        {/* Monthly Milestones Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
            📅 Kế Hoạch Chi Tiết Theo Tháng (Gap-Items ds-m1 → ds-m6)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Tháng</th>
                  <th className="p-3">Trọng Tâm Hành Động</th>
                  <th className="p-3">Gap-Item ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-700">T1 (08/2026)</td>
                  <td className="p-3">Niche research, Unit Economics 3x COGS, cap ads $300</td>
                  <td className="p-3 text-cyan-700 font-bold">ds-m1</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-700">T2 (09/2026)</td>
                  <td className="p-3">Store setup, CRO, load &lt; 2.0s, Stripe/PayPal, legal</td>
                  <td className="p-3 text-cyan-700 font-bold">ds-m2</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-700">T3 (10/2026)</td>
                  <td className="p-3">Creative testing, $5-10/ngày, Kill Adset $15</td>
                  <td className="p-3 text-cyan-700 font-bold">ds-m3</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-700">T4 (11/2026)</td>
                  <td className="p-3">Peak season, auto-fulfillment, scale 20%/ngày</td>
                  <td className="p-3 text-cyan-700 font-bold">ds-m4</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-700">T5 (12/2026)</td>
                  <td className="p-3">Retention, Klaviyo flows, P&L sheet</td>
                  <td className="p-3 text-cyan-700 font-bold">ds-m5</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-700">T6 (01/2027)</td>
                  <td className="p-3">Audit lợi nhuận, quyết định scale/dừng</td>
                  <td className="p-3 text-cyan-700 font-bold">ds-m6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Reference */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
            📂 Thư Mục Dự Án Dropship
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">01-market-research</div>
              <p className="text-slate-600 text-[11px] mt-1">Nghiên cứu thị trường & sản phẩm.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-amber-800">ngo-thanh-ecom</div>
              <p className="text-slate-600 text-[11px] mt-1">Lý thuyết E-commerce & Store setup.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-cyan-700">githubcoffee/reading</div>
              <p className="text-slate-600 text-[11px] mt-1">Tóm tắt & đổi tư duy Linh Thạch.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Daily Execution Rules */}
      <div className="border border-slate-200 rounded-2xl bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-2xl">⏰</span>
          <h2 className="text-xl font-bold text-slate-900">
            Tiến Độ — Daily Execution Rules
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="font-bold text-emerald-800">🗓️ Lịch Chạy T2–T7 (Chủ Nhật Nghỉ)</div>
            <p className="text-slate-700 text-[11px]">
              Chủ Nhật nghỉ khỏi Backend/Dropship để phòng tránh burnout.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 space-y-1">
            <div className="font-bold text-cyan-800">💻 Khung Tối 19:30–20:30 (Code Đóng Gap)</div>
            <p className="text-slate-700 text-[11px]">
              Code trực tiếp đóng 1 Gap-Item cụ thể, video course học cuối tuần.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Changelog / System Updates */}
      <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3 shadow-sm">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2">
          <span>📝</span> Cập Nhật Hệ Thống (Updated 2026-08-15):
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700 font-mono">
          <li className="flex items-start gap-2">
            <span className="text-cyan-600">•</span>
            <span>Hợp nhất Fullstack Developer + Core-Platform Architecture thành 1 track duy nhất: <strong>Core</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600">•</span>
            <span>Đã điều chỉnh lịch chạy: Nghỉ Chủ Nhật, kéo dài đến 31/01/2027 (khớp mục tiêu Dropship 6 tháng).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">•</span>
            <span>Đã thêm Gap-Item ID (P1–P11, ds-m1–m6) vào Daily Task Logger để theo dõi chính xác kết quả đầu ra.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
