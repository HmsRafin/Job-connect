# Local Docker setup

This stack is for a local computer or private host. The class VPS uses shared nginx/PHP-FPM/MySQL and must not run another MySQL container or build packages.

## Start

```powershell
./scripts/init-docker-env.ps1
docker compose up --build --wait
```

Open http://localhost:8080 and http://localhost:8080/api/health. The initializer refuses to overwrite an existing `.env`. It generates a stable application key, two database passwords, and an initial administrator password. Read the administrator values from that local file and sign in at `/admin/login`.

## Services and data

| Service | Runtime | Exposure |
| --- | --- | --- |
| `web` | nginx and built React assets | 127.0.0.1:8080 |
| `backend` | PHP 8.4-FPM with Laravel | Internal port 9000 |
| `database` | MySQL 8.4 | Internal only |

The multi-stage root Dockerfile builds React with Node 24 and installs locked PHP dependencies with Composer. Requests share one origin: `/api` reaches Laravel, `/app/assets` serves static assets, and browser routes return the React index through Laravel.

`mysql-data` persists the database. `storage-data` persists uploads and Laravel runtime storage. Startup runs forward migrations and initial-admin seeding. Database, FPM and HTTP readiness checks must actually succeed.

```text
docker compose ps
docker compose logs --tail=100
docker compose stop
docker compose start
docker compose down
```

These commands preserve volumes. Do not use `down --volumes` unless deliberately deleting all local data. Do not change `APP_KEY` or database passwords after initialization without planning a migration.

Change `WEB_PORT` if 8080 is occupied. `WEB_BIND_ADDRESS` defaults to loopback. The course checkout is in demo mode; SMTP and real payment processing are not configured.

This Windows workspace has no local Docker engine. GitHub Actions builds this exact stack, starts it, checks API/database readiness, restarts the backend, and runs Chromium browser tests before permitting deployment.
