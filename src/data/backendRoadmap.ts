import { RoadmapTopic } from "../types/roadmap";

export const BACKEND_ROADMAP: RoadmapTopic[] = [
  {
    id: "internet-basics",
    title: "1. Internet & Networking Fundamentals",
    category: "Foundation",
    icon: "🌐",
    description: "Cơ chế hoạt động của Internet, mạng máy tính, giao thức truyền tải và phân giải tên miền.",
    nodes: [
      {
        id: "internet-how-it-works",
        title: "How does the Internet Work?",
        subtitle: "IP Addresses, Packets & Routers",
        category: "Internet",
        recommended: true,
        essential: true,
        description: "Internet là một mạng lưới máy tính toàn cầu kết nối thông qua giao thức IP/TCP. Dữ liệu được chia nhỏ thành các gói (packets) và định tuyến qua các Routers.",
        keyTopics: [
          "IP Address (IPv4 vs IPv6)",
          "TCP/IP 4-Layer & OSI 7-Layer Model",
          "Packet Switching & Routing",
          "ISP & Backbone Networks"
        ],
        resources: [
          {
            title: "How Does the Internet Work? (MDN Web Docs)",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Understanding_the_web/How_the_Internet_works",
            type: "docs",
            free: true
          },
          {
            title: "How the Internet Works in 5 Minutes (Video)",
            url: "https://www.youtube.com/watch?v=7_LPdttKXPc",
            type: "video",
            free: true
          }
        ],
        guides: [
          {
            title: "Giao thức TCP vs UDP",
            summary: "TCP đảm bảo dữ liệu tới chính xác và đúng thứ tự (tin cậy). UDP ưu tiên tốc độ, chấp nhận mất gói (streaming, game online).",
            keyTakeaways: [
              "TCP: Handshake 3 bước (SYN, SYN-ACK, ACK), Flow control, Retransmission.",
              "UDP: Connectionless, không màng mất gói, Latency cực thấp."
            ]
          }
        ],
        projects: [
          {
            title: "Packet Tracer CLI / Ping Utility Simulation",
            difficulty: "Beginner",
            description: "Viết script nhỏ gửi ICMP Echo (ping) hoặc traceroute để đo RTT (Round-Trip Time) tới các địa chỉ IP khác nhau.",
            keyFeatures: ["Parse IP response", "Tính trung bình latency", "Phát hiện timeout"]
          }
        ],
        interviewQA: [
          {
            question: "Chuyện gì xảy ra khi bạn gõ google.com vào trình duyệt?",
            answer: "Trình duyệt kiểm tra cache -> Gọi DNS Resolver để lấy IP -> Mở kết nối TCP 3-way handshake -> TLS Negotiation (nếu HTTPS) -> Gửi HTTP Request -> Server xử lý và trả về HTTP Response -> Trình duyệt render HTML."
          }
        ],
        aiPrompts: [
          "Giải thích mô hình OSI 7 tầng cho người mới bắt đầu lập trình backend.",
          "So sánh ưu nhược điểm của IPv4 và IPv6 trong các hệ thống cloud hiện đại."
        ],
        connections: ["dns-resolution", "http-protocol"]
      },
      {
        id: "dns-resolution",
        title: "DNS Resolution Flow",
        subtitle: "Root Server, TLD, A/AAAA Records",
        category: "Internet",
        essential: true,
        description: "Hệ thống phân giải tên miền (DNS) biến tên miền thân thiện (ví dụ: google.com) thành địa chỉ IP máy chủ (ví dụ: 142.250.190.46).",
        keyTopics: [
          "DNS Lookup Hierarchy: Browser -> OS -> Recursive Resolver -> Root -> TLD -> Authoritative DNS",
          "DNS Record Types: A, AAAA, CNAME, MX, TXT, NS",
          "DNS Caching & TTL (Time To Live)"
        ],
        resources: [
          {
            title: "What is DNS? (Cloudflare Learning Center)",
            url: "https://www.cloudflare.com/learning/dns/what-is-dns/",
            type: "article",
            free: true
          }
        ],
        codeSnippet: {
          language: "bash",
          code: `# Truy vấn DNS A record và quá trình trace
dig +trace google.com

# Kiểm tra DNS record trực tiếp với nslookup
nslookup -type=A roadmap.sh`
        },
        connections: ["http-protocol"]
      },
      {
        id: "http-protocol",
        title: "HTTP / HTTPS & WebSockets",
        subtitle: "HTTP/1.1 vs HTTP/2 vs HTTP/3 & TLS",
        category: "Internet",
        essential: true,
        description: "HTTP là giao thức truyền dữ liệu web. HTTPS mã hóa dữ liệu với TLS. WebSockets cung cấp kênh giao tiếp 2 chiều thời gian thực.",
        keyTopics: [
          "HTTP Request/Response Structure, Headers, Status Codes (2xx, 3xx, 4xx, 5xx)",
          "HTTP/1.1 Keep-Alive vs HTTP/2 Multiplexing vs HTTP/3 QUIC (UDP)",
          "TLS/SSL Handshake & Asymmetric/Symmetric Encryption",
          "WebSockets vs Long Polling vs Server-Sent Events (SSE)"
        ],
        resources: [
          {
            title: "HTTP/2 vs HTTP/3 Explained",
            url: "https://web.dev/performance-http2/",
            type: "article",
            free: true
          }
        ],
        codeSnippet: {
          language: "javascript",
          code: `// Express.js Server-Sent Events (SSE) streaming endpoint
app.get('/api/live-feed', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ time: new Date().toISOString() })}\\n\\n\`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});`
        },
        connections: ["rest-api-design"]
      }
    ]
  },
  {
    id: "os-cli",
    title: "2. Operating System & Linux CLI",
    category: "Foundation",
    icon: "🐧",
    description: "Làm chủ môi trường Linux, quản lý tiến trình, bộ nhớ, I/O và shell script.",
    nodes: [
      {
        id: "linux-basics",
        title: "Linux Command Line & Bash",
        subtitle: "File Management, Permissions, Pipes & Grep",
        category: "OS",
        essential: true,
        description: "Các câu lệnh Linux căn bản là công cụ giao tiếp bắt buộc của Backend Developer khi làm việc trên Server & Container.",
        keyTopics: [
          "File permissions (chmod, chown, sudo)",
          "Text processing: grep, awk, sed, cut, sort, uniq",
          "Pipes (|) and Standard Streams (stdin 0, stdout 1, stderr 2)",
          "Environment Variables & System Services (systemd, journalctl)"
        ],
        codeSnippet: {
          language: "bash",
          code: `# Đếm 10 địa chỉ IP truy cập nhiều nhất từ file access.log
cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 10`
        },
        resources: [
          {
            title: "Linux Command Line Bash Tutorial",
            url: "https://ryanstutorials.net/linuxtutorial/",
            type: "article",
            free: true
          }
        ],
        connections: ["process-memory"]
      },
      {
        id: "process-memory",
        title: "Process, Threads & Memory Management",
        subtitle: "Virtual Memory, IPC, Stack vs Heap",
        category: "OS",
        description: "Hiểu cách Hệ điều hành điều phối CPU, tiến trình (Process), luồng (Thread), và vùng nhớ Heap/Stack giúp viết code tối ưu hiệu năng và tránh memory leak.",
        keyTopics: [
          "Process vs Thread vs Worker Threads",
          "CPU Scheduling & Context Switching overhead",
          "Memory Allocation: Stack (Static, fast) vs Heap (Dynamic, GC managed)",
          "Inter-Process Communication (IPC): Signals, Unix Sockets, Pipes"
        ],
        interviewQA: [
          {
            question: "Sự khác biệt cốt lõi giữa Process và Thread là gì?",
            answer: "Process có vùng nhớ (address space) độc lập, crash 1 process không ảnh hưởng process khác. Thread thuộc về 1 process và chia sẻ chung bộ nhớ Heap của process đó, tốc độ tạo và switch nhẹ hơn nhưng cần đồng bộ hóa (mutex/lock) để tránh Data Race."
          }
        ],
        connections: ["nodejs-async"]
      }
    ]
  },
  {
    id: "languages-runtimes",
    title: "3. Programming Languages & Runtimes",
    category: "Core Backend",
    icon: "💻",
    description: "Lựa chọn và làm chủ ngôn ngữ backend cốt lõi: Node.js (JavaScript/TypeScript), Python, hoặc Go.",
    nodes: [
      {
        id: "nodejs-async",
        title: "Node.js Core & Async I/O",
        subtitle: "V8 Engine, Libuv, Event Loop & Streams",
        category: "Node.js",
        recommended: true,
        essential: true,
        description: "Node.js chạy trên V8 engine với kiến trúc Single-threaded Event Loop dựa trên thư viện C++ Libuv để xử lý non-blocking I/O.",
        keyTopics: [
          "V8 Memory Model (Scavenger, Mark-Sweep Garbage Collector)",
          "Libuv Event Loop 6 Phases: Timers -> Pending -> Idle/Prepare -> Poll -> Check -> Close",
          "Microtasks (process.nextTick, Promise) vs Macrotasks (setTimeout, setImmediate)",
          "Stream Backpressure handling (highWaterMark, drain event)"
        ],
        codeSnippet: {
          language: "typescript",
          code: `import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

// Process large 5GB file without memory overflow
await pipeline(
  fs.createReadStream('./large-input.log'),
  new Transform({
    transform(chunk, encoding, callback) {
      const filtered = chunk.toString().replaceAll('DEBUG', 'INFO');
      this.push(filtered);
      callback();
    }
  }),
  fs.createWriteStream('./clean-output.log')
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
        projects: [
          {
            title: "Custom High-Performance Stream Compressor",
            difficulty: "Intermediate",
            description: "Xây dựng CLI tool đọc file log lớn nén thành Gzip theo chunk bằng Stream API.",
            keyFeatures: ["Memory usage < 50MB", "Hiển thị tiến độ progress bar", "Xử lý đứt gãy stream lỗi"]
          }
        ],
        connections: ["rest-api-design"]
      },
      {
        id: "python-fastapi",
        title: "Python & FastAPI Async Ecosystem",
        subtitle: "Asyncio, Pydantic & ASGI (Uvicorn)",
        category: "Python",
        recommended: true,
        description: "Python với framework hiện đại FastAPI tận dụng `async/await` và Pydantic cho hiệu năng cao và auto-generated Swagger documentation.",
        keyTopics: [
          "Python Asyncio Event Loop & Coroutines",
          "WSGI (Django/Flask) vs ASGI (FastAPI/Uvicorn)",
          "Type Hints & Pydantic Data Validation",
          "Dependency Injection System in FastAPI"
        ],
        codeSnippet: {
          language: "python",
          code: `from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI(title="User Service API")

class UserCreate(BaseModel):
    email: EmailStr
    username: str

@app.post("/users", status_code=201)
async def create_user(payload: UserCreate):
    # Auto-validated body via Pydantic
    return {"message": "User created", "email": payload.email}`
        },
        connections: ["rest-api-design"]
      }
    ]
  },
  {
    id: "databases",
    title: "4. Databases & Storage Engine",
    category: "Core Backend",
    icon: "🗄️",
    description: "Lưu trữ, truy vấn, tối ưu chỉ mục (Index) và đảm bảo tính toàn vẹn dữ liệu.",
    nodes: [
      {
        id: "relational-postgres",
        title: "Relational Databases & PostgreSQL",
        subtitle: "SQL, Schema Design, B-Tree Indexes & ACID",
        category: "Databases",
        essential: true,
        recommended: true,
        description: "Cơ sở dữ liệu quan hệ (RDBMS) như PostgreSQL cung cấp tính toàn vẹn dữ liệu tuyệt đối (ACID) và ngôn ngữ truy vấn SQL mạnh mẽ.",
        keyTopics: [
          "Relational Modeling: Normalization (1NF, 2NF, 3NF), Foreign Keys, Joins",
          "ACID Guarantees & Transaction Isolation Levels (Read Committed, Repeatable Read, Serializable)",
          "B-Tree Indexes, Composite Indexes, Partial Indexes, Hash Indexes",
          "Analyzing Slow Queries with EXPLAIN ANALYZE"
        ],
        codeSnippet: {
          language: "sql",
          code: `-- Create a composite index to accelerate order queries by user and date
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);

-- Analyze execution plan and verify index usage
EXPLAIN ANALYZE
SELECT id, total_amount, created_at 
FROM orders 
WHERE user_id = 42 AND created_at >= '2026-01-01'
ORDER BY created_at DESC;`
        },
        resources: [
          {
            title: "Use The Index, Luke! (SQL Indexing Guide)",
            url: "https://use-the-index-luke.com/",
            type: "article",
            free: true
          }
        ],
        interviewQA: [
          {
            question: "N+1 Query problem là gì và khắc phục như thế nào?",
            answer: "Xảy ra khi ORM thực hiện 1 query lấy danh sách N bản ghi, sau đó chạy thêm N query phụ để lấy thông tin liên quan. Khắc phục bằng JOIN trong SQL, hoặc dùng `include` / `preload` / Data Loader trong ORM."
          }
        ],
        connections: ["redis-caching"]
      },
      {
        id: "nosql-mongodb",
        title: "NoSQL Databases (MongoDB)",
        subtitle: "Document Store, Aggregation Pipeline & Sharding",
        category: "Databases",
        description: "MongoDB phù hợp với dữ liệu không đồng nhất, thay đổi schema linh hoạt hoặc đọc ghi dạng JSON Document.",
        keyTopics: [
          "Document Store vs Relational Table",
          "Embedding vs Referencing pattern in Schema Design",
          "Aggregation Pipeline ($match, $group, $lookup, $unwind)",
          "Replica Sets (High Availability) & Sharding (Horizontal Scaling)"
        ],
        connections: ["redis-caching"]
      },
      {
        id: "redis-caching",
        title: "Redis & In-Memory Storage",
        subtitle: "Data Structures, Cache Strategies & Pub/Sub",
        category: "Databases",
        essential: true,
        recommended: true,
        description: "Redis là In-memory Key-Value store siêu nhanh (<1ms), được dùng làm Cache, Session Store, Rate Limiter và Message Broker.",
        keyTopics: [
          "Data Types: Strings, Hashes, Lists, Sets, Sorted Sets (ZSET), Bitmaps",
          "Caching Patterns: Cache-Aside, Write-Through, Write-Behind, Read-Through",
          "Cache Invalidation & Eviction Policies (LRU, LFU, TTL)",
          "Distributed Locks (Redlock) & Rate Limiting (Sliding Window)"
        ],
        codeSnippet: {
          language: "typescript",
          code: `import Redis from 'ioredis';
const redis = new Redis();

// Cache-Aside Pattern Implementation
async function getProductDetail(id: string) {
  const cacheKey = \`product:\${id}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const product = await db.products.findById(id);
  if (product) {
    await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600); // 1 hour TTL
  }
  return product;}`
        },
        connections: ["jwt-auth"]
      }
    ]
  },
  {
    id: "api-design",
    title: "5. API Architecture & Protocols",
    category: "Architecture",
    icon: "🔌",
    description: "Xây dựng các giao diện lập trình ứng dụng (API) chuẩn hóa, dễ mở rộng và bảo mật.",
    nodes: [
      {
        id: "rest-api-design",
        title: "RESTful API Best Practices",
        subtitle: "HTTP Verbs, Resource Naming, Idempotency & Versioning",
        category: "APIs",
        essential: true,
        recommended: true,
        description: "REST là kiến trúc thiết kế API phổ biến nhất dựa trên HTTP resources, URIs và chuẩn trạng thái trả về.",
        keyTopics: [
          "Resource Naming conventions (plural nouns, clean URIs)",
          "HTTP Methods & Idempotency (GET/PUT/DELETE are idempotent, POST is not)",
          "Response Payload Standardization & Error Handling (RFC 7807)",
          "Pagination (Offset-based vs Cursor-based for deep pagination)",
          "OpenAPI / Swagger documentation specs"
        ],
        guides: [
          {
            title: "REST vs GraphQL vs gRPC",
            summary: "REST linh hoạt, tiêu chuẩn cho Web public. GraphQL tối ưu mobile tránh Over-fetching. gRPC dựa trên Protocol Buffers truyền dữ liệu cực nhanh cho Microservices.",
            keyTakeaways: [
              "REST: Text JSON, dễ debug, thích hợp public API.",
              "GraphQL: Single endpoint, client tự request đúng trường dữ liệu.",
              "gRPC: Binary Protobuf over HTTP/2, gõ kiểu tĩnh, latency siêu nhỏ."
            ]
          }
        ],
        connections: ["jwt-auth"]
      },
      {
        id: "graphql-grpc",
        title: "GraphQL & gRPC Microservices",
        subtitle: "Schemas, Resolvers & Protocol Buffers",
        category: "APIs",
        description: "Giải pháp thay thế REST cho các giao tiếp giữa microservices (gRPC) hoặc giao diện di động cần tùy biến dữ liệu (GraphQL).",
        keyTopics: [
          "GraphQL Schema Definition Language (SDL), Queries, Mutations, Subscriptions",
          "Solving GraphQL N+1 with DataLoader",
          "gRPC Protocol Buffers (.proto files) & Code Generation",
          "HTTP/2 Streaming in gRPC (Unary, Client Streaming, Server Streaming, Bi-directional)"
        ],
        connections: ["system-design-microservices"]
      }
    ]
  },
  {
    id: "security",
    title: "6. Security & Authentication",
    category: "Security",
    icon: "🔒",
    description: "Bảo mật hệ thống Backend chống lại các lỗ hổng OWASP, tấn công đánh cắp dữ liệu.",
    nodes: [
      {
        id: "jwt-auth",
        title: "Authentication & Authorization",
        subtitle: "JWT Rotation, OAuth 2.0, RBAC & ABAC",
        category: "Security",
        essential: true,
        recommended: true,
        description: "Xác thực (Ai là bạn?) và Phân quyền (Bạn được làm gì?) là hai trụ cột bảo mật hệ thống.",
        keyTopics: [
          "Session/Cookie Auth vs Stateless JWT Authentication",
          "JWT Security: Short-lived Access Token (15m) + HttpOnly Refresh Token Cookie (7d)",
          "Refresh Token Rotation & Revocation List in Redis",
          "OAuth 2.0 Authorization Code Flow with PKCE",
          "Role-Based Access Control (RBAC) & Attribute-Based Access Control (ABAC)"
        ],
        codeSnippet: {
          language: "typescript",
          code: `// Secure Refresh Token Cookie Header Setting
res.cookie('refreshToken', newRefreshToken, {
  httpOnly: true, // Prevent XSS theft
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'strict', // Protect against CSRF
  path: '/api/v1/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});`
        },
        connections: ["owasp-top-10"]
      },
      {
        id: "owasp-top-10",
        title: "OWASP Top 10 & API Security",
        subtitle: "SQLi, XSS, CSRF, Rate Limiting & Input Validation",
        category: "Security",
        essential: true,
        description: "Top 10 mối đe dọa bảo mật hàng đầu theo OWASP và các phương pháp phòng vệ thực tế.",
        keyTopics: [
          "SQL Injection Prevention (Parameterized Queries & Prepared Statements)",
          "Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
          "Cross-Site Request Forgery (CSRF) & SameSite cookies",
          "Broken Object Level Authorization (BOLA / IDOR)",
          "Rate Limiting & DDoS Defense (Helmet, Rate Limiter Middleware)"
        ],
        resources: [
          {
            title: "OWASP Top 10 Security Risks",
            url: "https://owasp.org/www-project-top-ten/",
            type: "docs",
            free: true
          }
        ],
        connections: ["docker-containers"]
      }
    ]
  },
  {
    id: "devops-cicd",
    title: "7. CI/CD & DevOps Essentials",
    category: "DevOps",
    icon: "🚀",
    description: "Đóng gói ứng dụng với Docker, tự động hóa quy trình kiểm thử và triển khai.",
    nodes: [
      {
        id: "docker-containers",
        title: "Docker & Containerization",
        subtitle: "Dockerfile Optimization, Multi-Stage Builds & Compose",
        category: "DevOps",
        essential: true,
        recommended: true,
        description: "Docker giúp đóng gói ứng dụng cùng môi trường thực thi (dependencies, OS packages) thành Container nhất quán.",
        keyTopics: [
          "Container vs Virtual Machine",
          "Dockerfile directives (FROM, RUN, COPY, CMD, ENTRYPOINT)",
          "Multi-stage builds để giảm kích thước Image (từ 1GB xuống 50MB Alpine/Distroless)",
          "Docker Compose cho môi trường phát triển local (App + DB + Redis + Nginx)"
        ],
        codeSnippet: {
          language: "dockerfile",
          code: `# Multi-stage Dockerfile for Node.js App
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
CMD ["node", "dist/index.js"]`
        },
        connections: ["github-actions"]
      },
      {
        id: "github-actions",
        title: "CI/CD Pipelines with GitHub Actions",
        subtitle: "Automated Testing, Linting & Blue-Green Deployments",
        category: "DevOps",
        essential: true,
        description: "Tự động hóa toàn bộ vòng đời phần mềm: Linting -> Run Unit/Integration Tests -> Build Docker Image -> Push Registry -> Deploy.",
        keyTopics: [
          "Workflows, Jobs, Steps & Actions",
          "Caching node_modules & Docker build layers",
          "Managing Secrets & Environment Variables safely",
          "Deployment Strategies: Rolling Update, Blue-Green, Canary"
        ],
        connections: ["system-design-microservices"]
      }
    ]
  },
  {
    id: "system-design",
    title: "8. System Design & Scalability",
    category: "Architecture",
    icon: "🏗️",
    description: "Thiết kế kiến trúc hệ thống quy mô lớn, chịu tải cao, có độ sẵn sàng cao (High Availability).",
    nodes: [
      {
        id: "system-design-microservices",
        title: "Monolith vs Microservices & Message Brokers",
        subtitle: "Apache Kafka, RabbitMQ & Event-Driven Architecture",
        category: "Architecture",
        essential: true,
        recommended: true,
        description: "Chuyển đổi từ Modular Monolith sang Microservices, sử dụng Message Queue để bất đồng bộ hóa và giảm phụ thuộc.",
        keyTopics: [
          "Monolith vs Microservices Trade-offs",
          "Message Brokers: RabbitMQ (AMQP) vs Apache Kafka (Log-based event stream)",
          "Event-Driven Architecture: Publish-Subscribe Pattern",
          "Database per Service & Distributed Transactions (Saga Pattern vs 2PC)"
        ],
        codeSnippet: {
          language: "typescript",
          code: `// Kafka Event Producer Example
import { Kafka } from 'kafkajs';
const kafka = new Kafka({ clientId: 'order-service', brokers: ['kafka:9092'] });
const producer = kafka.producer();

await producer.connect();
await producer.send({
  topic: 'order-created-events',
  messages: [
    { key: orderId, value: JSON.stringify({ orderId, userId, amount: 99.9 }) }
  ],
});`
        },
        resources: [
          {
            title: "System Design Primer (GitHub Repository)",
            url: "https://github.com/donnemartin/system-design-primer",
            type: "article",
            free: true
          }
        ],
        projects: [
          {
            title: "Distributed Rate Limiter & Message Queue System",
            difficulty: "Advanced",
            description: "Thiết kế API Gateway xử lý Rate Limiting bằng Redis Sliding Window và đẩy job xử lý nặng vào RabbitMQ.",
            keyFeatures: ["Xử lý 10,000 req/sec", "DLQ (Dead Letter Queue) cho job thất bại", "Dashboard theo dõi queue length"]
          }
        ],
        interviewQA: [
          {
            question: "Định lý CAP (CAP Theorem) phát biểu điều gì?",
            answer: "Trong một hệ thống phân tán khi xảy ra Partition Tolerance (P - đứt gãy mạng), bạn chỉ có thể chọn giữa Consistency (C - dữ liệu nhất quán ngay lập tức) HOẶC Availability (A - mọi request luôn trả về câu trả lời thành công dù dữ liệu có thể cũ)."
          }
        ]
      }
    ]
  }
];

// Helper to flatten all nodes for searching and statistics calculation
export function getAllBackendNodes() {
  return BACKEND_ROADMAP.flatMap((topic) => topic.nodes);
}
