# Job Connect — Full Project Documentation

**Live project: [Open Job Connect](http://jobconnect.austattendance.online)**

> **One-line summary:** Job Connect is a full-stack job portal & hiring platform connecting **Job Seekers**, **Recruiters / Companies**, and **Admins** — with job posting, applications, recruitment pipeline (tasks + interviews), paid post boosting, advertisements, payments, and complaint support.

- **Project directory:** `Job connect/` (relative to this documentation file)
- **Backend:** `backend/` — Laravel 13 REST API (PHP 8.4, Sanctum, SQLite) — Dockerfile (`php:8.4-cli-bookworm`) + `docker-entrypoint.sh`
- **Frontend:** `frontend/` — React 19 + Vite 8 SPA (React Router 7, Tailwind CSS 4, Axios, Framer Motion) — multi-stage Dockerfile → nginx
- **Orchestration:** `docker-compose.yml` (backend :8001 on VPS / :8000 local, frontend :5173) + `DOCKER.md` / `VPS.md`, `.github/workflows/ci.yml` + `deploy.yml`, `scripts/setup-vps.sh` + `deploy-vps.sh`
- **Live URLs:**
  - **Local (dev):** Frontend `http://localhost:5173` → Backend `http://127.0.0.1:8000` (`/api/*`)
  - **Local (Docker):** Frontend `http://localhost:5173` → Backend `http://localhost:8000`
  - **VPS (production, s20210104034@187.52.122.100):** Frontend `http://187.52.122.100:5173` → Backend `http://187.52.122.100:8001/api/test` (8001 because 8000 is busy by another student `s20210204007`)
- **VPS Access:** `ssh -i ~/.ssh/s20210104034 s20210104034@187.52.122.100` (ED25519 `SHA256:0TKTEsVWCl+Tk8G4HkvOdqHNuVzaigN7OwAfMX1leOI`), path `~/jobconnect`, `sudo docker` required (user not in `docker` group)
- **Docs:** This file is canonical. `DOCKER.md` = Docker quick-ref, `VPS.md` = VPS deploy + keys.

> Updated 2026-10-01 — Documented persistent saved jobs, notifications, and categories; resume and task-submission uploads; new settings/health endpoints; admin advertisement/pricing routes; and backend authorization changes. Removed the deployed `APP_KEY` value from this document. Keep real keys in untracked environment files and rotate any key that has been shared publicly.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Problem It Solves & Target Users](#2-problem-it-solves--target-users)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Repository Structure](#5-repository-structure)
6. [Backend Deep Dive (Laravel API)](#6-backend-deep-dive-laravel-api)
7. [Frontend Deep Dive (React SPA)](#7-frontend-deep-dive-react-spa)
8. [Authentication & Authorization Flow](#8-authentication--authorization-flow)
9. [Features by Role](#9-features-by-role)
10. [Monetization: Boost, Ads, Payments](#10-monetization-boost-ads-payments)
11. [Complaint / Contact Support System](#11-complaint--contact-support-system)
12. [Data Models & Database](#12-data-models--database)
13. [API Reference](#13-api-reference)
14. [Frontend Routes Reference](#14-frontend-routes-reference)
15. [Configuration & Environment](#15-configuration--environment)
16. [Requirements & Prerequisites](#16-requirements--prerequisites)
17. [How to Run — Docker (Local)](#17-how-to-run--docker-local)
18. [How to Run — VPS (Production)](#18-how-to-run--vps-production)
19. [How to Run — Local (Without Docker)](#19-how-to-run--local-without-docker)
20. [Testing the Setup](#20-testing-the-setup)
21. [Design System (UI)](#21-design-system-ui)
22. [VPS Deployment Verification (2026-09-23 Live)](#22-vps-deployment-verification-2026-09-23-live)
23. [Limitations & Future Improvements](#23-limitations--future-improvements)
24. [Glossary](#24-glossary)

---

## 1. What Is This Project?

**JobConnect | Executive Tech Careers & Hiring Platform** is a classic three-sided job marketplace:

- **Seekers** create a CV profile, browse/search jobs, save bookmarks, apply with cover letter + resume, track application stages, complete recruiter-assigned tasks, and attend scheduled interviews.
- **Recruiters / Companies** create a rich company profile, post jobs/internships, manage applicants through a pipeline (shortlist → task → interview → hire/reject), assign tasks, schedule interviews, pay to **boost** posts for visibility, and run **advertisement campaigns**.
- **Admins** moderate everything: dashboard stats, user CRUD, job moderation, featured/boosted posts, boost/ad pricing, advertisements, payments, categories, analytics, and a complaint inbox with reply workflow.

The backend is a pure JSON API (no server-rendered pages except the default Laravel welcome view). The frontend is a decoupled SPA that talks to it via Axios with Sanctum Bearer tokens, with a `localStorage` optimistic fallback so the UI still works if the API is briefly unreachable. The whole stack ships as two Docker images with `docker compose up`, and is now **live on VPS `187.52.122.100`** via CI/CD.

---

## 2. Problem It Solves & Target Users

| User | Pain | How Job Connect Helps |
|------|------|-----------------------|
| **Job Seeker** | Scattered job posts, no application tracking, opaque hiring steps | One dashboard: profile/CV, saved jobs, application status, tasks to submit, interviews to confirm, notifications |
| **Recruiter / Company** | Manual applicant screening via email/spreadsheets, low visibility for urgent hires | Post in minutes, pipeline view, assign take-home tasks, schedule interviews, pay to boost high-priority posts, buy site ads |
| **Platform Admin** | Spam jobs, fake users, pricing changes, user complaints | Moderate jobs/users, set boost prices, view all payments, resolve complaints with history + priority |

**Typical end-to-end story:**

1. Company registers → completes company profile → posts `Senior React Developer`.
2. Seeker registers → completes CV → searches `React in Dhaka` → saves + applies with resume.
3. Recruiter sees applicant in `Applicants / Pipeline` → moves to `Shortlisted` → assigns coding task with deadline → schedules Google-Meet interview.
4. Seeker submits task URL, confirms interview → Recruiter hires.
5. Recruiter boosts the next urgent post for 7 days via payment modal; Admin later reviews revenue in `Admin → Payments`.

---

## 3. High-Level Architecture

### 3.1 Logical (dev / Docker / VPS — same code, different ports)

```
┌────────────────────┐      Axios + Bearer token      ┌─────────────────────┐
│  React 19 SPA      │  ───────────────────────────►  │  Laravel 13 API     │
│  Vite :5173 (dev)  │                                │  php artisan :8000  │
│  nginx :80 → :5173 │                                │                     │
│  AuthContext       │        JSON (/api/*)            │  Sanctum auth       │
│  PlatformContext   │                                │  Eloquent models    │
│  React Router      │                                │  SQLite database    │
└────────────────────┘                                └─────────────────────┘
        │ localStorage fallback (jobconnect_*)            │ database/database.sqlite
        │ seed complaints, savedJobIds, session           │ login_histories, settings
```

- **Decoupled:** Frontend and backend run as two processes/containers. CORS now **env-driven** (`CORS_ALLOWED_ORIGINS` + `FRONTEND_URL` merged with localhost defaults). Vite `baseURL = VITE_BACKEND_URL` baked at build time.
- **State:** `AuthContext` = auth session; `PlatformContext` = central store for listings, applications, tasks, interviews, ads, payments, notifications, complaints, categories, and pricing. Core platform data is backend-backed; selected UI state retains a local-storage offline fallback.

### 3.2 Docker Physical (local)

```
Host :5173 ──► frontend (nginx:1.27-alpine, /usr/share/nginx/html, SPA try_files) ──┐
Host :8000 ──► backend  (php:8.4-cli, artisan serve 0.0.0.0:8000, entrypoint)       │  Browser VITE_BACKEND_URL=http://localhost:8000
Volumes: sqlite-data:/var/www/database  uploads-data:/var/www/storage/app ─────────┘
```

### 3.3 VPS Physical (s20210104034@187.52.122.100)

```
Host 187.52.122.100:5173 ──► frontend (nginx:1.27-alpine) ──┐
Host 187.52.122.100:8001 ──► backend  (php:8.4-cli, 0.0.0.0:8000→8001) │  Browser VITE_BACKEND_URL=http://187.52.122.100:8001
Volumes: jobconnect_sqlite-data:/var/www/database (recreated after fix)                │
Host Nginx /etc/nginx/sites-available/cse3100.conf still proxies cse3100.aliahnaf.fun → 127.0.0.1:3000 (other student) — JobConnect uses Docker ports directly.
UFW active: 22/80/443/Nginx Full allow; 5173/8001 work via Docker iptables bypass (8000 busy by s20210204007 artisan serve)
```

---

## 4. Tech Stack

### Backend — `Job connect/backend`

| Layer | Choice | Version / Notes |
|-------|--------|-----------------|
| Language | PHP | `^8.4` (was `^8.3`, updated because `symfony/* v8.1` + `laravel/framework v13.26.1` require `>=8.4.1`; local fixed via `winget install PHP.PHP.8.4` → `8.4.25`) |
| Framework | Laravel | `^13.17` |
| Auth | Laravel Sanctum | `*` — personal access tokens |
| Database | SQLite (default) | file `database/database.sqlite`, `DB_CONNECTION=sqlite`, `DB_DATABASE=/var/www/database/database.sqlite` (compose default fixed from empty `""` which caused `SQLSTATE[HY000][14] Database: ,`) |
| Session/Cache/Queue | Database driver | `SESSION_DRIVER=database`, `CACHE_STORE=database`, `QUEUE_CONNECTION=database` |
| Dev tools | Pest, Faker, Pint, Pail, Collision | `pestphp/pest ^5.1` |
| Mail/Broadcast | Log driver | `MAIL_MAILER=log`, `BROADCAST_CONNECTION=log` |
| Filesystem | Local | `FILESYSTEM_DISK=local` (volume `uploads-data`) |
| CORS | `backend/config/cors.php` | Now `array_filter(array_merge(localhost defaults, explode(',', env('CORS_ALLOWED_ORIGINS')), env('FRONTEND_URL')?[FRONTEND_URL]:[]))`, `supports_credentials:true` |
| Container | `backend/Dockerfile` | `php:8.4-cli-bookworm` + `pdo_sqlite, bcmath, intl, zip, pcntl`, Composer 2, `ENTRYPOINT docker-entrypoint.sh` |
| Entrypoint | `backend/docker-entrypoint.sh` | Ensures `.env`, `database.sqlite`, `APP_KEY` (`grep ^APP_KEY=base64:` else `artisan key:generate`), `storage:link`, `migrate --force`, `config:clear`, then `exec artisan serve` |

### Frontend — `Job connect/frontend`

| Layer | Choice | Version / Notes |
|-------|--------|-----------------|
| Library | React + React DOM | `^19.2.7` |
| Build | Vite | `^8.1.1` + `@vitejs/plugin-react ^6.0.3` |
| Routing | React Router DOM | `^7.18.1` (`BrowserRouter`) |
| Styling | Tailwind CSS | `^4.3.3` + `@tailwindcss/postcss` |
| HTTP | Axios | `^1.20.0`, `baseURL=VITE_BACKEND_URL`, `withCredentials:true` |
| Animation | Framer Motion | `^12.42.2` |
| Icons | Lucide React | `^1.26.0` |
| Env | Vite env | `VITE_BACKEND_URL` local `http://127.0.0.1:8000` (`frontend/.env`), Docker/VPS `VITE_BACKEND_URL` build-arg default `http://localhost:8000`, VPS `http://187.52.122.100:8001` baked via `docker-compose.yml` `args` |
| Container | `frontend/Dockerfile` | `node:20-alpine` build (`npm ci` → `npm run build`) → `nginx:1.27-alpine` serve `dist/` with `nginx.conf` SPA fallback |

> Note: The frontend folder also contains leftover Next.js scaffolding (`next.config.mjs`, `.next/`, `app/`) — **the active code is Vite `src/`**; they are `.dockerignore`-excluded.

### Tooling / Orchestration

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Two services: `backend` (`${BACKEND_PORT:-8000}:8000`, `env_file: [.env (required:false), .env.vps (required:false)]`, `environment:` with `${VAR:-default}` including `DB_DATABASE=/var/www/database/database.sqlite`, `healthcheck: curl -sf /api/test`) + `frontend` (`${FRONTEND_PORT:-5173}:80`, `VITE_BACKEND_URL` arg). On VPS `BACKEND_PORT=8001` because `8000` busy. |
| `.env.vps.example` | VPS template for `VITE_BACKEND_URL`, `APP_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `APP_KEY`, `DB_*`, and host ports, plus GitHub Actions secret setup. The deployed `.env` is private and must not be copied into documentation or source control. |
| `.env.docker.example` | Kept for local Docker quick start |
| `VPS.md` | VPS deploy guide: what was set, how to provide keys, `setup-vps.sh`, manual vs GitHub Actions deploy, domain/Cloudflare, troubleshooting |
| `.github/workflows/ci.yml` | CI matrix `18.x/20.x` + PHP 8.4 (`shivammathur/setup-php`), `node cache`, `lint` + `build` + `composer install` + `migrate` + `test`, trigger `push/PR/workflow_call` |
| `.github/workflows/deploy.yml` | CD `needs: ci` on `main` → `webfactory/ssh-agent` + `appleboy/scp-action` + `appleboy/ssh-action` `docker compose up --build -d` + health loop + `nginx -t` |
| `scripts/setup-vps.sh` | VPS bootstrap: `apt install docker.io docker-compose-plugin nginx`, `ufw allow 22/80/443`, Nginx `cse3100.conf` template |
| `scripts/deploy-vps.sh` | Manual `tar --exclude .git/node_modules/vendor | ssh tar -xzf -C ~/jobconnect` + `docker compose up --build -d` helper |
| `.gitignore` (root) | Ignores `.env`, `.env.vps`, `*.key/*.pem`, `database.sqlite`, `node_modules/dist` (keeps `*.example`) |
| `run.py` / `run.bat` / `start-*.bat` | Local launchers (Herd-lite/XAMPP/Laragon fallbacks) — now auto-finds `php 8.4` via `PATH` |

---

## 5. Repository Structure

```
14523_/
├── run.py                      # full-stack launcher (now finds PHP 8.4 via winget)
├── run.bat                     # calls run.py
├── PROJECT_DOCUMENTATION.md    # this file (canonical)
└── Job connect/
    ├── .gitignore              # root ignores .env, keys, sqlite, node_modules
    ├── docker-compose.yml      # env_file optional, DB_DATABASE fixed, 8001 on VPS
    ├── .env.vps.example        # VPS prod template (copy to .env on VPS)
    ├── .env.docker.example     # local Docker template
    ├── DOCKER.md               # Docker guide
    ├── VPS.md                  # VPS guide (keys, setup, deploy, domain, troubleshooting)
    ├── .github/workflows/
    │   ├── ci.yml              # Node matrix + PHP 8.4 CI
    │   └── deploy.yml          # SCP + SSH CD to VPS
    ├── scripts/
    │   ├── setup-vps.sh        # bootstrap VPS
    │   └── deploy-vps.sh       # manual tar+ssh deploy
    ├── backend/                # Laravel 13 API
    │   ├── Dockerfile          # php:8.4-cli-bookworm (was 8.3)
    │   ├── docker-entrypoint.sh# .env/sqlite/APP_KEY/migrate/serve
    │   ├── .dockerignore / .env / .env.example / composer.json / artisan
    │   ├── app/
    │   │   ├── Models/         # User, JobListing, JobApplication, UserProfile,
    │   │   │                   # RecruitmentTask, ScheduledInterview, Advertisement,
    │   │   │                   # PaymentRecord, Complaint, Setting, LoginHistory, Item
    │   │   └── Http/
    │   │       ├── Controllers/Api/  # Auth, Job, Application, Profile,
    │   │       │                     # TaskInterview, Setting, Complaint, Item
    │   │       │               └── Admin/ # Dashboard, User
    │   │       └── Middleware/EnsureAdmin.php
    │   ├── bootstrap/app.php   # admin alias + JSON for api/*
    │   ├── config/             # cors.php now env-driven
    │   ├── database/
    │   │   ├── migrations/     # 19 files (see §12)
    │   │   └── database.sqlite # volume-persisted at /var/www/database/database.sqlite
    │   ├── routes/api.php
    │   └── storage/app/public/ # volume uploads-data
    └── frontend/               # React 19 + Vite SPA
        ├── Dockerfile          # node:20 → nginx
        ├── nginx.conf          # SPA fallback
        ├── vite.config.js / tailwind.config.js
        └── src/
            ├── main.jsx        # AuthProvider > PlatformProvider > App
            ├── App.jsx         # routes + /workflow (CI/CD visualizer)
            ├── layouts/        # PublicLayout (now has Workflow nav), AuthLayout, SeekerLayout, RecruiterLayout, AdminLayout
            ├── middlewares/    # RoleMiddleware, GuestMiddleware
            ├── context/        # AuthContext, PlatformContext
            ├── lib/api/        # axios + auth, jobs, applications, recruitment, profile, complaints, dashboard, users, settings
            ├── components/     # ApplyModal, BoostModal, PaymentModal, CandidateModal, etc.
            ├── pages/
            │   ├── public/     # Home, Jobs, JobDetail, About, Contact, Workflow (detailed, realtime, 12 sections, traveling light), AccessDenied
            │   ├── auth/       # Login, Register, AdminLogin
            │   ├── seeker/     # SeekerDashboard, ProfileCV, MyApplications, AssignedTasks, ScheduledInterviews, SavedOpportunities, SeekerNotifications
            │   ├── recruiter/  # RecruiterDashboard, CompanyProfile, MyJobPosts, PostJob, ManageApplicants, RecruiterPipeline, TaskManagement, InterviewManagement, BoostedPosts, RecruiterPayments
            │   └── admin/      # AdminDashboard, ComplainBox, UserManagement, JobModeration, CategoryManagement, FeaturedBoostedPosts, BoostPricing, AdPricing, AdminAdvertisements, AdminPayments, AdminSettings
            └── data/mockData.js
```

---

## 6. Backend Deep Dive (Laravel API)

### 6.1 Entry & Middleware

- `backend/bootstrap/app.php:17` registers alias `'admin' => EnsureAdmin::class`. All `api/*` forced to JSON.
- `backend/docker-entrypoint.sh:1` ensures `.env`, `database/database.sqlite`, `APP_KEY` generation, `storage:link`, `migrate --force`, `config:clear`, then `php artisan serve --host=0.0.0.0 --port=8000`.

### 6.2 Controllers (`backend/app/Http/Controllers/`)

| Controller | File | Responsibilities |
|------------|------|------------------|
| Auth | `Api/AuthController.php` | `register`, `login`, `logout`, `me`, `updateCredentials` |
| Jobs | `Api/JobController.php` | `index`, `show`, `store`, `update`, `boost`, `cancelBoost`, `destroy` |
| Applications | `Api/ApplicationController.php` | `index`, `store`, `show`, `updateStatus` |
| Profile | `Api/ProfileController.php` | `show`, `update`, `uploadImage`, `uploadResume` |
| Tasks/Interviews/Ads | `Api/TaskInterviewController.php` | tasks CRUD, interviews CRUD, ads list/create, payments list |
| Settings | `Api/SettingController.php` | `getBoostPricing`, `updateBoostPricing` |
| Platform | `Api/PlatformController.php` | categories, saved jobs, notifications |
| Health | `Api/HealthController.php` | API health status |
| Complaints | `Api/ComplaintController.php` | `store`, `index`, `show`, `reply`, `updateStatus` |
| Admin Dashboard | `Api/Admin/DashboardController.php` | `index` stats |
| Admin Users | `Api/Admin/UserController.php` | `apiResource` |

### 6.3 Key Backend Logic

- **Auth:** normalizes roles, `Hash::make`, `status=active`, Sanctum token, `login_histories`, `updateCredentials` needs `current_password`.
- **Jobs:** public `index/show`, authed scoped CRUD, `boost` sets `featured`, `boosted_days`, `boost_expiry`.
- **Applications:** `store` with `candidate_name/email/phone`, `resume_url`, `cover_letter`, pipeline `applied → hired/rejected`.
- **Profile:** single `user_profiles` row for seeker CV + company profile (~60 columns); resume files are stored separately and referenced by `resume_path`.
- **Tasks/Interviews:** linked via `application_id + recruiter_id + seeker_id`; task submissions can include a stored file, notes, and instructions, and interviews record the candidate response.
- **Ads/Payments:** `advertisements` + `payment_records`; payment mode is explicitly exposed as demo with `real_money=false`.
- **Settings:** `settings` key-value (`boost_pricing`, `ad_pricing`).
- **Complaints:** `history[]`, `admin_feedback`, `priority`.

---

## 7. Frontend Deep Dive (React SPA)

### 7.1 Entry

- `frontend/src/main.jsx:1` → `AuthProvider > PlatformProvider > App` (`BrowserRouter`, fallback `Navigate /`).

### 7.2 Layouts

| Layout | Used For |
|--------|----------|
| `PublicLayout.jsx` | `/`, `/jobs`, `/about`, `/contact`, `/workflow` (now has `Workflow` nav with `LIVE` badge + `GitBranch` icon) |
| `AuthLayout.jsx` | `/login`, `/register` |
| `SeekerLayout.jsx` | `/seeker/*` |
| `RecruiterLayout.jsx` | `/recruiter/*` + `/company/*` |
| `AdminLayout.jsx` | `/admin/*` |

### 7.3 Route Guards

| Guard | Logic |
|-------|-------|
| `GuestMiddleware` | Logged in → redirect to dashboard |
| `RoleMiddleware` | Checks `authUser \|\| currentUser`, normalizes `recruiter↔company`, `admin`; wrong role → `AccessDenied` |

### 7.4 Global State

**`AuthContext`** — `user, setUser, login, logout, loading`, revalidates via `GET /api/me`.

**`PlatformContext`:** loads and mutates backend-backed listings, applications, tasks, interviews, ads, payments, notifications, complaints, categories, and pricing; local storage remains an offline fallback for selected UI state.

**API layer `frontend/src/lib/api/`:** `axios.js` (`VITE_BACKEND_URL`, `withCredentials`, Bearer), `auth`, `jobs`, `applications`, `recruitment`, `profile`, `complaints`, `dashboard`, `users/settings`.

### 7.5 Components & Pages

- **Components:** `ApplyModal`, `BoostModal`, `PaymentModal`, `CandidateModal`, `CategoryModal`, `NotificationDrawer`, `RoleSwitcher`, `ProtectedRoute`, `AuthUserBadge`.
- **Pages (39 files):** Public (Home, Jobs, JobDetail, About, Contact, **Workflow** — detailed 12-section realtime visualizer with traveling light), Auth (Login, Register, AdminLogin), Seeker (7), Recruiter (10), Admin (10+). `Workflow.jsx` is now detailed (not compressed, no `CHAPTER` word, no Classwork): DevOps 7 phases, CI 6 steps, CD, Github Actions, VPS, SSH, Linux & UFW, Database, Nginx, DNS + Cloudflare, CI/CD to VPS, IaC — vertical light rail + scroll progress.

---

## 8. Authentication & Authorization Flow

```
Register → POST /api/register → Sanctum token → jobconnect_session
Login → POST /api/login → token + role-mismatch check
AuthContext → GET /api/me revalidate
Guards → GuestMiddleware / RoleMiddleware → AccessDenied if mismatch
Logout → POST /api/logout → clear localStorage
PUT /api/update-credentials (needs current_password)
```

Roles: `seeker` (`job_seeker`), `recruiter` (`employer`/`company` — `/recruiter` ≡ `/company`), `admin`.

---

## 9. Features by Role

### Public

- Browse jobs, search/filter, view detail + ads, view boost pricing, submit `Contact` complaint (`POST /api/contact/submit`), view `Workflow` visualizer.

### Seeker (`/seeker/*`)

| Page | Route | What You Can Do |
|------|-------|-----------------|
| Dashboard | `/seeker/dashboard` | stats |
| Profile / CV | `/seeker/profile` | ~60 fields + uploads |
| My Applications | `/seeker/applications` | track stage |
| Assigned Tasks | `/seeker/tasks` | submit `submission_url` |
| Interviews | `/seeker/interviews` | confirm/decline |
| Saved | `/seeker/saved` | `toggleSaveJob` |
| Notifications | `/seeker/notifications` | inbox |

### Recruiter (`/recruiter/*` ≡ `/company/*`)

| Page | Route | What You Can Do |
|------|-------|-----------------|
| Dashboard | `/recruiter/dashboard` | postings, applicants |
| Company Profile | `/recruiter/profile` | rich company fields |
| My Job Posts | `/recruiter/jobs` | list/edit/delete |
| Post Job | `/recruiter/jobs/create` | create Job/Internship |
| Applicants | `/recruiter/applicants` | `CandidateModal` |
| Pipeline | `/recruiter/pipeline` | kanban |
| Tasks | `/recruiter/tasks` | `assignTask` |
| Interviews | `/recruiter/interviews` | `scheduleInterview` |
| Boosted | `/recruiter/boosted` | `boostListing`/`cancelBoost` |
| Payments | `/recruiter/payments` | history |

### Admin (`/admin/*`)

| Page | Route | What You Can Do |
|------|-------|-----------------|
| Dashboard | `/admin/dashboard` | `GET /api/admin/dashboard` |
| Complaints | `/admin/complaints` | reply/status/history |
| Users | `/admin/users` | CRUD |
| Jobs | `/admin/jobs` | moderate |
| Categories | `/admin/categories` | local CRUD |
| Featured | `/admin/featured` | boosted overview |
| Boost Pricing | `/admin/boost-pricing` | edit `settings` |
| Payments | `/admin/payments` | all records |

---

## 10. Monetization: Boost, Ads, Payments

- **Boost pricing:** `3d=$29`, `7d=$59`, `15d=$99`, `30d=$169`, custom `$6/day` (`settings` key `boost_pricing`).
- **Boost flow:** `BoostedPosts → BoostModal → PaymentModal → recordPayment() + POST /api/jobs/{id}/boost {days}` → `featured=true`.
- **Advertisements:** `GET /api/advertisements` public; recruiters can create ads and admins manage them and configure placement pricing. Defaults for ad placements are Sidebar `$9`, Banner `$19`, and Premium `$29` (`ad_pricing` setting).
- **Payments:** `payment_records` (`type/reference_title/amount/method/transaction_id/status`), recruiter `GET /api/payments`, admin `AdminPayments`.
- **Payment mode:** `GET /api/settings/payment-mode` reports the configured mode and `real_money=false`; payment flows are demo-only and do not process real money.

---

## 11. Complaint / Contact Support System

- **Submit:** `Contact.jsx → POST /api/contact/submit` public or `submitComplaint()` authed.
- **Track:** `GET /api/complaints`, `GET /api/complaints/{id}` with `history[]`.
- **Admin resolve:** `POST /api/complaints/{id}/reply` + `PUT /api/complaints/{id}/status`.
- **Seed:** `initialSeedComplaints` in `localStorage`.

---

## 12. Data Models & Database

Migrations (19 files in the current workspace, auto-run by `docker-entrypoint.sh` and locally):

```
0001_01_01_000000_create_users_table.php          → users, password_reset_tokens, sessions
0001_01_01_000001_create_cache_table.php           → cache, cache_locks
0001_01_01_000002_create_jobs_table.php            → jobs, job_batches, failed_jobs
2026_08_18_064228_create_items_table.php           → items
2026_08_18_073058_add_role_status_last_login...    → users.role/status/last_login_at
2026_08_18_073150_create_login_histories_table.php → login_histories
2026_08_22_134201_create_personal_access_tokens... → Sanctum tokens
2026_09_05_000001_create_listings_table.php        → listings
2026_09_05_000002_create_job_applications_table... → job_applications
2026_09_05_000003_create_user_profiles_table.php   → user_profiles
2026_09_05_000004_create_recruitment_tasks_table.. → recruitment_tasks
2026_09_05_000005_create_scheduled_interviews...   → scheduled_interviews
2026_09_05_000006_create_advertisements_table.php  → advertisements
2026_09_05_000007_create_payment_records_table.php → payment_records
2026_09_05_000008_create_settings_table.php        → settings
2026_09_05_000009_add_seeker_fields...             → extra seeker fields
2026_09_05_000010_create_complaints_table.php      → complaints
2026_09_05_000011_add_company_detailed_fields...   → extra company fields
2026_10_01_000001_secure_workflows_and_persistence.php → resume/task/interview fields, categories, saved jobs, notifications, and role normalization
```

In Docker, SQLite at `/var/www/database/database.sqlite` on volume `sqlite-data` (recreated after fix `down -v`), uploads on `uploads-data`. On VPS, same — `jobconnect_sqlite-data` volume at `/var/lib/docker/volumes/jobconnect_sqlite-data/_data`.

| Model | Table | Key Fields |
|-------|-------|------------|
| `User` | `users` | `name, email, password, role, status, last_login_at`; `HasApiTokens` |
| `JobListing` | `listings` | `user_id, title, company, category_type, category, type, work_model, location, salary, experience, description, requirements[], tags[], logo, featured, boosted_days, boost_expiry, status` |
| `JobApplication` | `job_applications` | `listing_id, user_id, candidate_name/email/phone, resume_url, cover_letter, status, ai_score` |
| `UserProfile` | `user_profiles` | ~60 columns, including `resume_path` |
| `RecruitmentTask` | `recruitment_tasks` | `application_id, recruiter_id, seeker_id, title, description, instructions, deadline, status, submission_path, submission_notes, feedback` |
| `ScheduledInterview` | `scheduled_interviews` | `application_id, recruiter_id, seeker_id, title, date, time, meeting_link, type, status, notes, candidate_response` |
| `Advertisement` | `advertisements` | `user_id, title, description, company, image_url, target_url, placement, days, amount, status, clicks, impressions` |
| `PaymentRecord` | `payment_records` | `user_id, type, reference_title, amount, payment_method, transaction_id, status` |
| `Complaint` | `complaints` | `user_id, name/email/phone/role, category, subject, message, status, priority, admin_feedback, admin_id, replied_at, history[]` |
| `Setting` | `settings` | `key, value[]` |
| `LoginHistory` | `login_histories` | `user_id, ip_address, user_agent, status, login_at` |
| `categories` | `categories` | `name, icon`; seeded defaults; listing counts are derived from active listings |
| `saved_jobs` | `saved_jobs` | unique `user_id + listing_id` pairs |
| `PlatformNotification` | `platform_notifications` | `user_id, title, message, is_read` |

---

## 13. API Reference

Base: `http://127.0.0.1:8000/api` local, `http://localhost:8000/api` Docker local, `http://187.52.122.100:8001/api` VPS. Health checks: `GET /api/health` and `GET /api/test`.

### Public

| Method & Path | Controller | Notes |
|---------------|------------|-------|
| `GET /health`, `GET /test` | `HealthController` / closure | health checks |
| `GET /items`, `POST /items` | `ItemController` | demo |
| `GET /jobs`, `GET /jobs/{id}` | `JobController` | job board |
| `GET /settings/boost-pricing`, `GET /settings/ad-pricing`, `GET /settings/payment-mode` | `SettingController` | pricing and payment mode |
| `GET /categories` | `PlatformController` | categories with active listing counts |
| `GET /advertisements` | `TaskInterviewController` | public ads |
| `POST /contact/submit` | `ComplaintController` | public complaint |
| `POST /login`, `POST /register` | `AuthController` | Sanctum token |

### Authenticated (`auth:sanctum`)

| Method & Path | Purpose |
|---------------|---------|
| `POST /logout`, `GET /me`, `PUT /update-credentials` | session |
| `GET /profile`, `POST /profile`, `PUT /profile` | CV/company |
| `POST /profile/upload-resume`, `GET /profile/resume` | multipart upload and current user's resume |
| `POST /profile/upload-image` | multipart avatar/logo/banner |
| `GET /saved-jobs`, `POST /saved-jobs`, `DELETE /saved-jobs/{id}` | persistent saved jobs |
| `GET /notifications`, `PUT /notifications/read-all`, `PUT /notifications/{id}` | user notifications and read state |
| `POST /jobs`, `PUT /jobs/{id}`, `DELETE /jobs/{id}` | manage own posts |
| `POST /jobs/{id}/boost`, `POST /jobs/{id}/cancel-boost` | boost |
| `GET /applications`, `POST /applications`, `GET /applications/{id}`, `GET /applications/{id}/resume`, `PUT /applications/{id}/status` | apply, resume access, and pipeline |
| `GET /tasks`, `POST /tasks`, `PUT /tasks/{id}`, `GET /tasks/{id}/submission` | tasks and submission access |
| `GET /interviews`, `POST /interviews`, `PUT /interviews/{id}` | interviews |
| `POST /advertisements`, `GET /payments` | ads + own payments |
| `POST /settings/boost-pricing`, `POST /settings/ad-pricing` | update pricing; admin middleware required |
| `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}` | category management; admin middleware required |
| `GET /complaints`, `GET /complaints/{id}` | support inquiries |
| `POST /complaints/{id}/reply`, `PUT /complaints/{id}/status` | admin-only complaint workflow |

### Admin only (`auth:sanctum` + `admin`)

| Method & Path | Purpose |
|---------------|---------|
| `GET /admin/dashboard` | stats |
| `GET /admin/users` … `DELETE /admin/users/{id}` | `apiResource` |

The authenticated route group also requires the account to be active. Login, registration, and public complaint submission have request throttling.

---

## 14. Frontend Routes Reference

`frontend/src/App.jsx` (`BrowserRouter`):

```
Public (PublicLayout):
  /                  → Home
  /jobs              → Jobs
  /jobs/:id          → JobDetail
  /about             → About
  /contact           → Contact
  /workflow          → Workflow (detailed 12-section realtime visualizer, traveling light)
  /access-denied     → AccessDenied

Auth (AuthLayout + GuestMiddleware):
  /login             → Login
  /register          → Register
  /admin/login       → AdminLogin

Seeker (SeekerLayout + RoleMiddleware['seeker']):
  /seeker/dashboard, /seeker/profile, /seeker/applications,
  /seeker/tasks, /seeker/interviews, /seeker/saved,
  /seeker/notifications, /seeker/settings (=Dashboard alias)

Recruiter + Company alias (RecruiterLayout + RoleMiddleware['recruiter','company']):
  /recruiter/... and /company/... (same pages):
  dashboard, profile, jobs, jobs/create, applicants, pipeline,
  tasks, interviews, boosted, payments,
  advertisements, notifications (=Pipeline alias), settings (=Dashboard alias)

Admin (AdminLayout + RoleMiddleware['admin']):
  /admin/dashboard, /admin/complaints, /admin/users, /admin/jobs,
  /admin/categories, /admin/featured, /admin/boost-pricing,
  /admin/advertisements, /admin/ad-pricing, /admin/payments,
  /admin/analytics (=Dashboard), /admin/settings

Fallback: * → Navigate /
```

---

## 15. Configuration & Environment

### Backend

| Source | Values |
|--------|--------|
| `backend/.env.example` | Stock local: `APP_URL=http://localhost:8000`, `DB_CONNECTION=sqlite`, `SESSION_DRIVER=database`, `CACHE_STORE=database`, `QUEUE_CONNECTION=database`, `MAIL_MAILER=log`, `FILESYSTEM_DISK=local`, `APP_KEY=` (generated) |
| `backend/.env` (local) | Created if missing, `APP_KEY=base64:...` after `key:generate` |
| VPS `~/jobconnect/.env` (from `.env.vps.example`) | `VITE_BACKEND_URL=http://187.52.122.100:8001`, `APP_URL=http://187.52.122.100:8001`, `FRONTEND_URL=http://187.52.122.100:5173`, `CORS_ALLOWED_ORIGINS=http://187.52.122.100:5173,http://187.52.122.100`, a private generated `APP_KEY`, `DB_CONNECTION=sqlite`, `DB_DATABASE=/var/www/database/database.sqlite`, `BACKEND_PORT=8001`, `FRONTEND_PORT=5173`. Never publish or commit the actual `.env` value. |
| Docker compose `environment:` + `env_file:` `docker-compose.yml:10` | `APP_ENV=production`, `APP_DEBUG=false`, `DB_DATABASE=/var/www/database/database.sqlite` default, `env_file: [.env (required:false), .env.vps (required:false)]` — `config:clear` in entrypoint makes env effective |
| CORS `backend/config/cors.php:22` | Now env-driven `array_merge(localhost defaults, explode(',', CORS_ALLOWED_ORIGINS), FRONTEND_URL)`, `supports_credentials:true` |

### Frontend

| Source | Value | Notes |
|--------|-------|-------|
| `frontend/.env` + `frontend/.env.local` | `VITE_BACKEND_URL=http://127.0.0.1:8000` | Local `vite dev` |
| Docker build-arg `frontend/Dockerfile:9` + `docker-compose.yml:50` | `VITE_BACKEND_URL: ${VITE_BACKEND_URL:-http://localhost:8000}` | Baked at build. VPS `http://187.52.122.100:8001` via `~/jobconnect/.env` `VITE_BACKEND_URL`, triggers frontend rebuild on `up --build` |
| `.env.vps.example` (next to compose) | Full VPS template with `VITE_BACKEND_URL`, `APP_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `APP_KEY`, `DB_*`, `BACKEND_PORT/FRONTEND_PORT` + GitHub Secrets docs | Copy to `.env` on VPS: `cp .env.vps.example .env` |
| `.env.docker.example` | `VITE_BACKEND_URL=http://localhost:8000` | Local Docker quick start |

**Launcher PHP/npm lookup** (`run.py`): now finds `php 8.4` via `winget` `C:\Users\demon\AppData\Local\Microsoft\WinGet\...` `8.4.25`, plus `C:\xampp\php\php.exe` fallback, `C:\nvm4w\nodejs\npm.cmd`.

---

## 16. Requirements & Prerequisites

Pick your run mode first — **Docker is recommended** (no PHP/Node install needed), **Local** is for active development, **VPS** is for production deploy. All three share the same codebase.

### 16.1 At a Glance — Which Mode Needs What?

| Run Mode | Ideal For | Host Install Required | Env File to Prepare | Ports Needed | Time to First Run |
|----------|-----------|----------------------|---------------------|--------------|-------------------|
| **Docker (Local)** | Evaluators, quick demo, zero-setup | **Docker Desktop only** | None (defaults work) or `.env` next to `docker-compose.yml` | `8000` (backend) + `5173` (frontend) | ~3–5 min (first build) |
| **Local (Without Docker)** | Active dev, debugging, hot-reload | PHP 8.4 + Composer + Node 18+ + npm + Git (+ Python for `run.py`) | `backend/.env` + `frontend/.env` | `8000` + `5173` | ~2 min after deps installed |
| **VPS (Production)** | Live deploy on lecture VPS or any Ubuntu VPS | Local: Git + SSH (+ Docker not needed locally); VPS: Docker + nginx + UFW (via `scripts/setup-vps.sh`) | **On VPS** `~/jobconnect/.env` copied from `.env.vps.example` | `8001` (backend, because `8000` busy on lecture VPS) + `5173` (frontend) | ~5–8 min incl. SSH + build |

### 16.2 System Requirements

| Category | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| **OS** | Windows 10/11, macOS 13+, or Ubuntu 22.04+ | Windows 11 + WSL2, or Ubuntu 24.04 LTS | All commands have PowerShell + bash variants |
| **CPU / RAM** | 2 cores / 4 GB RAM | 4 cores / 8 GB RAM | Docker build peaks ~1.5 GB (frontend Vite + PHP `composer install`) |
| **Disk** | 3 GB free | 10 GB free | `node_modules` ~350 MB + `vendor` ~180 MB + Docker images ~1.2 GB + volumes |
| **Network** | Broadband | Broadband | `npm ci` + `composer install` download ~300 MB on first build |
| **Browser** | Chrome 120+ / Edge 120+ / Firefox 120+ | Latest Chrome/Edge | Required for Sanctum `withCredentials`, `localStorage` fallback |

### 16.3 Software Requirements & Version Matrix

> **Source of truth for versions:** `backend/composer.json:12` (`php ^8.3` — runtime requires `>=8.4.1` due to `symfony/* v8.1` + `laravel/framework v13.26.1`), `backend/Dockerfile:2` (`php:8.4-cli-bookworm`), `frontend/package.json:26` (Node), `frontend/Dockerfile:3` (`node:20-alpine`).

| Software | Version Required | Check Command | Where Needed | Install Guide |
|----------|------------------|---------------|--------------|---------------|
| **PHP** | `^8.4` (≥ 8.4.1, tested `8.4.25` via `winget`) | `php --version` | Local mode only (Docker bundles it) | `winget install PHP.PHP.8.4` (Win) / `apt install php8.4-cli php8.4-sqlite3 php8.4-intl php8.4-zip` (Ubuntu) / `brew install php@8.4` (macOS) |
| **PHP Extensions** | `pdo_sqlite`, `bcmath`, `intl`, `zip`, `pcntl`, `sqlite3` | `php -m` | Local mode only | Bundled with PHP on Win; on Ubuntu `apt install php8.4-{sqlite3,bcmath,intl,zip}` |
| **Composer** | `2.x` (tested `2.8`) | `composer --version` | Local mode only (Docker uses `composer:2` stage) | https://getcomposer.org/download/ — `winget install Composer.Composer` |
| **Node.js** | `18.x` or `20.x` (LTS, CI matrix `18.x/20.x` in `.github/workflows/ci.yml:12`) | `node --version` | Local mode only (Docker uses `node:20-alpine`) | https://nodejs.org — `winget install OpenJS.NodeJS.LTS` or `nvm` |
| **npm** | `10.x` (ships with Node 20) | `npm --version` | Local mode only | Comes with Node; `C:\nvm4w\nodejs\npm.cmd` on NVM Windows |
| **Python** | `3.10+` (for `run.py` launcher, optional) | `python --version` | Local mode only, optional | `winget install Python.Python.3.12` — fallback is manual `start-*.bat` |
| **Git** | `2.40+` | `git --version` | All modes (VPS `git pull`, GitHub Actions) | https://git-scm.com — `winget install Git.Git` |
| **Docker Desktop** | `4.30+` with Compose v2 (`docker compose` not `docker-compose`) | `docker --version` + `docker compose version` | Docker + VPS modes | https://docs.docker.com/desktop/ — enable WSL2 backend on Windows |
| **SSH client** | OpenSSH 8+ | `ssh -V` | VPS mode only | Built-in on Win10+ / macOS / Linux; key at `F:\Hackathom\14523_\Doc\s20210104034` |
| **curl** | Any | `curl --version` | Health checks all modes | Built-in; used in `docker-entrypoint.sh` healthcheck `curl -sf /api/test` |

**Version gotcha:** `composer.json` says `php ^8.3` but `composer.lock` + `symfony/* v8.1` require `>=8.4.1` — you **must** use PHP 8.4, not 8.3. Fixed via `backend/Dockerfile:2` `php:8.4-cli-bookworm` and local `winget install PHP.PHP.8.4`.

### 16.4 Environment Files — What to Create Before Running

| File | Location | Template | When to Create | Key Variables Inside |
|------|----------|----------|----------------|---------------------|
| `backend/.env` | `Job connect/backend/.env` | `backend/.env.example` | **Local mode** only — created automatically by `docker-entrypoint.sh` (Docker) or `Copy-Item .env.example .env` (Local) | `APP_KEY` (generated), `APP_URL=http://localhost:8000`, `DB_CONNECTION=sqlite`, `SESSION_DRIVER=database` (see §15) |
| `frontend/.env` | `Job connect/frontend/.env` | — (single line) | **Local mode** only — already present `VITE_BACKEND_URL=http://127.0.0.1:8000` | `VITE_BACKEND_URL=http://127.0.0.1:8000` (local dev) |
| `.env` (compose) | `Job connect/.env` (next to `docker-compose.yml`) | `.env.vps.example` or `.env.docker.example` | **Docker local** (optional) and **VPS** (required on VPS as `~/jobconnect/.env`) | `VITE_BACKEND_URL`, `APP_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `APP_KEY`, `DB_*`, `BACKEND_PORT`, `FRONTEND_PORT` |
| `.env.vps` | `Job connect/.env.vps` (alternative compose env) | `.env.vps.example` | VPS only, alternative to `.env` — `docker-compose.yml:10` reads both `env_file: [.env, .env.vps]` `required:false` | Same as above — see `VPS.md:95` for required VPS values |
| `.env.vps.example` | Git-committed template | — | Reference only, never used at runtime | Template with host URLs, CORS origins, database settings, ports, and an `APP_KEY` placeholder that must be replaced privately |

> **Important:** `VITE_BACKEND_URL` is **baked at build time** (Vite). Changing it requires `docker compose up --build -d` (rebuild frontend). Runtime `environment:` vars like `APP_URL`, `CORS_ALLOWED_ORIGINS` are read via `docker-entrypoint.sh:31` `config:clear`.

| Secret Location | File | Ignored by `.gitignore:3`? | How to Generate |
|-----------------|------|----------------------------|-----------------|
| `APP_KEY` local | `backend/.env` | Yes (`backend/database/database.sqlite` also ignored) | `php artisan key:generate` or `php artisan key:generate --show` (copy `base64:...`) |
| `APP_KEY` VPS | `~/jobconnect/.env` | Yes (`.env` ignored) | Generate a private key with `php artisan key:generate`; never paste the value into tracked documentation or source files |
| `VPS_SSH_KEY` | `~/.ssh/s20210104034` (local) | Yes (`*.key/*.pem`) | Provided `F:\Hackathom\14523_\Doc\s20210104034` ED25519 `SHA256:0TKTEsVWCl+Tk8G4HkvOdqHNuVzaigN7OwAfMX1leOI` — fix perms `icacls ... /inheritance:r` |

### 16.5 Ports & Firewall

| Service | Container Port | Host Port (Local) | Host Port (VPS) | URL | Notes |
|---------|---------------|-------------------|-----------------|-----|-------|
| Backend (Laravel `artisan serve`) | `8000` | `8000` (`${BACKEND_PORT:-8000}:8000`) | **`8001`** (`BACKEND_PORT=8001` because `8000` is occupied by `s20210204007` on lecture VPS) | Local `http://localhost:8000/api/test` — VPS `http://187.52.122.100:8001/api/test` | Health: `GET /api/test → {"status":"success"}` (`docker-compose.yml:38`) |
| Frontend (nginx) | `80` | `5173` (`${FRONTEND_PORT:-5173}:80`) | `5173` | Local `http://localhost:5173` — VPS `http://187.52.122.100:5173` | SPA fallback `try_files $uri /index.html` (`frontend/nginx.conf:24`) |
| Host Nginx (optional) | — | `80`/`443` | `80`/`443` | — | On VPS `UFW` `22/80/443 allow` (`scripts/setup-vps.sh:32`), `5173`/`8001` work via **Docker iptables bypass** (not explicitly `ufw allow`) |

**If a port is busy:** change `BACKEND_PORT`/`FRONTEND_PORT` in `.env` (next to `docker-compose.yml`) and rebuild — e.g., `BACKEND_PORT=8002 FRONTEND_PORT=5174 docker compose up --build -d`.

### 16.6 Accounts & Keys Needed

| Need | Where to Get It | When Required |
|------|-----------------|---------------|
| **VPS SSH private key** | `F:\Hackathom\14523_\Doc\s20210104034` (private, `400`) + `.pub` (public, `102`) ED25519 | VPS deploy only — copy to `$HOME\.ssh\s20210104034` and `icacls /inheritance:r` + `grant demon:(R)` |
| **VPS credentials** | `VPS_HOST=187.52.122.100`, `VPS_USER=s20210104034`, `VPS_PORT=22`, `VPS_PATH=~/jobconnect` | VPS deploy + GitHub Actions Secrets |
| **GitHub Secrets** | Repo Settings → Secrets and variables → Actions | Auto-deploy via `.github/workflows/deploy.yml` — `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_PATH`, `VPS_SSH_KEY` (paste private key `-----BEGIN...`) |
| **App accounts** | Register in UI: `seeker`, `recruiter`, `admin` (via `/admin/login`) | Testing — no external OAuth required |

### 16.7 Pre-Flight Checklist (Run Before Any Mode)

**All modes:**
```powershell
git --version          # ≥2.40
git status             # repo at F:\Hackathom\14523_\Job connect with docker-compose.yml:60
Test-Path "Job connect\docker-compose.yml"  # True
Test-Path "Job connect\backend\.env.example" # True
Test-Path "Job connect\.env.vps.example"     # True
```

**For Docker (Local) — verify:**
```powershell
docker --version                    # e.g. 28.x
docker compose version              # v2.x (not docker-compose)
docker ps                           # daemon running
netstat -ano | findstr ":8000 :5173"  # ports free (no output = free)
# If ports busy, set BACKEND_PORT/FRONTEND_PORT in .env and use those instead
```

**For Local (Without Docker) — verify:**
```powershell
php --version          # 8.4.25
composer --version     # 2.x
node --version         # 18.x or 20.x
npm --version          # 10.x
python --version       # 3.10+ (optional, for run.py)
php -m | findstr "pdo_sqlite bcmath intl zip"  # extensions present
```

**For VPS — verify (from your local machine):**
```powershell
Test-Path "$HOME\.ssh\s20210104034"  # private key exists
ssh -i ~/.ssh/s20210104034 s20210104034@187.52.122.100 "whoami; sudo docker ps; sudo ufw status"
# → s20210104034, containers (jobconnect-backend/frontend or bookdb), UFW active 22/80/443 allow
cat "Job connect\.env.vps.example"  # template exists, copy to .env on VPS later
```

> **Tip for evaluators:** If you only want to run the app quickly, **use Docker** — you do **not** need PHP, Composer, Node, or Python. Just Docker Desktop. Jump to §17.

---

## 17. How to Run — Docker (Local)

**Prerequisites:** Docker Desktop (see §16.3), ports `8000`/`5173` free (see §16.5). No PHP/Node/Composer needed — Docker bundles everything (`php:8.4-cli-bookworm` + `node:20-alpine`).

```powershell
cd "Job connect"
docker compose up --build -d
docker compose logs -f
# Frontend: http://localhost:5173
# Backend: http://localhost:8000/api/test
docker compose stop; docker compose start; docker compose down; docker compose down -v # delete DB
```

What happens: `backend/Dockerfile` builds `php:8.4-cli`, `composer install`, entrypoint ensures `.env`/`database.sqlite`/`APP_KEY`/`migrate --force`, serves `0.0.0.0:8000`; `frontend/Dockerfile` `npm ci` → `npm run build` (bakes `VITE_BACKEND_URL`) → `nginx:1.27-alpine` SPA fallback. Volumes `sqlite-data`/`uploads-data` persist.

---

## 18. How to Run — VPS (Production)

**VPS:** `187.52.122.100`, user `s20210104034` (`F:\Hackathom\14523_\Doc\s20210104034` ED25519 `SHA256:0TKTEsVWCl+Tk8G4HkvOdqHNuVzaigN7OwAfMX1leOI`), path `~/jobconnect`, `sudo docker` required.

**Prerequisites:** SSH key at `$HOME\.ssh\s20210104034` with `icacls /inheritance:r` + `grant demon:(R)` (see §16.6), `VPS.md` + `.env.vps.example` template, `scripts/setup-vps.sh` for bootstrap (see §16.1 table).

**Keys (provided, already secured):**
```powershell
# Private already at F:\Hackathom\14523_\Doc\s20210104034 (400) + .pub (102)
# Copied to $HOME\.ssh\s20210104034 with icacls /inheritance:r + grant demon:(R)
ssh -i ~/.ssh/s20210104034 s20210104034@187.52.122.100 "whoami" # → s20210104034
```

**One-time VPS bootstrap (already done, or re-run):**
```bash
scp -i ~/.ssh/s20210104034 scripts/setup-vps.sh s20210104034@187.52.122.100:~/setup-vps.sh
ssh -i ~/.ssh/s20210104034 s20210104034@187.52.122.100 "chmod +x ~/setup-vps.sh; sudo ~/setup-vps.sh"
# installs docker.io, docker-compose-plugin, nginx, ufw allow 22/80/443, creates /etc/nginx/sites-available/cse3100.conf
```

**Deploy (manual, already done via `tar`):**
```powershell
# From local (PowerShell) — handles space in "Job connect"
cmd /c "tar --exclude=.git --exclude=node_modules --exclude=vendor --exclude=dist -czf - -C ""F:\Hackathom\14523_\Job connect"" . | ssh -i ""%USERPROFILE%\.ssh\s20210104034"" s20210104034@187.52.122.100 ""mkdir -p ~/jobconnect && tar -xzf - -C ~/jobconnect"""
ssh -i ~/.ssh/s20210104034 s20210104034@187.52.122.100 "cd ~/jobconnect && cp .env.vps.example .env && nano .env # set VITE_BACKEND_URL=http://187.52.122.100:8001 etc."
# Fix from 2026-09-23 deploy:
#   VITE_BACKEND_URL http://187.52.122.100:8001 (8000 busy by s20210204007), BACKEND_PORT=8001, APP_KEY generated, DB_DATABASE fixed
ssh -i ~/.ssh/s20210104034 s20210104034@187.52.122.100 "cd ~/jobconnect && touch .env.vps && sudo docker compose up --build -d && sudo docker compose ps && curl http://localhost:8001/api/test"
```

**Or via helper:**
```powershell
.\scripts\deploy-vps.sh  # reads VPS_* from .env.vps
```

**GitHub Actions (auto, ready, needs Secrets):**
- `ci.yml` (matrix 18.x/20.x + PHP 8.4) and `deploy.yml` (needs ci, `appleboy/scp-action` + `ssh-action` `docker compose up --build -d`) already in `.github/workflows/`.
- Set in GitHub repo → Settings → Secrets and variables → Actions:
  `VPS_HOST=187.52.122.100`, `VPS_USER=s20210104034`, `VPS_PORT=22`, `VPS_PATH=~/jobconnect`, `VPS_SSH_KEY` (paste private key `-----BEGIN...`). Push to `main` auto-deploys.

**Live on VPS (verified 2026-09-23 11:42 UTC):**
- Frontend: `http://187.52.122.100:5173` → `<title>JobConnect | Executive Tech Careers...</title>` `200 OK` (nginx), `/workflow` detailed page works
- Backend: `http://187.52.122.100:8001/api/test` → `{"status":"success","message":"Backend is successfully connected!"}` (inside `curl http://localhost:8001/api/test` also `200`), `GET /api/jobs` → `{"success":true,"data":[]}`
- Containers: `jobconnect-backend Up (healthy) 0.0.0.0:8001->8000`, `jobconnect-frontend Up 0.0.0.0:5173->80`, `bookdb` still on `127.0.0.1:3307->3306` (other student)
- Logs: `migrations 18 files DONE`, `Server running on [http://0.0.0.0:8000]`, no `SQLSTATE[HY000][14]` after `DB_DATABASE` fix and `down -v` recreation

UFW on VPS `active` `22/80/443 allow` (plus `4054/8080/8090/8082/3000` from other students), `5173/8001` work via Docker iptables bypass even though not explicitly `ufw allow` (expected).

Host Nginx `/etc/nginx/sites-available/cse3100.conf` still `server_name cse3100.aliahnaf.fun; proxy_pass 127.0.0.1:3000;` (other project) — JobConnect does not use host Nginx, it uses its own `frontend:80` → `5173` and `backend:8000` → `8001` directly.

---

## 19. How to Run — Local (Without Docker)

**Prerequisites:** See §16.3 — PHP 8.4+ + Composer + Node 18+/npm + Git; Python 3 optional for `run.py`. Verify with `php --version`, `composer --version`, `node --version`, `npm --version` (see §16.7 checklist).

### Option A — One-command launcher

```powershell
python run.py  # from root or Job connect
# or .\run.bat
```

Finds `backend/` + `frontend/`, resolves `php` (now `8.4.25` via winget) + `npm` (`C:\nvm4w\nodejs\npm.cmd`), starts `artisan serve --host=127.0.0.1 --port=8000` + `npm run dev`, opens `http://localhost:5173`.

### Option B — Split batch files

```
start-backend.bat   # cd backend + php artisan serve --host=127.0.0.1 --port=8000
start-frontend.bat  # cd frontend + npm run dev
start-all.bat       # two cmd windows
```

### Option C — Manual (two terminals)

```powershell
# Terminal 1 — backend
cd "Job connect\backend"
php --version          # now 8.4.25
composer install
Copy-Item ".env.example" ".env"  # if missing
php artisan key:generate
php artisan migrate --force
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2 — frontend
cd "Job connect\frontend"
npm install
npm run dev          # → http://localhost:5173
```

---

## 20. Testing the Setup

1. **Local Docker:** `http://localhost:8000/api/test` or `http://127.0.0.1:8000/api/test` → `{"status":"success"...}`
2. **VPS Docker (live):** `http://187.52.122.100:8001/api/test` → `{"status":"success"...}` (verified 2026-09-23 `curl -sf` both localhost and external), `http://187.52.122.100:5173` → Home, `http://187.52.122.100:5173/workflow` → detailed visualizer
3. **Local dev:** `http://localhost:5173` → Home hero + featured jobs + `Workflow` nav (`LIVE` badge)
4. **Register 3 accounts:** `seeker`, `recruiter`, `admin` (via `/admin/login`), test role-mismatch `Access Denied`
5. **Happy path:** recruiter posts → seeker applies → pipeline → task → interview → boost → admin payments/complaints
6. **Offline fallback:** stop backend, frontend still renders `localStorage` `jobconnect_*`
7. **Persist:** `docker compose down && up -d` keeps data (volume), `down -v` resets and re-migrates (as done on VPS to fix `SQLSTATE[HY000][14]`)

---

## 21. Design System (UI)

- **Palette (`frontend/src/index.css` `@theme` + `tailwind.config.js:10`):** `navy #1F2A44`, `navyDark #131B2E`, `canvas #F8FAFC`, `accent #2563EB`, `teal #219EBC`.
- **Font:** `Inter`. Shadows: `glass/card/hover`.
- **Motion/Icons:** Framer Motion + Lucide. Layouts with sidebars, modals `Apply/Boost/Payment/Candidate/Category`, `NotificationDrawer`, `AuthUserBadge`.
- **Workflow page (`frontend/src/pages/public/Workflow.jsx`):** detailed 12-section realtime visualizer (no `CHAPTER`, no Classwork): DevOps 7 phases, CI 6 steps, CD, Github Actions, VPS, SSH, Linux & UFW, Database, Nginx, DNS + Cloudflare, CI/CD to VPS, IaC — vertical light rail `useScroll` + top 3-stage `Push → Build → VPS Deploy` beam/dot loop, large scroll page with code blocks, not compressed.

---

## 22. VPS Deployment Verification (2026-09-23 Live)

Run on VPS `s20210104034@187.52.122.100` via `ssh -i ~/.ssh/s20210104034`:

| Area | Check | Result 2026-09-23 |
|------|-------|-------------------|
| SSH keys | `F:\Hackathom\14523_\Doc\s20210104034` (411) + `.pub` (102) ED25519 `SHA256:0TKTEsVWCl+Tk8G4HkvOdqHNuVzaigN7OwAfMX1leOI` → `~/.ssh/s20210104034` `icacls /inheritance:r` + `grant demon:(R)` → `whoami: s20210104034` | PASS |
| Copy | `cmd /c tar --exclude=.git/node_modules/vendor ... -C "Job connect" . \| ssh "mkdir -p ~/jobconnect && tar -xzf - -C ~/jobconnect"` → `~/jobconnect` has `backend/frontend/docker-compose.yml:60`, `VPS.md`, `scripts/` | PASS |
| Env | `.env` configured with the VPS backend/frontend URLs, CORS origins, `BACKEND_PORT=8001`, a private generated `APP_KEY`, and `DB_DATABASE=/var/www/database/database.sqlite`; `.env.vps` created for Compose | PASS (the earlier empty database path was corrected) |
| Dockerfile | `backend/Dockerfile:2` `php:8.3-cli` → `php:8.4-cli-bookworm` (`symfony/* v8.1` needs `>=8.4.1`) via `sed -i` + `scp` | PASS — rebuild `2.3s` autoload `4780 classes` |
| Compose | Optional `.env` / `.env.vps` files, a default SQLite path, private `APP_KEY` injection, and configurable `BACKEND_PORT` / `FRONTEND_PORT` | PASS — resolved Compose config used the SQLite path and VPS frontend backend URL; secret values are intentionally omitted here |
| Build | `sudo docker compose up --build -d` (frontend `vite` 5.9s `106kB css 976kB js`, backend `apt` 158s `docker-php-ext-install` + `composer install` 2.5s) | PASS — `jobconnect-backend:healthy`, `jobconnect-frontend:Up` |
| DB | `SQLSTATE[HY000][14] unable to open database file` (empty `DB_DATABASE`) → fixed via `.env` `DB_DATABASE` + `down -v` recreation → `migrations 18 files DONE`, `Server running on [http://0.0.0.0:8000]` | PASS after `down -v` + `up` |
| UFW | `Status: active` `22/80/443/Nginx Full allow` + `4054/8080/8090/8082/3000` (other students), `5173/8001` not explicitly allow but **Docker iptables bypass** makes them reachable (verified external `curl`) | PASS |
| Health | `curl http://localhost:8001/api/test` + `curl http://187.52.122.100:8001/api/test` → `{"status":"success"}`; `curl -I http://localhost:5173` → `200 nginx/1.27.5`; `curl http://187.52.122.100:5173` → `<title>JobConnect...` ; `GET /api/jobs` → `{"success":true,"data":[]}`; `docker ps` shows `0.0.0.0:8001->8000`, `0.0.0.0:5173->80`; `docker logs` shows `Nothing to migrate` after fix | PASS (verified 2026-09-23 11:42 UTC) |
| Host Nginx | `/etc/nginx/sites-available/cse3100.conf` `server_name cse3100.aliahnaf.fun; proxy_pass 127.0.0.1:3000;` (other project) — JobConnect uses Docker ports directly, no host Nginx change needed | N/A |
| Local | `php --version` now `8.4.25` (winget), `npm run build` `2304 modules` `106kB css 976kB js`, `oxlint` 0 errors, `http://localhost:5173` + `http://127.0.0.1:8000/api/test` still work | PASS |

Live URLs: **Frontend `http://187.52.122.100:5173` / `http://187.52.122.100:5173/workflow`**, **Backend `http://187.52.122.100:8001/api/test`**.

---

## 23. Limitations & Future Improvements

- No real payment gateway — `PaymentModal` mock; plug in Stripe/SSLCommerz with server verification.
- No real mail — `MAIL_MAILER=log`; add SMTP + queued notifications.
- File uploads on local disk (volume `uploads-data`); move to S3/cloud + MIME/size validation for scale.
- Payments remain in demo mode; connect a payment provider and verify transactions server-side before accepting real money.
- No automated tests for new modules (only Pest scaffolding) — add feature tests for auth, jobs, applications, boost, complaints.
- Next.js leftovers in `frontend/` (`app/`, `.next/`, `next.config.mjs`) should be removed.
- Hardcoded Windows PHP paths in launchers limit portability — now finds `8.4` via `PATH`, but still has fallbacks.
- Frontend chunk `976kB` >500kB Vite warning — split via `dynamic import()` per route (`App.jsx`).
- VPS port `8001` instead of `8000` due to `s20210204007` occupying `8000` (`php artisan serve` + `php8.4 -S` on that student); if that student stops, revert `BACKEND_PORT` to `8000` and `VITE_BACKEND_URL` to `8000` and rebuild.
- Host Nginx still points `cse3100.aliahnaf.fun` → `127.0.0.1:3000` (other project) — for JobConnect domain, add `server_name` + `proxy_pass` to `127.0.0.1:5173`/`8001` and Cloudflare A record → `187.52.122.100`, or use Docker ports directly as now.

---

## 24. Glossary

| Term | Meaning |
|------|---------|
| Boost | Paid promotion `featured=true` + expiry |
| Pipeline | Application stages: applied → shortlisted → task → interview → hired/rejected |
| Placement | Where an ad renders (e.g., home, jobs sidebar) |
| Sanctum token | `auth_token` in `localStorage`, Bearer on every API call |
| `jobconnect_*` | `localStorage` namespace |
| Role alias | `/recruiter` ≡ `/company`; `employer`/`company` → `recruiter` |
| `sqlite-data` / `uploads-data` | Docker volumes (`docker-compose.yml:59`) — survive `down` (delete with `down -v`), VPS at `/var/lib/docker/volumes/jobconnect_*` |
| VPS `s20210104034` | Lecture VPS `187.52.122.100:22` `~/jobconnect`, keys `F:\Hackathom\14523_\Doc\s20210104034` (ED25519), `sudo docker` required, live `5173`/`8001` |

---

*Updated 2026-09-24 — Added §16 Requirements & Prerequisites (hardware/software/env matrix + ports + pre-flight checklist for Docker / VPS / Local). Prior 2026-09-23 11:42 UTC — VPS live deployment (keys `s20210104034`, `php:8.4`, `DB_DATABASE` fix, `8001` port, `VPS.md` + `scripts/` + GitHub Actions); prior Docker-only rewrite (603 lines). If you change routes, models, pricing, or VPS ports/domain, update §§5,12–18,22 and `VPS.md`/`docker-compose.yml`.*
