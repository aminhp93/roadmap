import { RoadmapTopic } from "../types/roadmap";
import { BACKEND_ROADMAP } from "./backendRoadmap";

export const STRATEGIC_ROADMAPS_DATA: Record<string, { title: string; category: string; icon: string; goal: string; coreQuestionAnswer?: string; topics: RoadmapTopic[] }> = {
  "core": {
    title: "1. Core: Backend/Fullstack Mastery (qua dự án Core)",
    category: "Career & Technical Mastery",
    icon: "⚡",
    goal: "Chuyển mình từ Frontend/Mid-Fullstack sang Senior/Lead Fullstack Engineer bằng cách làm chủ bản chất Backend Node.js, DevOps, System Design — thực hành trực tiếp qua dự án Core (đối chiếu foresight).",
    topics: [
      ...BACKEND_ROADMAP,
      {
        id: "fullstack-phases",
        title: "Lộ Trình Bứt Phá Senior/Lead Fullstack (Node.js Core)",
        category: "Fullstack Mastery",
        icon: "🚀",
        description: "4 chặng phát triển chiều sâu kiến thức từ Node.js Runtime đến Cloud Native Architecture.",
        nodes: [
          {
            id: "fs-node-01",
            title: "01. Advanced Node.js Core & Async Foundations",
            subtitle: "V8 Engine, Libuv, Streams & Event Loop",
            category: "Phase 1 (Tháng 1-2)",
            recommended: true,
            essential: true,
            description: "Nắm vững bản chất Runtime của Node.js: V8 JIT compilation, Heap/Stack, Libuv 6-phase Event Loop, và Stream Backpressure.",
            keyTopics: [
              "V8 Engine: JIT Compiler (Ignition + TurboFan), Memory Heap (Young Scavenge, Old Mark-Sweep GC)",
              "Libuv 6 Event Loop Phases: Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check (setImmediate) -> Close",
              "Microtask Queue Priority: process.nextTick > Promise.then vs Macrotasks (setTimeout)",
              "Streams Backpressure: highWaterMark buffer limits, drain event, stream/promises pipeline API"
            ],
            codeSnippet: {
              language: "typescript",
              code: `import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

// Stream processing large GB log file without memory overflow
await pipeline(
  fs.createReadStream('./app.log'),
  new Transform({
    transform(chunk, encoding, callback) {
      const filtered = chunk.toString().split('\\n').filter(l => l.includes('ERROR')).join('\\n');
      this.push(filtered);
      callback();
    }
  }),
  fs.createWriteStream('./errors.log')
);`
            },
            resources: [
              {
                title: "Node.js Event Loop Architecture (Official Docs)",
                url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/",
                type: "docs",
                free: true
              }
            ],
            guides: [
              {
                title: "Memory Allocation & Backpressure",
                summary: "Memory Leak xảy ra khi các đối tượng lưu trữ lâu trong Heap mà GC không dọn được. Backpressure giúp Producer hoãn phát dữ liệu khi Consumer chưa kịp ghi.",
                keyTakeaways: [
                  "Dùng `v8.getHeapStatistics()` để đo Heap size.",
                  "Dùng Stream pipeline thay cho `fs.readFile` nạp toàn bộ file vào RAM."
                ]
              }
            ],
            projects: [
              {
                title: "Custom Stream Log Transformer",
                difficulty: "Intermediate",
                description: "Viết Transform stream lọc log GB không làm RAM vượt quá 50MB.",
                keyFeatures: ["Memory profiling với clinic.js", "Xử lý drain event", "Minh họa process.nextTick vs setImmediate"]
              }
            ],
            interviewQA: [
              {
                question: "So sánh thứ tự thực thi giữa process.nextTick và setImmediate?",
                answer: "process.nextTick nằm ở Microtask queue được ưu tiên chạy NGAY LẬP TỨC sau bước hiện tại trước khi Event Loop sang phase tiếp theo. setImmediate nằm ở Check phase của Libuv event loop."
              }
            ],
            connections: ["fs-node-02"]
          },
          {
            id: "fs-node-02",
            title: "02. Modern Web APIs, Database Architecture & Security",
            subtitle: "Express/Fastify, PostgreSQL Indexes, JWT Rotation",
            category: "Phase 2 (Tháng 3-4)",
            recommended: true,
            essential: true,
            description: "Thiết kế REST & GraphQL APIs chuẩn sản xuất, làm chủ SQL indexing & transaction isolation, bảo mật JWT với Refresh Rotation.",
            keyTopics: [
              "Express / Fastify Middleware Pipeline & Error Handling Standard (RFC 7807)",
              "PostgreSQL B-Tree vs GIN Indexing, EXPLAIN ANALYZE query tuning, N+1 Query Fixes",
              "Authentication: Access Token (15m) + HttpOnly Refresh Token Cookie (7d) + Redis Revocation List",
              "OWASP Top 10 Hardening: Helmet headers, CORS policies, Zod payload validation, Rate Limiting"
            ],
            codeSnippet: {
              language: "sql",
              code: `-- Optimize query with composite index & verify with EXPLAIN ANALYZE
CREATE INDEX idx_users_email_status ON users (email, status);
EXPLAIN ANALYZE SELECT id, name FROM users WHERE email = 'user@example.com' AND status = 'active';`
            },
            projects: [
              {
                title: "Production Auth & DB Optimizer",
                difficulty: "Intermediate",
                description: "Refactor Auth sang Refresh Token Rotation lưu trong Redis Blacklist và tối ưu query Postgres dưới 50ms cho 1M records.",
                keyFeatures: ["HttpOnly Cookie Rotation", "Zod validation middleware", "Composite Index Tuning"]
              }
            ],
            connections: ["fs-node-03"]
          },
          {
            id: "fs-node-03",
            title: "03. High Performance, Concurrency & Microservices",
            subtitle: "Cluster Module, Worker Threads & BullMQ Distributed Queues",
            category: "Phase 3 (Tháng 5-6)",
            recommended: true,
            essential: true,
            description: "Tận dụng tối đa CPU multi-core với Cluster IPC & Worker Threads, giao tiếp gRPC HTTP/2 và hàng đợi BullMQ.",
            keyTopics: [
              "Node.js Cluster Module (Master-Worker IPC, zero-downtime SIGUSR2 reloads)",
              "Worker Threads (worker_threads + SharedArrayBuffer for CPU-heavy tasks)",
              "NestJS Modular Architecture & gRPC over HTTP/2 with Protocol Buffers",
              "Distributed Background Queue with BullMQ, Redis & Dead Letter Queue (DLQ)"
            ],
            codeSnippet: {
              language: "typescript",
              code: `import { Worker, isMainThread, parentPort } from 'worker_threads';

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => console.log('CPU Heavy Result:', result));
} else {
  // Heavy CPU computation offloaded from Event Loop
  let count = 0;
  for (let i = 0; i < 1e9; i++) count += i;
  parentPort?.postMessage(count);
}`
            },
            connections: ["fs-node-04"]
          },
          {
            id: "fs-node-04",
            title: "04. Fullstack Mastery, System Design & Cloud Native",
            subtitle: "Next.js App Router, OpenTelemetry, Docker & Kubernetes",
            category: "Phase 4 (Tháng 7-8)",
            recommended: true,
            essential: true,
            description: "Kết hợp Next.js App Router (RSC, Server Actions) với Node.js Microservices, đo kiểm OpenTelemetry và triển khai Kubernetes.",
            keyTopics: [
              "Next.js App Router: React Server Components (RSC), Server Actions & SSR Caching",
              "Distributed Tracing: OpenTelemetry instrumentation, Jaeger trace collection across services",
              "Docker Multi-stage builds & Kubernetes Deployments (Pods, Services, Ingress)",
              "System Design High Traffic Load Testing: Up to 10,000 RPS handling with 99.99% SLA"
            ]
          }
        ]
      },
      {
        id: "platform-phases",
        title: "Lộ Trình Xây Dựng Core-Platform (dự án Core, đối chiếu Foresight)",
        category: "Enterprise Platform",
        icon: "🏗️",
        description: "4 giai đoạn kiến tạo nền tảng dùng chung giúp các đội phát triển tính năng bứt phá — áp dụng trực tiếp vào dự án Core. Business Value: (1) Tăng tốc độ ra mắt sản phẩm (Time-to-market 3x), (2) Giảm 30-40% chi phí hạ tầng Cloud, (3) Đảm bảo độ sẵn sàng 99.99% không gián đoạn doanh thu.",
        nodes: [
          {
            id: "pf-p1",
            title: "Phase 1: Core Architecture Baseline & Business Value",
            subtitle: "ADRs, Bounded Contexts & Business Friction Mapping",
            category: "Phase 1",
            essential: true,
            recommended: true,
            description: "Phân tích kiến trúc Core hiện tại (đối chiếu Foresight), ánh xạ nỗi đau kinh doanh thành giải pháp kỹ thuật, viết Architecture Decision Records (ADRs).",
            keyTopics: [
              "Modular Monolith vs Micro-frontends vs Shared Core Architecture patterns",
              "Domain-Driven Design (DDD) Bounded Contexts & Subdomains identification",
              "Architecture Decision Records (ADRs) establishing platform boundaries",
              "Mapping Business Friction Points (slow deploys, auth duplication) to Technical Solutions"
            ],
            connections: ["pf-p2"]
          },
          {
            id: "pf-p2",
            title: "Phase 2: Platform Core Infrastructure & Shared Modules",
            subtitle: "Centralized AuthN/AuthZ, Event Bus & Design System",
            category: "Phase 2",
            essential: true,
            recommended: true,
            description: "Xây dựng module Auth phân quyền dùng chung (OAuth2 + RBAC/ABAC), Event Bus bất đồng bộ và thư viện UI Design System.",
            keyTopics: [
              "Centralized AuthN/AuthZ: OAuth2 + Role-Based & Attribute-Based Access Control (RBAC/ABAC)",
              "Asynchronous Distributed Event Bus for decoupled inter-service messaging",
              "Shared UI Design System Component Library used across all frontend micro-apps",
              "Plug-and-play Integration SLA: Feature teams integrate Auth & Design System in < 30 minutes"
            ],
            connections: ["pf-p3"]
          },
          {
            id: "pf-p3",
            title: "Phase 3: Developer Experience (DX) & CI/CD Automation",
            subtitle: "Scaffolding CLI, Preview Environments & Contract Testing",
            category: "Phase 3",
            essential: true,
            recommended: true,
            description: "Xây dựng CLI tool tự động sinh code module chuẩn, tự động hóa môi trường Preview cho mỗi PR và kiểm thử giao ước Pact.",
            keyTopics: [
              "Self-service Internal Developer Platform (IDP) Scaffolding CLI (`core-cli create-module`)",
              "Automated CI/CD with Ephemeral Preview Environments per Pull Request",
              "API Contract Testing with Pact to prevent breaking API changes",
              "Developer Velocity SLA: Time-to-deploy a new service drops from days to < 15 minutes"
            ],
            connections: ["pf-p4"]
          },
          {
            id: "pf-p4",
            title: "Phase 4: Business Telemetry, Feature Flags & Enterprise Scale",
            subtitle: "Canary Deployments, OpenTelemetry & Multi-tenant Isolation",
            category: "Phase 4",
            essential: true,
            recommended: true,
            description: "Triển khai Feature Flags phát hành tính năng an toàn, đo kiểm OpenTelemetry theo tenant và tối ưu 30% chi phí Cloud.",
            keyTopics: [
              "Feature Flagging & Canary Releases (Unleash / LaunchDarkly for zero-risk rollouts)",
              "End-to-End OpenTelemetry Distributed Tracing & Custom Business Metric Dashboards",
              "Multi-tenant Data Isolation & Resource Usage Tracking to optimize cloud expenditure",
              "Enterprise Scale SLA: Maintain 99.99% SLA Uptime while reducing cloud hosting costs by 30%"
            ]
          }
        ]
      }
    ]
  },

  "dropshipping-plan": {
    title: "2. Dropshipping 6-Month Action Plan (Goal: Non-Loss / Profitability)",
    category: "E-Commerce & Business Execution",
    icon: "🛒",
    goal: "Tích lũy kinh nghiệm kinh doanh E-commerce thực tế trong 6 tháng. Chỉ số cốt lõi: Không bị lỗ tài chính (Break-even hoặc có lời trước 31/01/2027).",
    topics: [
      {
        id: "ds-months",
        title: "Lộ Trình Hành Động 6 Tháng Dropshipping (Mục Tiêu Không Lỗ)",
        category: "Business Execution",
        icon: "📈",
        description: "6 bước kiểm soát tài chính, sản phẩm, chạy quảng cáo và vận hành đơn hàng tự động.",
        nodes: [
          {
            id: "ds-m1",
            title: "Month 1: Niche Research, Supplier Vetting & Financial Rules",
            subtitle: "Aug 2026 — Quy tắc 3x COGS & Cap Ads $300",
            category: "Tháng 1 (Aug 2026)",
            essential: true,
            recommended: true,
            description: "Tính toán Unit Economics nghiêm ngặt, lựa chọn 2 Evergreen Niches (Problem-solving gadgets hoặc Pet accessories), cam kết ngân sách Ads tối đa $300 để không lỗ.",
            keyTopics: [
              "Unit Economics Rule: Selling Price >= 3x COGS (Price = COGS + Shipping + Platform Fee + Target CAC)",
              "Strict Ad Budget Cap: Max $300 total spend for initial testing phase to guarantee zero debt",
              "Supplier Vetting Criteria: CJ Dropshipping / Private Agents with < 7-10 day global shipping SLA",
              "Minimum 60% Gross Margin Worksheet & Breakeven ROAS calculation"
            ],
            guides: [
              {
                title: "Quy Tắc An Toàn Tài Chính Dropshipping",
                summary: "Không bao giờ chạy ad nếu Selling Price không gấp 3 lần giá nhập + ship. Ngân sách $300 thử nghiệm là giới hạn tối đa.",
                keyTakeaways: [
                  "Break-even ROAS = Selling Price / (Selling Price - COGS - Shipping - Platform Fee).",
                  "Loại bỏ các sản phẩm vận hành giao hàng trên 12 ngày."
                ]
              }
            ],
            projects: [
              {
                title: "Unit Economics & Supplier Audit Sheet",
                difficulty: "Beginner",
                description: "Xây dựng bảng tính Excel/Google Sheet phân tích giá bán, COGS, phí ship và Break-even ROAS cho 5 sản phẩm mẫu.",
                keyFeatures: ["Tính Gross Margin %", "Tự động tính Break-even ROAS", "Cảnh báo khi Margin < 60%"]
              }
            ],
            interviewQA: [
              {
                question: "Làm thế nào để đảm bảo không bị lỗ vốn khi làm Dropshipping?",
                answer: "Áp dụng 3 quy tắc: (1) Selling Price phải >= 3x COGS, (2) Đặt giới hạn cứng ngân sách Test Ads $300, (3) Áp dụng ngay Quy tắc Kill Adset $15 nếu tiêu không ra Add-to-Cart."
              }
            ],
            connections: ["ds-m2"]
          },
          {
            id: "ds-m2",
            title: "Month 2: High-Converting Store Setup & Trust Building",
            subtitle: "Sep 2026 — Shopify/Woo, Mobile CVR > 3.0%",
            category: "Tháng 2 (Sep 2026)",
            essential: true,
            recommended: true,
            description: "Xây dựng cửa hàng Shopify / WooCommerce chuẩn tối ưu chuyển đổi, tốc độ tải trang < 2.0s, tích hợp Stripe/PayPal và chính sách bảo vệ khách hàng.",
            keyTopics: [
              "Shopify / WooCommerce CRO Optimization: Mobile Page Load Time < 2.0s",
              "High-converting Product Landing Page: Problem-solution GIFs, Clear value props, Loox/Judge.me reviews",
              "Payment Gateways Setup: Stripe & PayPal integration with multi-currency support",
              "Trust Building: Legal policies (Refund, Privacy, TOS), SSL, Badges & Local Domain",
              "Target Metric: Mobile Conversion Rate (CVR) > 3.0%"
            ],
            codeSnippet: {
              language: "html",
              code: `<!-- High-Converting Urgency & Trust Badge Bar -->
<div className="trust-badge-bar">
  <span>✓ Free Global Shipping on Orders Over $50</span>
  <span>🔒 30-Day Money-Back Guarantee</span>
</div>`
            },
            connections: ["ds-m3"]
          },
          {
            id: "ds-m3",
            title: "Month 3: Creative Testing & Controlled Ad Campaigns",
            subtitle: "Oct 2026 — TikTok/Meta Ads & Rule Kill Adset $15",
            category: "Tháng 3 (Oct 2026)",
            essential: true,
            recommended: true,
            description: "Tạo 10 video ngắn tập trung vào 3s Hook đầu tiên. Chạy ngân sách nhỏ $5-$10/ngày. Áp dụng quy tắc Kill: Đã tiêu $15 không có Add-To-Cart / Sale -> TẮT NGAY.",
            keyTopics: [
              "Short-form Video Production: 10 Creatives with strong 3-second visual hooks",
              "Testing Campaign Setup: TikTok / Meta ABO/CBO ($5-$10/day per adset)",
              "Strict Kill Rule: If an adset spends $15 without Add-To-Cart / Sale -> KILL IT IMMEDIATELY",
              "Winning Product Identification: Target ROAS > 2.5x with positive net margin"
            ],
            connections: ["ds-m4"]
          },
          {
            id: "ds-m4",
            title: "Month 4: Q4 Peak Season Operations & Auto-Fulfillment",
            subtitle: "Nov 2026 — BFCM Promos & DSers Auto Order 24h",
            category: "Tháng 4 (Nov 2026)",
            essential: true,
            recommended: true,
            description: "Tự động hóa xử lý đơn hàng bằng DSers / CJ API. Đảm bảo 100% đơn hàng được gửi mã tracking trong 24h. Scale ngân sách 20%/ngày.",
            keyTopics: [
              "Automated Fulfillment: DSers / AutoDS / CJ API auto order processing",
              "Order Tracking Sequence: AfterShip automated email & SMS notifications within 24h",
              "BFCM Promotion Strategy: Bundle discounts (Buy 2 Get 10% Off), Gift offers",
              "Controlled Scaling: Scale winning adsets by 20% daily (never double abruptly)"
            ],
            connections: ["ds-m5"]
          },
          {
            id: "ds-m5",
            title: "Month 5: Retention, Email Automation & Margin Protection",
            subtitle: "Dec 2026 — Klaviyo Email Flows & Upsell Apps",
            category: "Tháng 5 (Dec 2026)",
            essential: true,
            recommended: true,
            description: "Triển khai Klaviyo email tự động (Welcome, Abandoned Cart, Upsell) tạo ra 15%+ doanh thu không tốn tiền ads. Theo dõi sát P&L sheet.",
            keyTopics: [
              "Klaviyo Automated Email Flows: Welcome Series, Abandoned Cart (3-step sequence), Post-purchase",
              "Post-purchase Upsell: ReConvert app boosting Average Order Value (AOV) by +20%",
              "Daily Net Profit P&L Spreadsheet: Net Profit = Total Rev - (COGS + Shipping + Ads + Platform Fees)",
              "Target Metric: Email flows generate 15%+ of total store revenue with $0 ad spend"
            ],
            connections: ["ds-m6"]
          },
          {
            id: "ds-m6",
            title: "Month 6: 6-Month Profitability Audit & Scale Decision",
            subtitle: "Jan 2027 — Kiểm toán lợi nhuận Net Profit >= $0",
            category: "Tháng 6 (Jan 2027)",
            essential: true,
            recommended: true,
            description: "Kiểm toán tài chính trọn gói 6 tháng: Net Profit = Revenue - (COGS + Ship + Ads + Fees). Đạt mục tiêu Net Profit >= $0 (Không bị lỗ tài chính).",
            keyTopics: [
              "Full 6-Month Financial P&L Audit: Calculate exact Net Profit after all expenses",
              "Verify Primary Metric: Net Profit >= $0 (Zero financial loss goal met)",
              "Strategic Scale Decision: Transition to Private Label Branding if profitable, or stop safely with zero debt"
            ]
          }
        ]
      }
    ]
  },

};
