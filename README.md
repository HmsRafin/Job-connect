# Job Connect

Job portal built with Laravel 13, React 19 and Vite 8. Candidates can maintain a profile and private PDF CV, save jobs, apply, submit recruitment tasks and respond to interviews. Recruiters manage listings and candidates; administrators approve jobs and manage users, categories, support and demonstration pricing.

Checkout is explicitly a course demonstration: transactions are stored as **Demo**, no card details are collected, and no money is charged. Email delivery requires SMTP; the default mail driver logs messages.

## Run with Docker

Install Docker Desktop, open PowerShell in this repository, then run:

```powershell
./scripts/init-docker-env.ps1
docker compose up --build --wait
```

Open http://localhost:8080. The generated, ignored `.env` contains the local administrator email and random password. Keep its keys and database passwords stable. See [DOCKER.md](DOCKER.md).

## Class-server deployment

The course deployment uses http://jobconnect.austattendance.online, PHP 8.4-FPM, and the instructor's shared MySQL server. It does **not** run this Docker stack on the class server.

Every push to `main` runs `.github/workflows/deploy.yml`: frontend lint/build, backend tests on SQLite and MySQL, Docker readiness and Chromium browser tests, then Composer production installation, frontend build, archive validation, SCP upload and remote migrations/cache generation. All package installation and compilation happen on GitHub Actions.

See [VPS.md](VPS.md) and [PROJECT_AUDIT.md](PROJECT_AUDIT.md) for requirements and verification.

## Layout

| Path | Purpose |
| --- | --- |
| `backend/` | Laravel API, authorization, migrations, tests and SPA entry point |
| `frontend/` | React application; builds into `backend/public/app/` |
| `qa/` | Playwright browser tests against a running application |
| `Dockerfile`, `docker-compose.yml` | Local PHP-FPM, nginx and MySQL stack |
| `scripts/` | Archive validation and class-server deployment helpers |

## Development and tests

Use PHP 8.4.1 or newer in the 8.4 series, Composer 2 and Node 24 LTS. In `backend`, install dependencies, copy `.env.example` to `.env`, configure the local database and generate an application key. Run `php artisan migrate`, then `php artisan serve`. In `frontend`, run `npm ci` and `npm run dev`; the Vite development server proxies `/api` to port 8000.

```text
backend:  composer validate --strict
backend:  composer test
frontend: npm run lint
frontend: npm run build
qa:       npm ci && npx playwright install chromium && npm test
```

Set `BASE_URL`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` when running the full browser suite against a test instance. Tests create and remove their own recruiter/candidate data. Never use migration reset commands on the live database.

Private keys, credentials, `.env`, databases, dependencies, generated frontend assets and browser traces are excluded from Git. Initial administrator seeding uses environment variables and does not reset existing administrators.
